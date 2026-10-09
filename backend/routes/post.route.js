import express from "express";
import { createPost,deletePost ,commentOnPost,likeDislikePost,getAllPost,getUserPost,likedUserPost,getFollowingPost} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create",protectRoute,createPost);
router.delete("/delete/:id",protectRoute,deletePost);
router.post("/comments/:id",protectRoute,commentOnPost);
router.post("/like/:id",protectRoute,likeDislikePost);
router.get("/all",protectRoute,getAllPost);
router.get("/user/:username",protectRoute,getUserPost);
router.get("/liked/:id",protectRoute,likedUserPost);
router.get("/following",protectRoute,getFollowingPost);

export default router;
