import { Router } from "express";
import multer from "multer";
import questionController from "../controllers/question.controller";

import isAuth from "../middlewares/auth.middleware";

const router = Router();

router.get('/', questionController.getQuestions);

router.get('/:id', questionController.getQuestion)

router.post('/create', isAuth,
    multer({
        dest: 'uploads/images/questions',
    }).single('file'), questionController.addQuestion);

router.put('/:id', isAuth, multer({
    dest: 'uploads/images/questions',
}).single('file'), questionController.editQuestion);

router.delete('/:id', questionController.deleteQuestion);


export default router;