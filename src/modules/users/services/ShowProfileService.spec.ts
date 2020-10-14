import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('ShowProfileService', () => {
    beforeAll(() => {
        fakeUserRepository = new FakeUserRepository();

        showProfileService = new ShowProfileService(fakeUserRepository);
    });

    it('Deve ser capaz de retorna os dados do usuário', async () => {
        const user = await fakeUserRepository.create({
            name: 'jhon doe',
            email: 'jhondoe@example.com',
            password: '123',
        });
        const updateProfile = await showProfileService.execute({
            user_id: user.id,
        });

        expect(updateProfile.name).toBe('jhon doe');
    });

    it('Não deve ser capaz de retorna os dados do usuário caso nao exista', async () => {
        await expect(
            showProfileService.execute({
                user_id: 'no-existing-user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
