import { type IUsersRepository } from '~/src/users/users.repository.interface';
import { type TUser, type TUserRegistration } from '~/src/users/types/users';
import { prismaClient } from '~/src/utils/prismaClient';


export class UsersRepository implements IUsersRepository {
    async count(): Promise<number> {
		return prismaClient.users.count({});
    }
    async list(skip: number = 0, take: number = 20): Promise<TUser[] | undefined> {
		return prismaClient.users.findMany({
			skip,
			take,
			orderBy: [
				{ isAdmin: 'desc' },
				{ isModerator: 'desc' },
				{ isClient: 'asc' },
				{ fio: 'asc' },
			]
		})
    }
    async info(id: number): Promise<TUser | null> {
		return prismaClient.users.findFirst({
			where: {
				id: id,
			}
		});
    }

	/**
	 * Сохраняем регистрационные данные и сверяем код
	 * @param body
	 */
	async registration(body?: TUserRegistration): Promise<TUser | undefined> {
		await this.deleteOldCodes();
		try {
			return await prismaClient.users.update({
				where: {
					email: body?.email,
					confirmCode: body?.code,
					// isNew: true,
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
			await prismaClient.users.update({
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
		const user: TUser | null = await prismaClient.users.findFirst({
			where: {
				email: email
			}
		});
		if (user) return undefined
		return prismaClient.users.create({
			data: {
				email: email,
				confirmCode: code,
				isNew: true
			}
		});
	}

	async save(user: TUser): Promise<TUser> {
		if (!user?.id) {
			return prismaClient.users.create({
				data: {
					email: user.email,
					fio: user.fio,
					isNew: false,
					isAdmin: user.isAdmin,
					isModerator: user.isModerator,
				}
			});
		}
		return prismaClient.users.update({
			data: {
				email: user.email,
				fio: user.fio,
				isAdmin: user.isAdmin,
				isModerator: user.isModerator,
				changedAt: new Date()
			},
			where: {
				id: user.id
			}
		});
	}

	async delete(id: number): Promise<TUser> {
		return prismaClient.users.delete({
			where: { id }
		})
	}

	async checkEmail(email: string, id?: number): Promise<TUser | null> {
		return prismaClient.users.findFirst({
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
		return prismaClient.users.findFirst({
			where: {
				email: email,
				confirmCode: code
			}
		});
	}


	private async deleteOldCodes(): Promise<void> {
		const timeout = new Date();
		timeout.setTime(timeout.getTime() - 30 * 60000);
		await prismaClient.users.updateMany({
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


	async userOrder(email: string, code: string): Promise<TUser|undefined> {
		const user: TUser | null = await prismaClient.users.findFirst({
			where: {
				email: email
			}
		});
		console.log('user check');
		if (!user) {
			console.log('User not found create new');
			return prismaClient.users.create({
				data: {
					email: email,
					confirmCode: code,
					isNew: true,
					isClient: true,
				}
			});
		}
		await this.saveCode(email, code);
		user.confirmCode = code;
		console.log('User found', user);
		return user;

	}




}