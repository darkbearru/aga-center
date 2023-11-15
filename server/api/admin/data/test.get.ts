import { H3Event } from 'h3';
import { AdminService } from '~/src/services/admin/admin.service';
import { initAdminService } from '~/server/utils/initAdminService';

export default defineEventHandler(
	async (event: H3Event) => {
		if (!event.context.user) return protectRoute(event);
		const adminService: AdminService = initAdminService(event);
		await adminService.initiativeRemoveOld();
	}
);