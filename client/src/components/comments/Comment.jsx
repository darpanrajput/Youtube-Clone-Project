import React from "react";
import "./comment.scss";
import { AVATAR } from "../../constant";
import { useSelector } from "react-redux";

const Comment = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="Comment-Container">
      <div className="New-Comment">
        <img src={currentUser?.img || AVATAR} className="Avatar" />
        <input
          placeholder="New Comment"
          type="text"
          className={isDark ? "Input" : "Input Light"}
        />
      </div>
    </div>
  );
};

export default Comment;
