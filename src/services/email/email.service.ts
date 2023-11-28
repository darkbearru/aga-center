import { type IEmailService } from '~/src/services/email/email.service.interface';
import { type TEmail, type TEmailResponse } from '~/src/services/email/email.types';
import * as nodemailer from 'nodemailer';

export class EmailService implements IEmailService {
	private sendAttempts: number = 0;
	async send(email: TEmail): Promise<TEmailResponse> {
		this.sendAttempts++;
		console.log('Send Email Attempt', this.sendAttempts);
		let result = await this.sender(email);
		if (result.error && this.sendAttempts < 2) {
			await delay(1000);
			result = await this.send(email);
		}
		this.sendAttempts = 0;
		return result;
	}

	private async sender(email: TEmail): Promise<TEmailResponse> {
		return new Promise(async (resolve, reject): Promise<void> => {
			console.log('Email start Create transport');
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
			if (!transporter) reject({ message: 'Create Transport Error' });
			try {
				transporter.verify(async (error): Promise<void> => {
					if (error) {
						transporter.close();
						reject({ message: `Can't connect`, error });
					} else {
						const result: TEmailResponse = await this.process(transporter, email);
						transporter.close();
						resolve(result);
					}
				});
			} catch (e) {
				transporter.close();
				reject({ error: `Send error`, e });
			}
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