import Media from "../models/media.model";
import extend from "lodash/extend";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";

// Media Streaming
import mongoose, { mongo } from "mongoose";
let gridfs = null;
mongoose.connection.on("connected", () => {
  gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
});

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Video could not be uploaded",
      });
    }
    let media = new Media(fields);
    media.postedBy = req.profile;
    if (files.video) {
      let writestream = gridfs.openUploadStream(media._id, {
        contentType: files.video.type || "binary/octet-stream",
      });
      fs.createReadStream(files.video.path).pipe(writestream);
    }
    try {
      let result = await media.save();
      res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const mediaByID = async (req, res, next, id) => {
  try {
    let media = await (await Media.findById(id))
      .populate("postedBy", "_id name")
      .exec();
    if (!media)
      return res.status("400").json({
        error: "Media not found",
      });
    res.media = media;
    let files = await gridfs.find({ filename: media._id }).toArray();
    if (!files[0]) {
      return res.status(404).send({
        error: "No video found",
      });
    }
    req.file = files[0];
    next();
  } catch (err) {
    return res.status(404).send({
      error: "Could not retirieve media file",
    });
  }
};

export default { create, mediaByID };
