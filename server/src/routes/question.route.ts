import { Router } from "express";
import multer from "multer";
import questionController from "../controllers/question.controller";
import isAuth from "../middlewares/auth.middleware";

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/questions')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const router = Router();
const upload = multer({ storage: fileStorage });
router.get('/', questionController.getAllQuestions);

router.get('/answer', isAuth, questionController.answerOnQuestion);

router.get('/questId/:questId', questionController.getQuestionsByQuestId);

router.post('/changeOrder', questionController.changeOrder);

router.post('/', upload.single('file'), questionController.addQuestion);

router.get('/:id', questionController.getQuestion);

router.put('/:id', isAuth, upload.single('file'), questionController.editQuestion);


router.delete('/:id/:questId', isAuth, questionController.deleteQuestion);


export default router;