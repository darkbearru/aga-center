import type { TPhotos } from '~/src/data/types/photos';

export interface IPhotosRepository {
	deletePhotos(photos: TPhotos): Promise<void>;
}