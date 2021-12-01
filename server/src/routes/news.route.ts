import { Router } from "express";
import multer from "multer";

import NewsController from "../controllers/news.controller";
import isAuth from "../middlewares/auth.middleware";
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/news')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: fileStorage });
const router = Router();

router.get('/', NewsController.getNews);

router.get('/:id', NewsController.getSingleNews)

router.post('/create', isAuth, upload.single('mainPic'), NewsController.addNews);

router.put('/:id', isAuth, upload.single('mainPic'), NewsController.editNews);

router.delete('/delete/:id', isAuth, NewsController.deleteNews);


export default router;