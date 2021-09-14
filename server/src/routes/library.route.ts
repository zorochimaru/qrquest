import { Router } from "express";
import LibraryController from "../controllers/library.controller";

const router = Router();

router.get('/tags', LibraryController.getTags);

router.post('/tag', LibraryController.newTag);

router.put('/tag', LibraryController.editTag);

router.delete('/tag/:id', LibraryController.deleteTag);


export default router;