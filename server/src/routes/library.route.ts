import { Router } from "express";
import LibraryController from "../controllers/library.controller";

const router = Router();

router.get('/tags', LibraryController.getTags);


export default router;