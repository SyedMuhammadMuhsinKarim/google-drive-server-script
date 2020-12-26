import models from "./model";
import axios from "axios";

const googleLinkCheck = (req, res, next) => {
  axios(
    `https://www.googleapis.com/drive/v2/files/${req.idLink}?key=${req.apiKey}`
  )
    .then((myRes) => {
      req.dataReady = {
        g_id: myRes.data.id,
        g_down: myRes.data.downloadUrl,
        title: myRes.data.title,
        size: myRes.data.fileSize,
        quality: `${myRes.data.videoMediaMetadata.height}p`,
        format: myRes.data.mimeType,
        duration: myRes.data.videoMediaMetadata.durationMillis
      };
      next();
    })
    .catch((e) => {
      e.code === 404 ? res.status(404).send(e.message) : res.sendStatus(400);
    });
};

const databaseCheck = (req, res, next) => {
  models
    .find({ g_id: req.idLink })
    .then((result) => {
      if (result[0].g_id !== req.idLink) {
        next();
      } else {
        res.status(409).send(result[0]._id);
      }
    })
    .catch((e) => console.log("database", e));
};

const googleLinkVerification = (req, res, next) => {
  let link = req.body.link;
  req.apiKey = req.body.apiKey;
  const regexMatchOne = /https:\/\/drive\.google.com\/file\/d\/(.+?)\/(.+?)/g;
  const regexMatchTwo = /https:\/\/drive\.google\.com\/open\?id\/=(.+?)/g;

  if (link.match(regexMatchOne)) {
    req.idLink = link.split("/")[5];
    next();
  } else if (link.match(regexMatchTwo)) {
    req.idLink = link.split("=")[2];
    next();
  } else {
    res.status(406).send("it is incorrect google drive link");
  }
};

export { googleLinkCheck, googleLinkVerification, databaseCheck };
