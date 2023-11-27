import { httpPost } from './../utils/http.util';
import { UploadResponseType, UploadFileType } from '@interfaces/upload.interface';
import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import config from '@/plugins/config';

@Service()
export default class UploadService {
  constructor(
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  // Uploads a file.
  public async uploadFile(params: UploadFileType): Promise<UploadResponseType> {
    const url = config.processImage;
    try {
        const data = await httpPost(url, { body: params }) as UploadResponseType;
        if(!data.error) {
            const upload = new uploadModel(data.response)
            upload.save()
            return data;
        } else {
            this.logger.error(data.message);
        }
    } catch(e) {
        this.logger.error(e);
    }
    return { error: 'error', message: 'File Upload Error!'}
  }

  
}
