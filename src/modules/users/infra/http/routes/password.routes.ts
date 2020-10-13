import { Router } from 'express';
import ForgodPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgodPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', resetPasswordController.create);

export default passwordRouter;
