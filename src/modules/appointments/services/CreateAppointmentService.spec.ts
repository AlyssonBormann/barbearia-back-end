import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
describe('CreateAppointment', () => {
    beforeAll(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();

        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });

    it('Deve ser capaz de criar um novo agendamento', async () => {
        const appointment = await createAppointment.execulte({
            date: new Date(),
            provider_id: '1234',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('1234');
    });

    it('Não deve ser permitido criar dois agendamento no mesmo horário', async () => {
        const appointmentDate = new Date(2020, 9, 9, 9); // aqui tem que ser a data atual

        await createAppointment.execulte({
            provider_id: '1234',
            date: appointmentDate,
        });

        await expect(
            createAppointment.execulte({
                provider_id: '1234',
                date: appointmentDate,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
