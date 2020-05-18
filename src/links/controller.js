import models from "./model";

const get_link = async (req, res) => {
  const Link = await models
    .find()
    .limit(10)
    .sort({ size: -1 });
  return res.send(Link);
};

const get_link_with_id = async (req, res) => {
  try {
    const result = await models.findById(req.params.id);
    (await result) ? res.send(result) : res.sendStatus(404, "Item Not Found");
  } catch (err) {
    res.status(500).send("Error", err.message);
  }
};

const post_link_with_id = (req, res) => {
  models
    .create(req.dataReady)
    .then(result => res.json(result))
    .catch(err => {
      // err.code === 11000
      //   ? res.status(400).send("You Cannot Add Duplicate Link")
      //   : res.send(err.message);
      console.log("Duplicate", err.message);
      res.sendStatus(409);
    });
};

module.exports = {
  get_link,
  get_link_with_id,
  post_link_with_id
};
