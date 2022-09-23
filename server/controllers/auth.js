import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });
        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
        const { password, ...otherDetails } = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(otherDetails);

    } catch (err) {

        next(err);

    }
}

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return next(createError(404, "user not found"));
        }

        const isCorrect = bcrypt.compare(req.body.password, user.password);//return true if both are equal;

        if (!isCorrect) { return next(createError(400, "Wrong Password!")); }
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
        const { password, ...otherDetails } = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(otherDetails);
    } catch (err) {

        next(err);
    }
}
export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            //if user exist that means we alreday have sign up we need
            //to authenticate now based on email provided
            //and send the token alogn with json user object
            const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
            res.cookie("access_token", token, {
                httpOnly: true,
            }).status(200).json(user._doc);

        } else {
            //that means user is logging first time from th google Auth
            //we need to create the new user in the database and send the
            //whole response to the user.

            const newUser = new User({
                ...req.body,
                fromGoogle: true,
            });
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT_KEY);
            res.cookie("access_token", token, {
                httpOnly: true,
            }).status(200).json(savedUser._doc);
        }


    } catch (err) {

        next(err);
    }
}