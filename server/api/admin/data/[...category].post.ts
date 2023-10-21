import { H3Event } from 'h3';
import { AdminService } from '~/src/services/admin/admin.service';
import { TUser } from '~/src/users/types/users';
import { checkRoute } from '~/server/utils/checkRoute';
import { initAdminService } from '~/server/utils/initAdminService';
import { TRegion } from '~/src/data/types/regions';
import { TOwnership } from '~/src/data/types/ownership';
import { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import { TNews } from '~/src/data/types/news';
import { TCompany } from '~/src/data/types/company';
import { TInitiative } from '~/src/data/types/initiatives';

export default defineEventHandler(
	async (event: H3Event) => {
		checkRoute(event);

		const adminService: AdminService = initAdminService(event);
		switch (event.context.params?.category) {
			case 'user' : {
				const user: TUser = await readBody(event);
				return await adminService.userSave(user);
			}
			case 'region' : {
				const region: TRegion = await readBody(event);
				return await adminService.regionSave(region);
			}
			case 'ownership' : {
				const ownership: TOwnership = await readBody(event);
				return await adminService.ownershipSave(ownership);
			}
			case 'types' : {
				const type: TInitiativeTypes = await readBody(event);
				return await adminService.initiativeTypesSave(type);
			}
			case 'news' : {
				const news: TNews = await readBody(event);
				return await adminService.newsSave(news);
			}
			case 'company' : {
				const company: TCompany = await readBody(event);
				return await adminService.companySave(company);
			}
			case 'initiative' : {
				const item: TInitiative = await readBody(event);
				return await adminService.initiativeSave(item);
			}
		}
		return '';
	}
);