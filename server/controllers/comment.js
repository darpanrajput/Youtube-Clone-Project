import { createError } from "../error.js";
import Comment from "../models/Comment.js";

//adding a new comment will require to be authenticated and verify you identity
export const addComment = async (req, res, next) => {

    //creating  a new comment object for storage
    //req.user.id will be comming from verify token where we saved the user id to acces it globally
    const newCommnet = new Comment({ userId: req.user.id, ...req.body })
    try {
        const savedComment = await newCommnet.save();
        res.status(200).json(savedComment);
    } catch (err) {
        next(err);
    }
}




//deleting an individual comment will require you to be authenticated
export const deleteComment = async (req, res, next) => {
    try {
        //we first need to find the user to delete its comment
        const comment = await Comment.findById(req.params.id)

        //finding the associated video linked with that comment
        const video = Comment.findById(req.params.id)


        // if we are owner of the comment we can delete it or 
        //also if we are the owner of the video then also we can delete;

        if (req.user.id === comment.userId || req.user.id === video.userId) {

            const deleteComment = await Comment.findByIdAndDelete(req.params.id);

            res.status(200).json({ message: "comment has been deleted", deleteComment })
        } else {
            next(createError(403, "You can delete only your comment"))
        }
    } catch (err) {
        next(err);
    }
}




//get comments for a video
export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoId }).limit(10);
        res.status(200).json(comments);

    } catch (err) {
        next(err);
    }
}