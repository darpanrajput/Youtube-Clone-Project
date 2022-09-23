import React, { useEffect } from "react";
import { useState } from "react";
import Card from "../../components/card/Card";
import "./home.scss";
import axios from "axios";

const Home = ({ type }) => {
  const [video, setVideo] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    // const cancelToken = axios.CancelToken.source();
    const fetchVideo = async () => {
      console.log("fetch called");
      try {
        const res = await axios.get(`/videos/${type}`, {
          // cancelToken: cancelToken.token,
        });
        setVideo(res.data);
      } catch (err) {
        console.log(err);
        if (axios.isCancel) {
          setError(
            `status :${err.response.data.status} \n${err.response.data.message} please sign in first`
          );
        } else {
          setError(err.message);
        }
      }
    };
    fetchVideo();
    // return () => {
    //   cancelToken.cancel();
    // };
  }, [type]);

  return (
    <div className="Home-Container">
      {error ? error : video.map((v) => <Card key={v._id} video={v} />)}
    </div>
  );
};

export default Home;
