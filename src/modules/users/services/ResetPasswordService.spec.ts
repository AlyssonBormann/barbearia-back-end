// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import AppError from '@shared/errors/AppError';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
    beforeAll(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('Deve ser capaz de troca a senha', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@gmail.com',
            password: '123',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            password: '3333',
            token,
        });

        const updateUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('3333');
        expect(updateUser?.password).toBe('3333');
    });

    it('Não deve ser capaz de reseta a senha com um token inexistente', () => {
        expect(
            resetPasswordService.execute({
                token: 'non-existing-token',
                password: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Não deve ser  capaz de reseta a senha com um usuário inexistente', async () => {
        const { token } = await fakeUserTokensRepository.generate(
            'non-existing-user',
        );

        await expect(
            resetPasswordService.execute({
                token,
                password: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Não deve ser capaz de reseta a senha depois de 2 horas de gerado', async () => {
        const user = await fakeUsersRepository.create({
            name: 'jhon doe',
            email: 'jhondoe@example.com',
            password: '123',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                password: '123',
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
