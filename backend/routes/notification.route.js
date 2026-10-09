import express from "express";
import { getNotification,deleteNotification } from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/",protectRoute,getNotification);
router.delete("/",protectRoute,deleteNotification);

export default router;