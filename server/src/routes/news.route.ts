import { Router } from "express";
import multer from "multer";

import NewsController from "../controllers/news.controller";
import isAuth from "../middlewares/auth.middleware";

const router = Router();

router.get('/', NewsController.getNews);

router.post('/create', isAuth,
    multer({
        dest: 'uploads/images/news',
    }).single('mainPic'), NewsController.addNews);

router.put('/:id', NewsController.editNews);

router.delete('/delete/:id', NewsController.deleteNews);


export default router;