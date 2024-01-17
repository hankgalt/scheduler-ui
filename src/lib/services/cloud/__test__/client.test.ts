import { getFile } from '../get-file';
import { listFiles } from '../list-files';
import { deleteFile } from '../delete-file';
import { uploadFile } from '../upload-file';
import { GCLOUD_BUCKET_DEV } from '../index';

describe('gcloud client', () => {
  test('listFiles', async () => {
    const resp = await listFiles(GCLOUD_BUCKET_DEV);
    expect(resp.files?.length).toBeGreaterThan(0);
  });

  test('getFile', async () => {
    const fileName = 'geo.json';
    const getResp = await getFile({
      fileName,
    });
    expect(getResp.file?.name).toEqual('data/geo.json');
  });

  test.skip('upload and delete file', async () => {
    const fileName = 'web-test.txt';
    const upResp = await uploadFile({
      fileName,
    });
    expect(upResp.file?.name).toEqual(`data/${fileName}`);
    expect(upResp.file?.size).toEqual(24);

    const resp = await deleteFile({
      fileName,
      version: upResp.file?.version,
    });
    expect(resp.status).toEqual(`ok`);
  });

  test.skip('upload get and delete file', async () => {
    const fileName = 'web-test.txt';

    const upResp = await uploadFile({
      fileName,
    });
    expect(upResp.file?.name).toEqual(`data/${fileName}`);

    const getResp = await getFile({
      fileName,
    });
    expect(getResp.file?.name).toEqual('data/web-test.txt');
    expect(getResp.file?.size).toEqual('24');

    const resp = await deleteFile({
      fileName,
      version: upResp.file?.version,
    });
    expect(resp.status).toEqual(`ok`);
  });
});
