import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./card.scss";
import { isValid } from "../../utils/isValid";
import { format } from "timeago.js";
import axios from "axios";
const Card = (props) => {
  const isDark = useSelector((state) => state.theme.isDark);
  console.log("props.type=", props?.type);
  const [userChannel, setUserChannel] = useState({});
  const [error, setError] = useState();

  useEffect(() => {
    // const cancelToken = axios.CancelToken.source();
    const fetchUserChannel = async () => {
      console.log("fetchUserChannel called");
      try {
        const res = await axios.get(`/users/find/${props.video?.userId}`, {
          // cancelToken: cancelToken.token,
        });
        setUserChannel(res.data);
      } catch (err) {
        console.log(err);
        if (axios.isCancel) {
          setError("canceled By Axios");
        } else {
          setError(err.message);
        }
      }
    };
    fetchUserChannel();
    // return () => {
    //   cancelToken.cancel();
    // };
  }, [props.video?.userId]);

  return (
    <Link to={`/video/${props?.video?._id}`} style={{ textDecoration: "none" }}>
      <div className={props?.type === "sm" ? "Card-SM" : "Card"}>
        <img
          className={props?.type === "sm" ? "Card-Image-SM" : "Card-Image"}
          src={
            isValid(props.video?.imgUrl)
              ? props.video?.imgUrl
              : "https://i.ytimg.com/vi/_v_TF8t3uOw/maxresdefault.jpg"
          }
          alt="card-image"
        />
        <div
          className={props?.type === "sm" ? "Card-Details-SM" : "Card-Details"}
        >
          <img
            src={
              userChannel?.img ||
              "https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
            }
            alt=""
            className={
              props?.type === "sm" ? "Channel-Image-SM" : "Channel-Image"
            }
          />
          <div className="Texts">
            <h1 className={isDark ? "Title" : "Title Light"}>
              {props?.type === "sm"
                ? props.video?.title.substring(0, 10) + "..."
                : props.video?.title}
            </h1>
            <h2 className={isDark ? "Channel-Name" : "Channel-Name Light"}>
              {userChannel.name}
            </h2>
            <div className={isDark ? "Info" : "Info Light"}>
              {`${props.video?.views} views . ${format(
                props.video?.createdAt
              )}`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
