import { Router } from "express";
import multer from "multer";
import questionController from "../controllers/question.controller";

import isAuth from "../middlewares/auth.middleware";

const router = Router();

router.get('/', questionController.getQuestion);

router.get('/:id', questionController.getSingleQuestion)

router.post('/create', isAuth,
    multer({
        dest: 'uploads/images/news',
    }).single('mainPic'), questionController.addQuestion);

router.put('/:id', isAuth, multer({
    dest: 'uploads/images/questions',
}).single('mainPic'), questionController.editQuestion);

router.delete('/:id', questionController.deleteQuestion);


export default router;