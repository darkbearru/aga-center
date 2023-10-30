import type { TEmail, TEmailResponse } from '~/src/services/email/email.types';

export interface IEmailService {
	send(email: TEmail): Promise<TEmailResponse>;
}