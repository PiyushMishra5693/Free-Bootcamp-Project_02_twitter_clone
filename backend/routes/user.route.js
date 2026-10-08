import express from "express";
import { getUserProfile ,followUnfollowUser, getSuggestedUser,updateUserProfile} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();


router.get("/profile/:username",protectRoute,getUserProfile);
router.get("/followUnfollow/:id",protectRoute,followUnfollowUser);
router.get("/suggested",protectRoute,getSuggestedUser);
router.put("/update",protectRoute,updateUserProfile);

export default router;

