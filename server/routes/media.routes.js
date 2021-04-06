import express from "express";
import userCtrl from "../controllers/user.controller";
import authrCtrl from "../controllers/auth.controller";
import mediaCtrl from "../controllers/media.controller";

const router = express.Router();

router
  .route("/api/media/new/:userId")
  .post(authrCtrl.requireSignin, mediaCtrl.create);

router.route("/api/media/video/:mediaId").get(mediaCtrl.video);

router.param("userId", userCtrl.userByID);
router.param("mediaId", mediaCtrl.mediaByID);

export default router;
