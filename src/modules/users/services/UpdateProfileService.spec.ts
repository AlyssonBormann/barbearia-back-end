import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
    beforeAll(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfileService = new UpdateProfileService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('Deve ser capaz de atualizar o perfil', async () => {
        const user = await fakeUserRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            password: '123',
        });

        const updateUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'Jhon Sayajin',
            email: 'jhonsayajin@modo.blue',
        });

        expect(updateUser.name).toBe('Jhon Sayajin');
        expect(updateUser.email).toBe('jhonsayajin@modo.blue');
    });

    it('Não deve ser capaz de atualizar o perfil de um usuário nao encontrado', async () => {
        await expect(
            updateProfileService.execute({
                user_id: 'user-no-existent',
                name: 'Bim Ladem',
                email: 'bimladem@ilove.you',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Não deve ser capaz de alterar o email para um email já utilizado', async () => {
        await fakeUserRepository.create({
            name: 'Son Goku',
            email: 'kakaroto@bunda.baleada',
            password: 'oisougoku',
        });

        const user = await fakeUserRepository.create({
            name: 'Son Gohan',
            email: 'songohan@biba.biba',
            password: '123',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'Piccolo Daimaoh',
                email: 'kakaroto@bunda.baleada',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Deve ser capaz de atualizar a senha', async () => {
        const user = await fakeUserRepository.create({
            name: 'jhon doe',
            email: 'jhondoe@example.com',
            password: '123',
        });

        const updateUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'jhon tre',
            email: 'jhontre@example.com',
            old_password: '123',
            password: '111',
        });

        expect(updateUser.password).toBe('111');
    });

    it('não deveria ser capaz de atualizar a senha sem a senha antiga', async () => {
        const user = await fakeUserRepository.create({
            name: 'jhon doe',
            email: 'jhondoe@example.com',
            password: '123',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'jhon tre',
                email: 'jhondoe@example.com',
                password: '111',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('não deveria ser capaz de atualizar a senha sem a senha antiga estiver certa', async () => {
        const user = await fakeUserRepository.create({
            name: 'jhon doe',
            email: 'jhondoe@example.com',
            password: '123',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'jhon tre',
                email: 'jhondoe2@example.com',
                old_password: 'worng-old-password',
                password: '111',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
