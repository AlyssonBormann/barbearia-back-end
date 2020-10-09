import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import IAppointmentsRepositories from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class fakeAppointmentsRepository implements IAppointmentsRepositories {
    private appointments: Appointment[] = [];

    public async create({
        provider_id,
        // user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), date, provider_id });
        this.appointments.push(appointment);

        return appointment;
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );

        return findAppointment;
    }
}

export default fakeAppointmentsRepository;
