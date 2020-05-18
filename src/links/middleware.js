import models from "./model";
import axios from "axios";

const googleLinkCheck = (req, res, next) => {
  axios(
    `https://www.googleapis.com/drive/v2/files/${req.idLink}?key=${
      process.env.DRIVEAPIKEY
    }`
  )
    .then(myRes => {
      // console.log(myRes.data);
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
    .catch(e => {
      console.log("CheckError", e.message);
      res.json(e);
    });
};

const databaseCheck = (req, res, next) => {
  models
    .find({ g_id: req.idLink })
    .then(result => {
      console.log("databaseChecked", result[0].g_id, req.idLink);
      if (result[0].g_id !== req.idLink) {
        console.log("databaseChecked", result[0].g_id, req.idLink);
        next();
      } else {
        console.log("databaseCheckedFailed");
        res.status(409).send(result[0]._id);
      }
    })
    .catch(e => console.log("database", e));
};

const googleLinkVerification = (req, res, next) => {
  console.log(req.body.link, req.body.apiKey);
  let link = req.body.link;
  req.apiKey = req.body.apiKey;
  const regexMatchOne = /https:\/\/drive\.google.com\/file\/d\/(.+?)\/(.+?)/g;
  const regexMatchTwo = /https:\/\/drive\.google\.com\/open\?id\/=(.+?)/g;

  if (link.match(regexMatchOne)) {
    // console.log("Matched");
    req.idLink = link.split("/")[5];
    next();
  } else if (link.match(regexMatchTwo)) {
    // console.log("Matched");
    req.idLink = link.split("=")[2];
    next();
  } else {
    res.sendStatus(406);
  }
};

export { googleLinkCheck, googleLinkVerification, databaseCheck };
