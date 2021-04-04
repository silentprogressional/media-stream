import express from "express";
import userCtrl from "../controllers/user.controller";
import authrCtrl from "../controllers/auth.controller";
import mediaCtrl from "../controllers/media.controller";

const router = express.Router();

router
  .route("/api/media/new/:userId")
  .post(authrCtrl.requireSignin, mediaCtrl.create);

router.param("userId", userCtrl.userByID);

export default router;
