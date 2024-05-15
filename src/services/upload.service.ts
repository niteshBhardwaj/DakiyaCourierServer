import { httpPost } from './../utils/http.util';
import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { env } from '@/plugins/config';
import { badUserInputException } from '@/utils/exceptions.util';
import { USER_ERROR_KEYS } from '@/constants';
import { PrismaClient } from '@prisma/client';
import { getRequireFieldFromResponse } from '@/utils';
import { UploadFileType, UploadResponseType, UploadFileResponseType } from '@/interfaces/upload.interface';

@Service()
export default class UploadService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  // Uploads a file.
  public async uploadFile(file: UploadFileType, userId: string, isPrivate = false): Promise<{url: string}> {
    const url = `${env.FILE_UPLOAD_HOST}/image/process`;
    try {
      console.log('url', url)
      const data = (await httpPost(url, { body: file })) as UploadResponseType;
      const response = data?.response as UploadFileResponseType;
      if (!data.error) {
        await this.prisma.uploadedFiles.create({
          data: {
            ...getRequireFieldFromResponse(response),
            userId,
            isPrivate
          },
        })
        return { url: response.filePath };
      } else {
        this.logger.error(data.message);
      }
    } catch (e) {
      this.logger.error(e);
    }
    throw badUserInputException(USER_ERROR_KEYS.UPLOAD_FAILED);
  }

  public async uploadFileMultiple(files: UploadFileType[], userId: string, isPrivate = false): Promise<{url: string}[]> {
    const url = `${env.FILE_UPLOAD_HOST}/image/process-multiple`;
    try {
      const data = await httpPost(url, { body: { files } }) as UploadResponseType;
      const response = data?.response as UploadFileResponseType[];
      if (response?.length) {
        await this.prisma.uploadedFiles.createMany({
          data: response.map(item => ({
            ...getRequireFieldFromResponse(item),
            userId,
            isPrivate
          })),
        })
        return response.map((item) => ({ url: item.filePath }));
      } else {
        this.logger.error(data.message);
      }
    } catch (e) {
      this.logger.error(e);
    }
    throw badUserInputException(USER_ERROR_KEYS.UPLOAD_FAILED);
  }


}
