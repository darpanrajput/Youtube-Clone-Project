import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./video.scss";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import { AVATAR_MALE, IMAGE } from "../../constant";
import Comment from "../../components/comments/Comment";
import { Comments } from "../../components/comments/Comments";
import Card from "../../components/card/Card";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  dislike,
  fetchVideoFailed,
  fetchVideoSuccess,
  like,
} from "../../redux/videoSlice";
import { format } from "timeago.js";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { subscription } from "../../redux/userSlice";

import styled from "styled-components";
import Recommendation from "../../components/Recommendation";
import ErrorPage from "../ErrorPage";

const SubscribeButton = styled.button`
  background-color: ${(prop) => (prop.isSubscibed ? "#565353" : "#cc1a00")};
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;
const Video = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const isDark = useSelector((state) => state.theme.isDark);
  const { currentVideo } = useSelector((state) => state.video);
  const { currentUser } = useSelector((state) => state.user);
  const { tags } = useSelector((state) =>
    state.video.currentVideo ? state.video.currentVideo : []
  );
  console.log("currentUser", currentUser);
  const path = useLocation().pathname.split("/")[2];
  // console.log("path=", path);
  const [channel, setChannel] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        console.log("video=", videoRes.data);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        dispatch(fetchVideoSuccess(videoRes.data));
      } catch (err) {
        console.log(err);
        dispatch(fetchVideoFailed());
        setError(err);
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    if (!currentUser) {
      alert("you are not signed in");
    } else {
      await axios.put(`/users/like/${currentVideo._id}`);
      dispatch(like(currentUser._id));
    }
  };

  const handleDisLike = async () => {
    if (!currentUser) {
      alert("you are not signed in");
    } else {
      await axios.put(`/users/dislike/${currentVideo._id}`);
      dispatch(dislike(currentUser._id));
    }
  };

  const handleSubscription = async () => {
    if (!currentUser) {
      alert("you are not signed in");
    } else {
      currentUser.subscribedUsers.includes(channel._id)
        ? await axios.put(`/users/unsub/${channel._id}`)
        : await axios.put(`/users/sub/${channel._id}`);
      dispatch(subscription(channel._id));
    }
  };

  return error ? (
    <ErrorPage
      error={`status:${error.response.data.status} ${error.response.data.message}`}
    />
  ) : (
    <div className="Video-Container">
      <div className="Content">
        <div className="Video-Wrapper">
          {/* <iframe
            width="100%"
            height="620"
            src="https://www.youtube.com/embed/GaC9m93ACP8"
            title="youtube video Player"
            frameBorder="0"
            allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
            allowFullScreen
          ></iframe> */}

          <VideoFrame src={currentVideo?.videoUrl} controls type="video/mp4" />
          {console.log("channel?.videoUrl", currentVideo?.videoUrl)}
        </div>
        <h1 className={isDark ? "Title" : "Title Light"}>
          {currentVideo?.title}
        </h1>
        <div className="Details">
          <div className={isDark ? "Info" : "Info Light"}>
            {currentVideo?.views} views . {format(currentVideo?.createdAt)}
          </div>
          <div className={isDark ? "Buttons" : "Buttons Light"}>
            <div className="Button" onClick={handleLike}>
              {currentVideo?.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
              {currentVideo?.likes?.length}
            </div>
            <div className="Button" onClick={handleDisLike}>
              {currentVideo?.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}
              {currentVideo?.dislikes?.length}
            </div>
            <div className="Button">
              <ReplyOutlinedIcon />
              Share
            </div>
            <div className="Button">
              <AddTaskOutlinedIcon />
              Save
            </div>
          </div>
        </div>
        <hr className={isDark ? "HR" : "HR Light"} />
        <div className="Channel">
          <div className="Channel-Info">
            <img
              src={channel.img || AVATAR_MALE}
              alt="channel"
              className="Channel-Image"
              referrerPolicy="no-referrer"
            />
            <div
              className={isDark ? "Channel-Details" : "Channel-Details Light"}
            >
              <span
                className={
                  isDark ? "Video-Channel-Name" : "Video-Channel-Name Light"
                }
              >
                {channel.name}
              </span>
              <span
                className={isDark ? "Channel-Counter" : "Channel-Counter Light"}
              >
                {channel.subscribers} subsrciber
              </span>

              <p className="Channel-Description">
                {currentVideo?.desc}
                <br />
                {tags &&
                  tags.map((tag) => (
                    <b
                      key={tag + new Date()}
                      style={{ color: "#3EA6FF" }}
                    >{` #${tag} `}</b>
                  ))}
              </p>
            </div>
          </div>

          {currentUser?.subscribedUsers.includes(channel._id) ? (
            <SubscribeButton onClick={handleSubscription} isSubscibed={true}>
              SUBSCRIBED
            </SubscribeButton>
          ) : (
            <SubscribeButton onClick={handleSubscription} isSubscibed={false}>
              SUBSCRIBE
            </SubscribeButton>
          )}
          {/* <button className="Channel-Button" onClick={handleSubscription}>
            {currentUser.subscribedUsers.includes(channel._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </button> */}
        </div>
        <hr className={isDark ? "HR" : "HR Light"} />
        {currentUser && <Comment />}
        <Comments videoId={currentVideo?._id} />
      </div>

      {tags && <Recommendation tags={currentVideo?.tags} />}
    </div>
  );
};

export default Video;
