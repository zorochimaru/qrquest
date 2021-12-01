import { Router } from "express";
import multer from "multer";
import questController from '../controllers/quest.controller';
import isAuth from "../middlewares/auth.middleware";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/quests')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const router = Router();
const upload = multer({ storage: fileStorage });
router.get('/', questController.getQuests);

router.get('/:id', questController.getQuest)

router.post('/', isAuth, upload.single('file'), questController.createQuest);

router.put('/:id', isAuth, upload.single('file'), questController.editQuest);

router.delete('/:id', isAuth, questController.deleteQuest);


export default router;