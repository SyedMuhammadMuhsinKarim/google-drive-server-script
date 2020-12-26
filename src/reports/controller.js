import models from "./model";

const get_report = async (req, res) => {
  const Link = await models.find().limit(10).sort({ size: -1 });
  return res.send(Link);
};

const get_report_with_id = async (req, res) => {
  try {
    const result = await models.findById(req.params.id);
    (await result) ? res.send(result) : res.sendStatus(404, "Item Not Found");
  } catch (err) {
    res.status(500).send("Error", err.message);
  }
};

const post_report_with_id = (req, res) => {
  const { getId } = req;
  models
    .create({
      link_id: getId
    })
    .then(() => res.json({ message: "Link Reported" }))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(409).json({ error: err.code, mesaage: err.message });
      } else {
        res.status(404).json({ error: err.code, mesaage: err.message });
      }
    });
};

export { get_report, get_report_with_id, post_report_with_id };
