import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/card/Card";
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10;
`;
const Search = () => {
  const [videos, setVideos] = useState([]);
  const query = useLocation().search;

  useEffect(() => {
    const fetchVidos = async () => {
      try {
        const res = await axios.get(`/videos/search${query}`);
        setVideos(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchVidos();
  }, [query]);
  return (
    <Container>
      {videos.map((v) => (
        <Card key={v._id} video={v} />
      ))}
    </Container>
  );
};

export default Search;
