import models from "./model";
import axios from "axios";
const googleDefaultLink = "https://www.googleapis.com/drive/v2/files/";
const googleLinkCheck = (req, res, next) => {
  axios(`${googleDefaultLink}${req.idLink}?key=${req.apiKey}`)
    .then((myRes) => {
      req.dataReady = {
        g_id: myRes.data.id,
        g_down: myRes.data.downloadUrl,
        api_key: req.apiKey,
        title: myRes.data.title,
        size: myRes.data.fileSize,
        quality: `${myRes.data.videoMediaMetadata.height}p`,
        format: myRes.data.mimeType,
        duration: myRes.data.videoMediaMetadata.durationMillis + "ms"
      };

      next();
    })
    .catch((e) => {
      if (e.code === 404) {
        res.status(404).send({ code: 404, message: e.message });
      } else {
        console.log(e.code);
        res.status(e.code).send({
          code: e.code,
          error_message: e.message,
          link_id: req.idLink
        });
      }
    });
};

const databaseCheck = (req, res, next) => {
  models
    .find({ g_id: req.idLink })
    .then((result) => {
      if (result[0].g_id !== req.idLink) {
        next();
      } else {
        res.status(409).send({
          code: 409,
          message: "link available on our database",
          link_id: result[0]._id,
          g_id: req.idLink
        });
      }
    })
    .catch((e) => {
      console.log("database", e);
    });
};

const googleLinkVerification = (req, res, next) => {
  const link = req.body.link;
  const regexMatchOne = /https:\/\/drive\.google.com\/file\/d\/(.+?)+\/(.+?)+/gi;
  const regexMatchTwo = /https:\/\/drive\.google\.com\/open\?id=(.+?)+/gi;

  req.apiKey = req.body.apiKey;

  try {
    if (link.match(regexMatchOne)) {
      req.idLink = link.split("/")[5];
      next();
    } else if (link.match(regexMatchTwo)) {
      req.idLink = link.split("=")[2];
      next();
    } else {
      res.status(406).send({
        code: 406,
        message: "it is incorrect google drive link"
      });
    }
  } catch (e) {
    res.status(500).send({
      code: 500,
      message: "Link matching issue",
      link: String(link)
    });
  }
};

export { googleLinkCheck, googleLinkVerification, databaseCheck };
