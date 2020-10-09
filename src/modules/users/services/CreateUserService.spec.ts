import FakeUserRepository from '@modules/users/repositories/fakes/fakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/fakeHashProvider';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
    beforeAll(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('Deve ser capaz de criar um novo usuário', async () => {
        const user = await createUser.execute({
            name: 'jhon Wike',
            email: 'jhon.wike@example.com',
            password: '123',
        });

        expect(user).toHaveProperty('id');
    });

    it('Nao deve ser capaz de criar um novo usuário com o email de outro', async () => {
        await createUser.execute({
            name: 'Jhon Riddic',
            email: 'jhon@example.com',
            password: '123',
        });

        await expect(
            createUser.execute({
                name: 'Jhon Riddic Fake',
                email: 'jhon@example.com',
                password: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
