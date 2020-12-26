import linkModel from "./../links/model";

const getLinkId = async (req, res, next) => {
  const { link_id } = req.body;
  try {
    const result = await linkModel.findById(link_id);
    if (result) {
      req.getId = result;
      next();
    } else {
      res.sendStatus(404, "Item Not Found");
    }
  } catch (error) {
    res.status(500).send("Error", error.message);
  }
};

export { getLinkId };
