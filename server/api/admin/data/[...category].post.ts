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
import { TInitiativeWithID } from '~/src/data/types/initiatives';
import formidable from 'formidable';
import { IncomingMessage } from 'http';
import { TPhotos } from '~/src/data/types/photos';
import { TArticleFormData } from '~/src/data/types/articles';

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
			case 'articles' : {
				const headers = getRequestHeaders(event);
				let item: TArticleFormData;
				if (headers['content-type']?.includes('multipart/form-data')) {
					item = await parseMultipartNodeRequest<TArticleFormData>(event.node.req);
				} else {
					item = await readBody(event);
				}
				return await adminService.articlesSave(item);
			}
			case 'initiative' : {
				const headers = getRequestHeaders(event);
				let item: TInitiativeWithID;
				if (headers['content-type']?.includes('multipart/form-data')) {
					item = await parseMultipartNodeRequest<TInitiativeWithID>(event.node.req);
				} else {
					item = await readBody(event);
				}
				return await adminService.initiativeSave(item);
			}
			case 'moderate_company' : {
				const data = await readBody(event);
				if (!data?.id) return;
				return await adminService.moderationCompany(
					data.id,
					data.approved ? 'approved' : 'declined',
					data?.reason
				);
			}
			case 'moderate_initiative' : {
				const data = await readBody(event);
				if (!data?.id) return;
				return await adminService.moderationInitiative(
					data.id,
					data.approved ? 'approved' : 'declined',
					data?.reason
				);
			}
			case 'orders' : {
				const data = await readBody(event);
				return await adminService.orderAddMessage(data.code, data.status, data.message);
			}
			case 'promo' : {
				const data: {id: number, isActivate?: boolean} = await readBody(event);
				if (!data.id) return '';
				return await adminService.setPromo(data.id, data.isActivate || false);
			}
		}
		return '';
	}
);

function parseMultipartNodeRequest<T>(req: IncomingMessage): Promise<T> {
	return new Promise((resolve, reject): void => {
		/** @see https://github.com/node-formidable/formidable/ */
		const form = formidable({
			multiples: true,
			uploadDir: './public/upload',
			keepExtensions: true,
			minFileSize: 10 * 1024,
			maxFileSize: 3145728, //3 * 1024 * 1024,
			maxTotalFileSize: 9437184, //3 * 3145728
			filter(file) {
				const originalFilename = file.originalFilename ?? '';
				// Enforce file ends with allowed extension
				const allowedExtensions = /\.(jpe?g|png|gif|webp|svg)$/i;
				return allowedExtensions.test(originalFilename);

			}
		})
		form.parse(req, (error, fields, files) => {
			if (error) {
				reject(error);
				return;
			}
			let photos: TPhotos = [];
			if (Array.isArray(files.photos)) {
				files.photos.forEach((file) => {
					photos.push({
						path: `/upload/${file.newFilename}`
					});
				});
			}
			let result: Record<string, any> = [];
			for (let key in fields) {
				const value: string = fields[key]?.[0] || '';
				if ((key === 'photosList')) {
					let photosList: TPhotos = [];
					try {
						photosList = JSON.parse(value) || [];
					} catch (e) {
					}
					photos = [...photos, ...photosList];
				} else {
					result[key] = value;
				}
			}
			result['photos'] = photos;
			resolve(result as T);
		});
	});
}