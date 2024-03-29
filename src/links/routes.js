import express from "express";
import * as controller from "./controller";
import * as middleware from "./middleware";

// Constants
const router = express.Router({ mergeParams: true });

// Routes
router.get("/:id", controller.get_link_with_id);
router.post(
  "/",
  middleware.googleLinkVerification,
  middleware.databaseCheck,
  middleware.googleLinkCheck,
  controller.post_link_with_id
);

export default router;
