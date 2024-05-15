export interface UploadFileType { 
    searchFile: string; 
    uploadOptions: {
        fileName: string; 
        folder: string; 
        isPrivateFile?: boolean;
        useUniqueFileName?: boolean;
    }
}

export type UploadFileResponseType = { 
    fileId: string;
    name: string; 
    size: number;
    filePath: string; 
    url: string; 
    fileType: "image" | string; 
    height: number; 
    width: number; 
    thumbnailUrl: string;
} 

export interface UploadResponseType {
    error?: any;
    message?: string;
    response?: unknown;
}