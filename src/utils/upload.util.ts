import { UploadFileType } from './../interfaces/upload.interface';
const getFileUploadParams = (searchFile: string, uploadOptions = {}): UploadFileType => ({
  searchFile,
  uploadOptions: {
    fileName: searchFile,
    folder: "",
    useUniqueFileName: false,
    isPrivateFile: false,
    ...uploadOptions,
  },
});

export const getPhotoUploadParams = (fileName: string, id: string): UploadFileType => ({
  ...getFileUploadParams(fileName, {
    folder: `users/${id}/photos`,
  }),
});

export const getDocsUploadParams = (fileName: string, id: string): UploadFileType => ({
    ...getFileUploadParams(fileName, {
      folder: `users/${id}/docs`,
    }),
  });
