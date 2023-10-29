import { ICompanyRepository } from '~/src/data/company.repository.interface';
import { Prisma, PrismaClient } from '@prisma/client';
import { TCompany, TContact, TContacts } from '~/src/data/types/company';
import ContactsWhereInput = Prisma.ContactsWhereInput;
import { TUser } from '~/src/users/types/users';

const prisma: PrismaClient = new PrismaClient();

export class CompanyRepository implements ICompanyRepository {
	async add(company: TCompany): Promise<TCompany | undefined> {
		try {
			const contacts: Prisma.ContactsCreateOrConnectWithoutCompanyInput[] = this.contactsConnectOrCreate(company?.contacts);
			const created =  await prisma.company.create({
				data: {
					nameFull: company.nameFull,
					nameShort: company.nameShort,
					requsites: company.requsites || '',
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

	private contactsConnectOrCreate(contacts: TContacts | undefined): Prisma.ContactsCreateOrConnectWithoutCompanyInput[] {
		const result: Prisma.ContactsCreateOrConnectWithoutCompanyInput[] = [];
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
		const result = await prisma.company.findFirst({
			where: { id },
			select: {
				nameFull: true,
				nameShort: true,
				requsites: true,
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
			}
		});
		return {
			id,
			nameShort: result?.nameShort || '',
			nameFull: result?.nameFull || '',
			requsites: result?.requsites || '',
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

	async check(company: TCompany): Promise<boolean> {
		const idQuery = typeof company.id !== 'undefined' ? { id: { not: company.id } } : {};
		const res = await prisma.company.findFirst({
			where: {
				AND: [
					{ nameFull: company.nameFull },
					idQuery,
				]
			}
		});
		return !res;
	}

	async delete(company: TCompany): Promise<boolean> {
		try {
			// let t: CompanyWhereUniqueInput;
			await prisma.company.delete({
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
		const result = await prisma.company.findMany({
			select: {
				id: true,
				nameFull: true,
				nameShort: true,
				requsites: true,
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
			},
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

	async save(company: TCompany): Promise<boolean> {
		try {
			const contacts: Prisma.ContactsCreateOrConnectWithoutCompanyInput[] = this.contactsConnectOrCreate(company?.contacts);
			await prisma.company.update({
				where: {
					id: company?.id
				},
				data: {
					nameFull: company.nameFull,
					nameShort: company.nameShort,
					requsites: company.requsites || '',
					isApproved: false,
					isDeclined: false,
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
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async deleteContacts(contacts: TContacts): Promise<void> {
		const idList: number[] = [];
		contacts.forEach((item: TContact) => {
			if (item.id) idList.push(item.id);
		});
		if (idList.length === 0) return;
		const AND: ContactsWhereInput[] = idList.map(id => { return { id } });
		try {
			await prisma.contacts.deleteMany({
				where: { AND }
			})
		} catch (e) {

		}
	}

	async moderationList(): Promise<TCompany[] | undefined> {
		const result = await prisma.company.findMany({
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
			await prisma.company.update({
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
			await prisma.company.update({
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

	};

}