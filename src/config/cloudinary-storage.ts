import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';

export const CloudinaryStorageConfig = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'movie-posters',
    resource_type: 'image',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});