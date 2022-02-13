import { Router } from "express";
import AuthController from "../controllers/auth.controller";


const router = Router();

router.post('/signup', AuthController.signUp);

router.get('/confirmation/:token', AuthController.confirm);

router.post('/reset-password', AuthController.resetPass);

router.post('/confirm-password', AuthController.confirmPassword);

router.post('/signin', AuthController.signIn);

router.get('/get-user', AuthController.getUser);

router.get('/logout', AuthController.logOut);

router.get('/refresh-token', AuthController.refreshToken);


export default router;