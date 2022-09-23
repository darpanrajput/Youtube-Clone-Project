import React, { memo } from "react";
import { useRef } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Wrapper = styled.div`
  width: 600px;
  height: 95vh;
  background-color: ${(props) => (props.isDark ? "#202020" : "#FFFFFF")};
  color: ${(props) => (props.isDark ? "#FFFFFF" : "#000000")};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow-y: scroll !important;
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
const Title = styled.h2`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${(props) => (props.isDark ? "#373737" : "#f5f5f5")};
  color: ${(props) => (props.isDark ? "#FFFFFF" : "#000000")};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  height: 100px;
`;

const VidePreview = styled.video`
  width: 100%;
  height: 200px;
`;

const ThumbnailPreview = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const Description = styled.textarea`
  border: 1px solid ${(props) => (props.isDark ? "#373737" : "#f5f5f5")};
  color: ${(props) => (props.isDark ? "#FFFFFF" : "#000000")};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  height: 150px;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${(props) => (props.isDark ? "#373737" : "#f5f5f5")};
  color: ${(props) => (props.isDark ? "#aaaaaa" : "#606060")};
`;

const Lable = styled.label`
  font-size: 14px;
`;

const Error = styled.span`
  font-size: 14;
  color: red;
`;
const UploadPopup = (props) => {
  const [error, setError] = useState("");
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [videoPercentage, setVideoPercentage] = useState(0);
  const [imgPercentage, setImagePercentage] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const title = useRef("");
  const description = useRef("");
  const tags = useRef("");
  const navigate = useNavigate();
  let TagsList = [];
  let imageDownloadUrl = null;
  let videoDownloadUrl = null;

  const handleUpload = (e) => {
    console.log("Title", title.current.value);
    console.log("Desc", description.current.value);

    e.preventDefault();

    if (title.current.value.trim() === "") {
      setError("No Title");
    } else if (description.current.value.trim() === "") {
      setError("No Description");
    } else if (tags.current.value.trim() === "") {
      setError("No Tags Provided");
    } else if (!video) {
      setError("NO video to upload");
    } else if (!img) {
      setError("No Image to Upload");
    } else {
      TagsList = tags.current.value.split(",");
      console.log("Tags", TagsList);
      setError(false);
      uploadFile(video, "videos");
      uploadFile(img, "thumbnails");
    }
  };

  const uploadFile = (file, folderName) => {
    const storage = getStorage(app);
    // Create a reference to 'images/mountains.jpg'
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, folderName + "/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setIsUploading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        folderName === "videos"
          ? setVideoPercentage(progress)
          : setImagePercentage(progress);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (folderName === "videos") {
            videoDownloadUrl = downloadURL;
          } else {
            imageDownloadUrl = downloadURL;
          }
          setIsUploading(false);
          console.log("videoDownloadUrl", videoDownloadUrl);
          console.log("imageDownloadUrl", imageDownloadUrl);

          //when both are uploaded successfully saved data in MONGODB
          if (videoDownloadUrl && imageDownloadUrl) {
            const postVideo = async () => {
              //creating function
              try {
                const res = await axios.post("/videos", {
                  title: title.current.value.trim(),
                  desc: description.current.value.trim(),
                  imgUrl: imageDownloadUrl,
                  videoUrl: videoDownloadUrl,
                  tags: TagsList,
                });

                props.setIsVidoButtonOpen(false);
                navigate(`/video/${res.data._id}`);
              } catch (err) {
                console.log(err);
              }
            };

            postVideo(); //calling function
          }
        });
      }
    );
  };

  // useEffect(() => {
  //   // video && uploadFile(video, "videos");
  //   // imageDownloadUrl && uploadFile(img, "thumbnails");
  // }, [video]);

  console.log("img", img);

  return (
    <Container>
      <Wrapper isDark={props.isDark}>
        <Close onClick={() => props.setIsVidoButtonOpen(false)}>X</Close>
        <Title>Upload your video</Title>
        <Lable>Video:</Lable>
        {videoPercentage > 0 ? (
          "Uploading: " + Math.round(videoPercentage) + "%"
        ) : (
          <Input
            isDark={props.isDark}
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}
        {video && <VideoUploadPreview video={video} />}
        <Input
          isDark={props.isDark}
          type="text"
          placeholder="Title"
          defaultValue={video ? video.name : ""}
          maxLength={800}
          ref={title}
        />
        <Description
          isDark={props.isDark}
          type="text"
          placeholder="Description"
          rows={8}
          ref={description}
        />
        <Input
          isDark={props.isDark}
          type="text"
          placeholder="Separate Tags with Comma(eg tech,mobile,new-age"
          ref={tags}
        />
        <Lable>Image:</Lable>
        {imgPercentage > 0 ? (
          "Uploading: " + Math.round(imgPercentage) + "%"
        ) : (
          <Input
            isDark={props.isDark}
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}
        {/* {img && <ThumbnailPreview src={URL.createObjectURL(img)} />} */}
        {error && <Error>{error}</Error>}
        <Button
          isDark={props.isDark}
          onClick={handleUpload}
          disabled={isUploading}
        >
          Upload
        </Button>
      </Wrapper>
    </Container>
  );
};

export default memo(UploadPopup);

export const VideoUploadPreview = memo(({ video }) => {
  return <VidePreview src={URL.createObjectURL(video)} />;
});
