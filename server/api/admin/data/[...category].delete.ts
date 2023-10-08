import { H3Event } from 'h3';
import { AdminService } from '~/src/services/admin/admin.service';
import { TUser } from '~/src/users/types/users';
import { checkRoute } from '~/server/utils/checkRoute';
import { initAdminService } from '~/server/utils/initAdminService';
import { TRegion } from '~/src/data/types/regions';
import { TOwnership } from '~/src/data/types/ownership';
import { TInitiativeTypes } from '~/src/data/types/initiatives.types';
import { TNews } from '~/src/data/types/news';

export default defineEventHandler(
	async (event: H3Event) => {
		checkRoute(event);

		const adminService: AdminService = initAdminService(event);
		switch (event.context.params?.category) {
			case 'user' : {
				const user: TUser = await readBody(event);
				const result: TUser | null = await adminService.userDelete(user);
				if (result) return result;
				break;
			}
			case 'region' : {
				const region: TRegion = await readBody(event);
				return await adminService.regionDelete(region);
			}
			case 'ownership' : {
				const ownership: TOwnership = await readBody(event);
				return await adminService.ownershipDelete(ownership);
			}
			case 'types' : {
				const type: TInitiativeTypes = await readBody(event);
				return await adminService.initiativeTypesDelete(type);
			}
			case 'news' : {
				const news: TNews = await readBody(event);
				return await adminService.newsDelete(news);
			}
		}
		return '';
	}
);