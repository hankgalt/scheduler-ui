import express, { Request, Response } from 'express';
import { ServiceClient } from '@hankgalt/scheduler-client';

const schedulerClient = new ServiceClient();

const entityAPIRouter = express.Router();

entityAPIRouter.post('/get', async (req: Request, res: Response) => {
  const reqBody = req.body;
  console.log('/entity/get - reqBody', reqBody);
  const { id, type } = reqBody;
  try {
    const { entity, error } = await schedulerClient.getEntity({
      id,
      type,
    });
    if (error) {
      console.log('/entity/get: error fetching entity', error);
      res.status(500).json({ error });
      return;
    }
    res.status(200).json({ entity });
  } catch (error) {
    console.log('/entity/get: error fetching entity', error);
    res.status(500).json({ error });
  }
});

export default entityAPIRouter;
