import { H3Event } from 'h3';
import { AdminService } from '~/src/services/admin/admin.service';
import { TUser } from '~/src/users/types/users';
import { checkRoute } from '~/server/utils/checkRoute';
import { initAdminService } from '~/server/utils/initAdminService';
import { TRegion } from '~/src/users/types/regions';

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
		}
		return '';
	}
);