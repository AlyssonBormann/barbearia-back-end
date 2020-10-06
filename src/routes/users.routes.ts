import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import ensureAuthenticate from '../middlewares/ensureAuthenticate';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({ name, email, password });

        Reflect.deleteProperty(user, 'password');
        // delete user.password; - Isso não funcionou até o momento que tavo desenvolvendo

        return response.json(user);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticate,
    upload.single('avatar'),
    async (request, response) => {
        return response.json({ ok: true });
    },
);

export default usersRouter;
