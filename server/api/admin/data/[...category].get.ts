import { H3Event } from 'h3';
import { AdminService } from '~/src/services/admin/admin.service';
import { initAdminService } from '~/server/utils/initAdminService';
import { useRoute } from 'nuxt/app';

export default defineEventHandler(
	async (event: H3Event) => {
		if ((!event.context.user && !event.context.code) || (event.context.code && (event.context.params?.category !== 'orders'))) return protectRoute(event);
		const adminService: AdminService = initAdminService(event);
		switch (event.context.params?.category) {
			case 'common' : {
				return await adminService.companyAndInitiativesList();
			}
			case 'company' : {
				return await adminService.companyList();
			}
			case 'initiative' : {
				return await adminService.initiativeList();
			}
			case 'moderation' : {
				return await adminService.moderationList();
			}
			case 'orders' : {
				const query = getQuery(event);
				if (query.code) return await adminService.orderByCode(query.code.toString());
				return await adminService.ordersList();
			}
		}
		return await adminService.data();
	}
);