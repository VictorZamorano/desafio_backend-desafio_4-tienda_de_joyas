import { Router } from "express";
import { myController } from "../controllers/controllers.js";
import { queryReport } from "../middlewares/queryInterceptor.js";

const router = Router();

router.get("/joyas", queryReport, myController.getAllJewels);
router.get("/joyas/joya/:id", queryReport, myController.getIdJewel);
router.get("/joyas/filters", queryReport, myController.getJewelsFilters);

export default router;
