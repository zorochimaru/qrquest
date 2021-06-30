import { Router } from "express";
import AuthController from "../controllers/auth.controller";


const router = Router();

router.post('/signup', AuthController.signUp);

router.get('/confirmation/:token', AuthController.confirm);

router.get('/reset', AuthController.resetPass);

router.get('/confirm-password/:token', AuthController.confirmPassword);

router.post('/signin', AuthController.signIn);

router.post('/logout', AuthController.logOut);

export default router;