import { Router } from 'express';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticate);

appointmentsRouter.get('/', appointmentsController.index);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
