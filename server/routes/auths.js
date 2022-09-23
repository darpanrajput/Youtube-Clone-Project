import express from "express";
import { signin, signup, googleAuth } from "../controllers/auth.js";
const router = express.Router();

// router.get("/test", test);

//CREATE A USER

router.post("/signup", signup);





//SIGN IN
router.post("/signin", signin);



// GOOGLE AUTHENTICATION
router.post("/google", googleAuth)



export default router;