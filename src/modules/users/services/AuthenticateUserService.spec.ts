import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let authenticateUserService: AuthenticateUserService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('AuthenticateUserService', () => {
    beforeAll(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        authenticateUserService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('Deve ser capaz do usuário se autenticar', async () => {
        const user = await createUserService.execute({
            name: 'jhon Doe',
            email: 'jhon@example.com',
            password: '1234',
        });

        const authenticateUser = await authenticateUserService.execute({
            email: 'jhon@example.com',
            password: '1234',
        });

        expect(authenticateUser).toHaveProperty('token');
        expect(authenticateUser.user).toEqual(user);
    });

    it('Não deve ser capaz do usuário se autenticar com senha incorreta', async () => {
        await fakeUsersRepository.create({
            name: 'jhon Doe',
            email: 'jhondoe@example.com',
            password: '123',
        });

        await expect(
            authenticateUserService.execute({
                email: 'jhondoe@example.com',
                password: 'worng-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Não deve ser capaz de se autenticar com um usuário não existente', async () => {
        expect(
            authenticateUserService.execute({
                email: 'johndoe@example.com',
                password: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
