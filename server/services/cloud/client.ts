import { Storage } from '@google-cloud/storage';
import { GCLOUD_KEY_FILE, GCLOUD_PRJ_ID } from './index';

const storageClient = new Storage({
  keyFilename: GCLOUD_KEY_FILE,
  projectId: GCLOUD_PRJ_ID,
});

export default storageClient;
