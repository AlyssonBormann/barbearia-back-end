import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/EmailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
    beforeAll(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    it('Deve ser capaz de recuperar a senha usando o email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            password: '123',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'jhondoe@example.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('Não deve ser capaz de recuperar a senha de um usuário não existente', async () => {
        await expect(
            sendForgotPasswordEmailService.execute({
                email: 'jhon@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('Deve ser capaz de gerar um token para o password', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon@example.com',
            password: '123',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'hon@example.com',
        });

        expect(generateToken).lastCalledWith(user.id);
    });
});
