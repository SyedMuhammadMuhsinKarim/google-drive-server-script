import express from "express";
import * as controller from "./controller";
import * as middleware from "./middleware";

// Constants
const router = express.Router({ mergeParams: true });

// Routes
router.get("/", controller.get_report);
router.get("/:id", controller.get_report_with_id); // get reported data through id
router.post("/create", middleware.getLinkId, controller.post_report_with_id); // post report by id

export default router;
