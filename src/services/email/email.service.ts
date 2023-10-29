import { IEmailService } from '~/src/services/email/email.service.interface';
import { TEmail, TEmailResponse } from '~/src/services/email/email.types';
import * as nodemailer from 'nodemailer';

export class EmailService implements IEmailService {
	async send(email: TEmail): Promise<TEmailResponse> {
		return new Promise((resolve, reject) => {
			const transporter: nodemailer.Transporter = nodemailer.createTransport({
				host: process.env.MAIL_SERVER,
				port: 587,
				secure: false,
				auth: {
					user: process.env.MAIL_USER,
					pass: process.env.MAIL_PSW,
				},
				tls: {
					rejectUnauthorized: false,
				},
			});
			transporter.verify(async (error): Promise<void> => {
				if (error) {
					reject({
						message: `Can't connect`,
						error
					});
				} else {
					const result: TEmailResponse = await this.process(transporter, email);
					resolve(result);
				}
			});
			transporter.close();
		});
	}

	private async process(transporter: nodemailer.Transporter, email: TEmail): Promise<TEmailResponse> {
		return new Promise(async (resolve, reject): Promise<void> => {
			transporter.sendMail(
				{
					from: email.from,
					to: email.to,
					subject: email.subject,
					text: email.text,
					html: email?.html || email.text
				},
				(error, info) => {
					if (error) reject({message: 'Error', error});
					resolve({ message: info.response});
				}
			);
		});
	}
}