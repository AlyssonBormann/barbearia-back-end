import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
    beforeAll(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeStorageProvider = new FakeStorageProvider();

        updateUserAvatarService = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );
    });

    it('Deve ser capaz de criar um novo usuário', async () => {
        const user = await fakeUserRepository.create({
            name: 'Jhon Doe',
            email: 'jhon@example.com',
            password: '123',
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'avatar.jpg',
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('Não deve ser capaz de atualizar o avatar de um usuário não existente', async () => {
        await expect(
            updateUserAvatarService.execute({
                user_id: 'non-existing-user',
                avatarFileName: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Deve deletar o avatar antigo ao atualizar o novo', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUserRepository.create({
            name: 'Jhon Doe',
            email: 'jhon@example.com',
            password: '123',
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'avatar.jpg',
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'newAvatar.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('newAvatar.jpg');
    });
});
