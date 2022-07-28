import { Router } from "express";
import { recommendationController } from "../controllers/recommendationController.js";

const e2eTestRouter = Router();

e2eTestRouter.post("/reset-recommendations", recommendationController.deleteAllRecommendation);

export default e2eTestRouter;