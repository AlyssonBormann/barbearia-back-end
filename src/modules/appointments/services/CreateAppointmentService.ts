import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepositories from '@modules/appointments/repositories/IAppointmentsRepositories';

interface IRequest {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    constructor(private appointmentsRepository: IAppointmentsRepositories) {}

    public async execulte({
        provider_id,
        date,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('Este agendamento já esta agendado!');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
