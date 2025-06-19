import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import { browsejobs, getAdminJobs, getAlljobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.route("/get").get(isAuthenticated,getAlljobs);
router.route("/getadminjobs").get(isAuthenticated,getAdminJobs);
router.route("/get/:id").get(isAuthenticated,getJobById);
router.route("/external").get(browsejobs);

export default router;
