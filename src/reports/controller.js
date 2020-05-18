import models from "./model";

const get_report = async (req, res) => {
  const Link = await models
    .find()
    .limit(10)
    .sort({ size: -1 });
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
  const { link_id } = req.body;
  models
    .create({
      link_id: link_id
    })
    .then(() => res.send("Link Reported"))
    .catch(err => {
      if (err.code === 11000) {
        // console.log("Already Reported", err.message);
        res.sendStatus(409, "Already Reported");
      } else {
        res.send("Something wrong, try again");
      }
    });
};

export { get_report, get_report_with_id, post_report_with_id };
