import type { ICompanyRepository } from '~/src/data/company.repository.interface';
import type { TCompany, TContact, TContacts } from '~/src/data/types/company';
import type { TUser } from '~/src/users/types/users';
import { prismaClient } from '~/src/utils/prismaClient';


const companySelect = {
	id: true,
	nameFull: true,
	nameShort: true,
	requsites: true,
	slug: true,
	rating: true,
	isApproved: true,
	isDeclined: true,
	declineReason: true,
	contacts: {
		select: {
			id: true,
			type: true,
			value: true
		}
	},
	typeOwnership: {
		select: {
			id: true,
			nameShort: true,
			nameFull: true,
		}
	},
	Users: {
		select: {
			id: true,
			fio: true,
			email: true
		}
	}
};

export class CompanyRepository implements ICompanyRepository {

	async add(company: TCompany): Promise<TCompany | undefined> {
		try {
			const contacts = this.contactsConnectOrCreate(company?.contacts);
			const created =  await prismaClient.company.create({
				data: {
					nameFull: company.nameFull,
					nameShort: company.nameShort,
					requsites: company.requsites || '',
					slug: company.slug,
					isApproved: false,
					isDeclined: false,
					declineReason: '',
					contacts: {
						connectOrCreate: contacts,
					},
					typeOwnership: {
						connect: { id: company.ownership?.id }
					},
					Users: {
						connect: { id: company.user?.id }
					}
				}
			});
			return await this.select(created.id);
		} catch (e) {
			console.log(e);
			return undefined;
		}
	}

	private contactsConnectOrCreate(contacts: TContacts | undefined): any[] {
		const result: any[] = [];
		contacts?.forEach(item => {
			result.push({
				where: { id: item.id || 0},
				create: {
					type: item.type,
					value: item.value
				}
			})
		})
		return result;
	}

	async select(id: number): Promise<TCompany> {
		const result = await prismaClient.company.findFirst({
			where: { id },
			select: companySelect
		});
		return {
			id,
			nameShort: result?.nameShort || '',
			nameFull: result?.nameFull || '',
			requsites: result?.requsites || '',
			slug: result?.slug || '',
			contacts: result?.contacts as TContacts,
			isApproved: false,
			isDeclined: result?.isDeclined || false,
			declineReason: result?.declineReason || '',
			ownership: {
				id: result?.typeOwnership?.id || 0,
				nameShort: result?.typeOwnership?.nameShort || '',
				nameFull: result?.typeOwnership?.nameFull || '',
			},
			user: {
				id: result?.Users?.id || 0,
				fio: result?.Users?.fio || '',
				email: result?.Users?.email || ''
			}
		}
	}

	async check(company: TCompany): Promise<TCompany | boolean> {
		const idQuery = typeof company.id !== 'undefined' ? { id: { not: company.id } } : {};
		const result = await prismaClient.company.findFirst({
			where: {
				AND: [
					{
						OR: [
							{ nameFull: company.nameFull },
							{ nameShort: company.nameShort },
							{ slug: company.slug },
						],
					},
					idQuery,
				]
			}
		});
		if (result) {
			return {
				id: result?.id || 0,
				nameShort: result?.nameShort || '',
				nameFull: result?.nameFull || '',
				slug: result?.slug || '',
			}
		}
		return false;
	}

