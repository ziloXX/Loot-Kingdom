import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
    constructor() {
        // Cloudinary auto-configures from CLOUDINARY_URL env variable
        // Format: cloudinary://api_key:api_secret@cloud_name
        if (process.env.CLOUDINARY_URL) {
            // Cloudinary SDK automatically parses CLOUDINARY_URL
            cloudinary.config(true);
        } else {
            // Fallback to separate variables
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });
        }
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        // Validate file type
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimes.includes(file.mimetype)) {
            throw new BadRequestException(
                'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException('File too large. Maximum size is 5MB.');
        }

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'loot-kingdom/products',
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' },
                        { quality: 'auto', fetch_format: 'auto' },
                    ],
                },
                (error, result: UploadApiResponse | undefined) => {
                    if (error) {
                        reject(new BadRequestException('Failed to upload image'));
                    } else if (result) {
                        resolve(result.secure_url);
                    }
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteImage(publicUrl: string): Promise<void> {
        // Extract public_id from URL
        const parts = publicUrl.split('/');
        const filename = parts[parts.length - 1];
        const publicId = `loot-kingdom/products/${filename.split('.')[0]}`;

        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Failed to delete image from Cloudinary:', error);
        }
    }
}
