import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AVATAR } from "../../constant";
import { useSelector } from "react-redux";

import axios from "axios";
import { format } from "timeago.js";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  max-width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex: 1;
`;

const CommentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;
const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  margin-left: 5px;
`;
const Text = styled.span`
  font-size: 14px;
`;

export const CommentDescription = (props) => {
  const [commentedUser, setCommentedUser] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`/users/find/${props.com?.userId}`);
      setCommentedUser(res.data);
    };
    fetchComments();
  }, [props.com?.userId]);

  return (
    <>
      <Avatar src={commentedUser?.img || AVATAR} alt="comment-avatar" />
      <CommentDetails>
        <Name>
          {commentedUser?.name}
          <Date
            className={props.isDark ? "Date" : "Date Light"}
            style={{ color: "#aaaaaa" }}
          >
            {format(props.com?.createdAt)}
          </Date>
        </Name>

        <Text>{props.com?.desc}</Text>
      </CommentDetails>
    </>
  );
};

export const Comments = ({ videoId }) => {
  const isDark = useSelector((state) => state.theme.isDark);
  const [readMore, setReadMore] = useState(false);
  const [comments, setComments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);

        setComments(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchComments();
  }, [videoId]);

  return (
    <div>
      {comments.map((com) => (
        <Container className="Comments-Container" key={com._id}>
          <CommentDescription key={com._id} com={com} isDark={isDark} />
        </Container>
      ))}
    </div>
  );
};
