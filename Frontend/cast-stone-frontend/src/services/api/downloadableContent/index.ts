import { DownloadableContentGetService } from './get';
import { DownloadableContentPostService } from './post';
import { DownloadableContentUpdateService } from './update';

export class DownloadableContentService {
  public get = new DownloadableContentGetService();
  public post = new DownloadableContentPostService();
  public update = new DownloadableContentUpdateService();
}

export const downloadableContentService = new DownloadableContentService();
