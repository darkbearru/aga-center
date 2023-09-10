import { IUsersRepository } from '~/src/users/users.repository.interface';
import { PrismaClient } from '@prisma/client';
import { TUser, TUserRegistration } from '~/src/users/types/users';

const prisma = new PrismaClient();

export class UsersRepository implements IUsersRepository {
	async registration(body?: TUserRegistration): Promise<TUser | undefined> {
		await this.deleteOldCodes();
		try {
			return await prisma.users.update({
				where: {
					email: body?.email,
					confirmCode: body?.code,
					isNew: true,
				},
				data: {
					fio: body?.fio,
					isNew: false,
					changedAt: new Date()
				}
			});
		} catch (e) {
			console.log(e);
		}
		return undefined;
	}

	/**
	 * Сохраняем сгенерированный код, при логине
	 * @param email
	 * @param code
	 */
	async saveCode(email: string, code: string): Promise<void> {
		await prisma.users.update({
			where: { email: email },
			data: {
				confirmCode: code,
				changedAt: new Date()
			}
		});
	}

	/**
	 * Создаём нового пользователя при регистрации
	 * @param email
	 * @param code
	 */
	async createUser(email: string, code: string): Promise<TUser|undefined> {
		const user: TUser | null = await prisma.users.findFirst({
			where: {
				email: email
			}
		});
		if (user) return undefined
		return prisma.users.create({
			data: {
				email: email,
				confirmCode: code,
				isNew: true
			}
		});
	}

	/**
	 * Авторизация пользователя и генерация JWT
	 * @param email
	 * @param code
	 */
	async authorize(email: string, code: string): Promise<TUser | null> {
		await this.deleteOldCodes();
		return prisma.users.findFirst({
			where: {
				email: email,
				confirmCode: code
			}
		});
	}

	private async deleteOldCodes(): Promise<void> {
		const timeout = new Date();
		timeout.setTime(timeout.getTime() - 30 * 60000);
		await prisma.users.updateMany({
			where: {
				changedAt: {
					lte: timeout
				}
			},
			data: {
				confirmCode: ''
			}
		})
	}

}