import express from "express";
import { deleteUser, dislike, getUser, like, subscribe, unsubscribe, updateUser } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js"
const router = express.Router();


//update the user
router.put("/:id", verifyToken, updateUser);


//Delete the User
router.delete("/:id", verifyToken, deleteUser);


//Get a user
router.get("/find/:id", getUser);

//Like
router.put("/like/:videoId", verifyToken, like);


//Dislike
router.put("/dislike/:videoId", verifyToken, dislike);


//Subcribed by a user

router.put("/sub/:channelId", verifyToken, subscribe);


//Unsubscribe the videro channel

router.put("/unsub/:channelId", verifyToken, unsubscribe);





export default router;