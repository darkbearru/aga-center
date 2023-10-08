import { AdminService } from '~/src/services/admin/admin.service';
import { NewsRepository } from '~/src/data/news.repository';
import { UsersRepository } from '~/src/users/users.repository';
import { RegionsRepository } from '~/src/data/regions.repository';
import { H3Event } from 'h3';

export function initAdminService(event: H3Event): AdminService {
	return new AdminService(
		event.context.user,
		new NewsRepository(),
		new UsersRepository(),
		new RegionsRepository()
	);
}