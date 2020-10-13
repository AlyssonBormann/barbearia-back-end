import ISendMailDTO from '@shared/container/providers/EmailProvider/dtos/ISendMailDTO';
import IMailProvider from '@shared/container/providers/EmailProvider/models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
    private messages: ISendMailDTO[] = [];

    public async sendMail(message: ISendMailDTO): Promise<void> {
        this.messages.push(message);
    }
}
