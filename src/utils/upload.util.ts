import { UploadFileResponseType, UploadFileType } from './../interfaces/upload.interface';
const accountPrefix = 'dakiya-courier/';

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
    folder: `${accountPrefix}users/${id}/photos`,
  }),
});

export const getDocsUploadParams = (fileName: string, id: string): UploadFileType => ({
    ...getFileUploadParams(fileName, {
      isPrivateFile: true,
      useUniqueFileName: true,
      folder: `${accountPrefix}users/${id}/docs`,
    }),
  });

export const getRequireFieldFromResponse = (item: UploadFileResponseType) => {
  return {
    fileId: item.fileId,
    name: item.name,
    size: item.size,
    filePath: item.filePath,
    url: item.url,
    fileType: item.fileType,
    height: item.height,
    width: item.width,
    thumbnailUrl: item.thumbnailUrl
  }
}
