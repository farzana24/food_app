import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class UploadService {
    /**
     * Upload base64 image to Cloudinary
     * @param base64Image - Base64 encoded image string (with or without data:image prefix)
     * @param folder - Cloudinary folder to upload to
     * @returns Cloudinary URL of uploaded image
     */
    async uploadImage(base64Image: string, folder: string = 'restaurants'): Promise<string> {
        try {
            // Ensure base64 string has proper format
            let imageStr = base64Image;
            if (!imageStr.startsWith('data:')) {
                imageStr = `data:image/jpeg;base64,${base64Image}`;
            }

            const result = await cloudinary.uploader.upload(imageStr, {
                folder: folder,
                resource_type: 'image',
                transformation: [
                    { width: 1200, height: 800, crop: 'limit' },
                    { quality: 'auto:good' },
                ],
            });

            return result.secure_url;
        } catch (error: any) {
            console.error('Cloudinary upload error:', error);
            throw new Error(`Image upload failed: ${error.message}`);
        }
    }

    /**
     * Delete image from Cloudinary
     * @param publicId - Cloudinary public ID of the image
     */
    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error: any) {
            console.error('Cloudinary delete error:', error);
            throw new Error(`Image deletion failed: ${error.message}`);
        }
    }
}

export const uploadService = new UploadService();
