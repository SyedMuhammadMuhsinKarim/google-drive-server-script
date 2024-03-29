import models from "./model";

const get_link = async (req, res) => {
  const link = await models.find().limit(10).sort({ size: -1 });
  return res.json(link);
};

const get_link_with_id = async (req, res) => {
  try {
    const result = await models.findById(req.params.id);
    if (await result) {
      res.send(result);
    } else {
      res.sendStatus(404, { code: 404, message: "Item Not Found" });
    }
  } catch (err) {
    res.status(500).send({ code: 500, message: "Error: " + err.message });
  }
};

const post_link_with_id = (req, res) => {
  try {
    models
      .create(req.dataReady)
      .then((result) => res.json(result))
      .catch((err) => {
        res.status(409).send({ code: 400, message: `${err.message}` });
      });
  } catch {
    res.status(500).send({ code: 500, message: "post link failed " });
  }
};

module.exports = {
  get_link,
  get_link_with_id,
  post_link_with_id
};
