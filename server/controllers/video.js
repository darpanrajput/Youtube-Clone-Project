import User from '../models/User.js'
import Video from '../models/Video.js'
import { createError } from "../error.js";
import fs from "fs";

export const addVideo = async (req, res, next) => {
    /* here the req.user.id is expelling from verifyToken.js where we saved token object in req.user */
    const newvideo = new Video({ userId: req.user.id, ...req.body });//created a new video object
    try {

        const savedVideo = await newvideo.save()
        res.status(200).json(savedVideo);
    } catch (err) {
        next(err);
    }

}

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "No user video! To update"));
        if (req.user.id === video.userId) {
            /* this means we are the owner of this video and we update our own video 
            req.user.id is comming from verify token where we saved token object in req.user 
            to make it globally available throughout the project.
            */
            const updatedVideo = await Video.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body
                }, { new: true })


            res.status(200).json(updatedVideo)
        } else {
            return next(createError(403, "you can only update your video"));
        }

    } catch (err) {
        next(err);
    }
}



// DELETING A VIDEO

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) return next(createError(404, "No user video! To update"));

        if (req.user.id === video.userId) {

            const deletedVideo = await Video.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "video has been deleted", deletedVideo })

        }

        else {

            return next(createError(403, "you can only Delete your video"));
        }

    } catch (err) {
        next(err);
    }
}





//Simply get the Video Object from DB & also update video views by 1
export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findByIdAndUpdate(req.params.id,
            { $inc: { views: 1 } }, { new: true });

        if (!video) return next(createError(404, "No Vido Found"));

        res.status(200).json(video);
    } catch (err) {
        next(err);
    }
}




//streamin with chunks
export const streamVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "No Video Found"));

        const videoPath = video.videoUrl + '.mp4';
        const size = fs.statSync(videoPath).size;
        console.log('size=', size);
        const range = req.header.range;
        const CHUNK_SIZE = 10 ** 7//10 MB

        if (range) {

            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + CHUNK_SIZE, size - 1);
            contentLength = end - start + 1;
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
            };

            res.writeHead(206, headers);
            const videoStream = fs.createReadStream(videoPath, {
                start, end
            });
            videoStream.pipe(res);

        } else {
            const headers = {
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
            };
            res.writeHead(206, headers);
            const videoStream = fs.createReadStream(videoPath);
            videoStream.pipe(res);

        }


    } catch (err) {
        next(err);
    }
}



//Add views to the videos when a user visit to video page
export const addViews = async (req, res, next) => {
    /* just increment the views property by */
    try {
        const video = await Video.findByIdAndUpdate(req.params.id,

            {

                $inc: { views: 1 }
            }

        );
        if (!video) return next(createError(404, "No Vido Found"));
        res.status(200).json({ message: "1 view added", video });
    } catch (err) {
        next(err);
    }
}


//get the Random videos


export const ramdomVideo = async (req, res, next) => {

    /* we can use the aggreagate function to get the ramdom
    sample video of size 40 . it will returen random 40 videos */
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
        if (!videos) return next(createError(404, "No Vido Found"));
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}


//Get the Trending Videos
export const trendingVideo = async (req, res, next) => {
    try {//bring out the most views videos-1 for less viewing videos and -1 for most viewing videos
        const videos = await Video.find().sort({ views: -1 });
        if (!videos) return next(createError(404, "No Vido Found"));
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}


//Get all the videos from a particular subsrcibed channel
export const subscribedVideo = async (req, res, next) => {
    try {
        /* inside the subcribedUser array there will be lot of ids
        we need to find all the videos associated with all that ids */

        // first we need to find our user otherwise we could not see that array

        const user = await User.findById(req.user.id);//user id save din verify token js file

        const subscribedChannel = user.subscribedUsers;//subscribedUsers are basically the userid who own that channel

        //finding every video of that channel . promise all will return only all the video will be found

        const list = await Promise.all(subscribedChannel.map(
            channelId => {
                return Video.find({ userId: channelId })
            }
        ))
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));//flat will prevent giving  the nested array
    } catch (err) {
        next(err);
    }
}


//Get the videos by its tags
export const getByVideoByTag = async (req, res, next) => {
    try {

        //http://localhost:8800/api/videos/tags?tags=js,c,python will use split method on query
        const tags = req.query.tags.split(",");//[js,c,python]
        // console.log(tags)
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        if (!videos) return next(createError(404, "No Vido Found"));
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}



//get the videos by its title search
export const search = async (req, res, next) => {
    try {


        //bring out the matching title videos
        const query = req.query.q;

        //regex for starting the search only from the start alphbet
        //option i means thet lowercase and uppercase does not holds much importance
        const videos = await Video.find(
            {
                title:
                {
                    $regex: query, $options: "i"
                },
            }).limit(20);

        // const videosSearch = await Video.find(
        //     {
        //         $text: {
        //             $search: query
        //         }
        //     }, { score: { $meta: "textScore" } }).limit(20);




        if (!videos) return next(createError(404, "No Vido Found"));
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}

