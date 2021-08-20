import { Router } from "express";

import NewsController from "../controllers/news.controller";
import isAuth from "../middlewares/auth.middleware";


const router = Router();

router.get('/', NewsController.getNews);

router.post('/create', isAuth, NewsController.addNews);

// router.put('/edit', NewsController.addNews);

// router.delete('/delete', NewsController.addNews);


export default router;