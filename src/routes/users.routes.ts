import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticate from '../middlewares/ensureAuthenticate';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({ name, email, password });

    Reflect.deleteProperty(user, 'password');
    // delete user.password; - Isso não funcionou até o momento que estava desenvolvendo

    return response.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticate,
    upload.single('avatar'),
    async (request, response) => {
        const updateUserAvatar = new UpdateUserAvatarService();

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename,
        });

        Reflect.deleteProperty(user, 'password');

        return response.json(user);
    },
);

export default usersRouter;
