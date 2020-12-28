import models from "./model";
import axios from "axios";

const googleLinkCheck = (req, res, next) => {
  try {
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
        console.log("gd_verfication failed:", e.message);
        e.code === 404
          ? res.status(404).send({ code: 404, message: e.message })
          : res.status(400).send({ code: 400, message: "Bad Request" });
      });
  } catch (e) {
    console.log(e);
    res
      .status(406)
      .send({ code: 406, message: "verfication failed, during fetching" });
  }
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
  const regexMatchOne = /https:\/\/drive\.google.com\/file\/d\/(.+?)+\/(.+?)+/gi;
  const regexMatchTwo = /https:\/\/drive\.google\.com\/open\?id=(.+?)+/gi;
  try {
    if (link.match(regexMatchOne)) {
      req.idLink = link.split("/")[5];
      next();
    } else if (link.match(regexMatchTwo)) {
      req.idLink = link.split("=")[2];
      next();
    } else {
      res
        .status(406)
        .send({ code: 406, message: "it is incorrect google drive link" });
    }
  } catch {
    res.status(500).send({ code: 500, message: "server side issue" });
  }
};

export { googleLinkCheck, googleLinkVerification, databaseCheck };