	async delete(company: TCompany): Promise<boolean> {
		try {
			// let t: CompanyWhereUniqueInput;
			await prismaClient.company.delete({
				where: {
					id: company.id,
					usersId: company.user?.id,
				}
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	async list(user: TUser): Promise<TCompany[] | undefined> {
		const result = await prismaClient.company.findMany({
			select: companySelect,
			where: {
				Users: {
					id: user.id
				}
			}
		});
		if (result) {
			return result.map((company) => {
				return {
					id: company.id,
					slug: company.slug,
					rating: company.rating,
					nameFull: company.nameFull,
					nameShort: company.nameShort,
					requsites: company.requsites,
					isDeclined: company.isDeclined,
					declineReason: company.declineReason,
					contacts: company.contacts,
					ownership: company.typeOwnership,
					user: company.Users
				}
			}) as TCompany[];
		}
		return undefined;
	}

	async listAll(): Promise<TCompany[] | undefined> {
		const result = await prismaClient.company.findMany({
			select: companySelect,
			where: {
				isApproved: true,
				isDeclined: false
			},
			orderBy: [
				{ nameShort: 'asc' },
				{ nameFull: 'asc' }
			]
		});
		if (result) {
			return result.map((company) => {
				return {
					id: company.id,
					slug: company.slug,
					rating: company.rating,
					nameFull: company.nameFull,
					nameShort: company.nameShort,
					requsites: company.requsites,
					contacts: company.contacts,
					ownership: company.typeOwnership,
					user: company.Users
				}
			}) as TCompany[];
		}
		return undefined;
	}

	async getBySlug(slug: string): Promise<TCompany | undefined> {
		const company = await prismaClient.company.findFirst({
			select: companySelect,
			where: {
				slug,
				isApproved: true,
				isDeclined: false
			}
		});
		if (company) {
			return {
				id: company.id,
				slug: company.slug,
				rating: company.rating,
				nameFull: company.nameFull,
				nameShort: company.nameShort,
				requsites: company.requsites,
				contacts: company.contacts as TContacts,
				ownership: company.typeOwnership || undefined,
			}
		}
		return undefined
	}

	async save(company: TCompany): Promise<TCompany | undefined> {
		try {
			const contacts = this.contactsConnectOrCreate(company?.contacts);
			const result = await prismaClient.company.update({
				where: {
					id: company?.id
				},
				select: companySelect,
				data: {
					nameFull: company.nameFull,
					nameShort: company.nameShort,
					requsites: company.requsites || '',
					isApproved: false,
					isDeclined: false,
					changedAt: new Date(),
					contacts: {
						connectOrCreate: contacts,
					},
					typeOwnership: {
						connect: { id: company.ownership?.id }
					},
					Users: {
						connect: { id: company.user?.id }
					}
				}
			});
			return {
				id: company?.id,
				nameShort: result?.nameShort || '',
				nameFull: result?.nameFull || '',
				requsites: result?.requsites || '',
				slug: result?.slug || '',
				contacts: result?.contacts as TContacts,
				isApproved: false,
				isDeclined: result?.isDeclined || false,
				declineReason: result?.declineReason || '',
				ownership: {
					id: result?.typeOwnership?.id || 0,
					nameShort: result?.typeOwnership?.nameShort || '',
					nameFull: result?.typeOwnership?.nameFull || '',
				},
				user: {
					id: result?.Users?.id || 0,
					fio: result?.Users?.fio || '',
					email: result?.Users?.email || ''
				}
			};
		} catch (e) {
			console.log(e);
			return undefined;
		}
	}

	async deleteContacts(contacts: TContacts): Promise<void> {
		const idList: number[] = [];
		contacts.forEach((item: TContact) => {
			if (item.id) idList.push(item.id);
		});
		if (idList.length === 0) return;
		const AND = idList.map(id => { return { id } });
		try {
			await prismaClient.contacts.deleteMany({
				where: { AND }
			})
		} catch (e) {

		}
	}

	async moderationList(): Promise<TCompany[] | undefined> {
		const result = await prismaClient.company.findMany({
			where: {
				isApproved: false,
				isDeclined: false,
			},
			select: {
				id: true,
				nameFull: true,
				nameShort: true,
				requsites: true,
				declineReason: true,
				contacts: {
					select: {
						id: true,
						type: true,
						value: true
					}
				},
				typeOwnership: {
					select: {
						id: true,
						nameShort: true,
						nameFull: true,
					}
				},
				Users: {
					select: {
						id: true,
						fio: true,
						email: true
					}
				}
			}
		});
		if (result) {
			return result.map((company) => {
				return {
					id: company.id,
					nameFull: company.nameFull,
					nameShort: company.nameShort,
					declineReason: company.declineReason,
					requsites: company.requsites,
					contacts: company.contacts,
					ownership: company.typeOwnership,
					user: company.Users
				}
			}) as TCompany[];
		}
	}

	async moderationApprove(id: number): Promise<boolean> {
		try {
			await prismaClient.company.update({
				where: { id },
				data: {
					isApproved: true,
					isDeclined: false,
					declineReason: ''
				}
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	async moderationDecline(id: number, reason: string): Promise<boolean> {
		try {
			await prismaClient.company.update({
				where: { id },
				data: {
					isApproved: false,
					isDeclined: true,
					declineReason: reason
				}
			});
			return true;
		} catch (e) {
			return false;
		}

	}

	async calcRating(id: number): Promise<void>{
		try {
			const result = await prismaClient.initiative.aggregate({
				_avg: {
					rating: true
				},
				_count: {
					rating: true
				},
				where: {
					Company: {
						id: id,
					},
					isApproved: true

				},
			});
			await prismaClient.company.update({
				data: { rating: result?._avg?.rating || 0 }, where: { id }
			})
		} catch (e) {

		}

	}

}