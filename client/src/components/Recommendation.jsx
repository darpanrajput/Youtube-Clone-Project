import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import Card from "./card/Card";

const Container = styled.div`
  flex: 2;
`;
const Recommendation = ({ tags }) => {
  const [video, setVideo] = useState([]);
  console.log("tags", tags[0]);
  useEffect(() => {
    const fetcVideUsingTags = async () => {
      try {
        const res = await axios.get(`/videos/tags?tags=${tags[0]}`);
        setVideo(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetcVideUsingTags();
  }, [tags]);

  return (
    <Container>
      {video.map((v) => (
        <Card type="sm" key={v._id} video={v} />
      ))}
    </Container>
  );
};

export default Recommendation;
