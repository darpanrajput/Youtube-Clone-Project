import express from "express";
import { addVideo, addViews, deleteVideo, getByVideoByTag, getVideo, ramdomVideo, search, subscribedVideo, trendingVideo, updateVideo, streamVideo } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, addVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.get("/stream/:id", streamVideo);
router.put("/:id", verifyToken, updateVideo);

//update the views on a particular video id
//when we visit the video page we are gonna increase the video count by
//you do not need to be authenticated in orders to increase video count
router.put("/views/:id", addViews);

//we can get the trending videos
router.get("/trend", trendingVideo);

// we get the random videos
router.get("/random", ramdomVideo);

//we can get all the videos from the subcribed channel
router.get("/sub", verifyToken, subscribedVideo);

//get video by it tags
router.get("/tags", getByVideoByTag);

//get videos by its title search
router.get("/search", search);


export default router;