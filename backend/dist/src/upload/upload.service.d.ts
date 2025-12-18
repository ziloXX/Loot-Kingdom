export declare class UploadService {
    constructor();
    uploadImage(file: Express.Multer.File): Promise<string>;
    deleteImage(publicUrl: string): Promise<void>;
}
