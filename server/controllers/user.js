import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const updateUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id,
                {
                    $set: req.body
                },

                { new: true })

            if (!updatedUser) return next(createError(404, "No user found! To update"));

            res.status(200).json(updatedUser);

        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(401, "You Can update only your account"));
    }


}

export const deleteUser = async (req, res, next) => {

    if (req.params.id === req.user.id) {
        try {
            const updateUser = await User.findByIdAndDelete(req.params.id);
            if (!updateUser) return next(createError(404, "No user found to delete"))
            res.status(200).json(updateUser.email + " has been deleted");

        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(401, "You Can update only your account"));
    }
}


export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            if (!user) return next(createError(404, "No user found!"))
        }
        res.status(200).json(user);

    } catch (err) {
        next(err);
    }

}


export const subscribe = async (req, res, next) => {
    /*this  method is used to subscribe to the channel 
    by passing the channel id of that channel
    API-->locallhost:5000/api/sub/:channelId
    there will be 2 things that we need to do
    1)inside User Model push the passed channel id to subscriberUser array.
    2)increase the subscriber count of that channel id.

    ****************************************************
    here req.user.id -> is my currently logged in user id
    that we used in verify token where we assigned the
    token object to the req.user object.
    req.params.id is the channel id of that channel that
    I(=current user wants the subscription of).  */

    try {
        await User.findByIdAndUpdate(req.user.id,
            {
                $push: { subscribedUsers: req.params.channelId }
            })

        /* In real the channel Id is actually the user Id of
        owner of that channel so we can actually find the 
        User Model in MongoDB & can increase its subscriber count by 1.*/
        await User.findByIdAndUpdate(req.params.channelId, {

            $inc: { subscribers: 1 }
        })

        /* finally sending the response */

        res.status(200).json("Subsrciption Successfull")
    } catch (err) {
        next(err);
    }

}

export const unsubscribe = async (req, res, next) => {

    try {
        //This time we have to pull the channelID/userid out of the array
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.channelId }
        })


        //and consequently decrease the subscriber account of that user.
        await User.findByIdAndUpdate(req.params.channelId, {

            $inc: { subscribers: -1 }
        })

        res.status(200).json("UnSubsrciption Successfull")
    } catch (err) {
        next(err);
    }

}

export const like = async (req, res, next) => {
    const userId = req.user.id;//created and made globally available when verifying the token check verifyToken method
    const videoId = req.params.videoId;//videoID was passed inside the URL

    //$addToset method will not duplicate and will add the value uniquley into the array
    try {

        const likedVideo = await Video.findByIdAndUpdate(videoId,
            {
                $addToSet: { likes: userId },
                $pull: { dislikes: userId }

            }, { new: true })

        res.status(200).json({ "message": "liked", "video": likedVideo });

    } catch (err) {
        next(err);
    }

}


export const dislike = async (req, res, next) => {
    const userId = req.user.id;//created and made globally available when verifying the token check verifyToken method
    const videoId = req.params.videoId;//videoID was passed inside the URL

    try {


        const disLikedVideo = await Video.findByIdAndUpdate(videoId,
            {
                $addToSet: { dislikes: userId },
                $pull: { likes: userId },


            }, { new: true })

        res.status(200).json({ "message": "disliked", "video": disLikedVideo });
    } catch (err) {
        next(err);
    }

}