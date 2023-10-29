import { IUsersRepository } from '~/src/users/users.repository.interface';
import { PrismaClient } from '@prisma/client';
import { TUser, TUserRegistration } from '~/src/users/types/users';

const prisma = new PrismaClient();

export class UsersRepository implements IUsersRepository {
    async count(): Promise<number> {
		return prisma.users.count({});
    }
    async list(skip: number = 0, take: number = 20): Promise<TUser[] | undefined> {
		return prisma.users.findMany({
			skip,
			take,
			orderBy: [
				{ isAdmin: 'desc' },
				{ isModerator: 'desc' },
				{ fio: 'asc' },
			]
		})
    }
    async info(id: number): Promise<TUser | null> {
		return prisma.users.findFirst({
			where: {
				id: id,
			}
		});
    }

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
		try {
			await prisma.users.update({
				where: { email: email },
				data: {
					confirmCode: code,
					changedAt: new Date()
				}
			});
		} catch(e) {

		}
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

	async save(user: TUser): Promise<TUser> {
		if (!user?.id) {
			return prisma.users.create({
				data: {
					email: user.email,
					fio: user.fio,
					isNew: false,
					isAdmin: user.isAdmin,
					isModerator: user.isModerator,
				}
			});
		}
		return prisma.users.update({
			data: {
				email: user.email,
				fio: user.fio,
				isAdmin: user.isAdmin,
				isModerator: user.isModerator,
			},
			where: {
				id: user.id
			}
		});
	}

	async delete(id: number): Promise<TUser> {
		return prisma.users.delete({
			where: { id }
		})
	}

	async checkEmail(email: string, id?: number): Promise<TUser | null> {
		return prisma.users.findFirst({
			where: {
				AND: [
					{ email },
					{
						id: {
							not: id
						},
						isNew: false,
					},
				]
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