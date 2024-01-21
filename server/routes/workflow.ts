import express, { Request, Response } from 'express';
import { ServiceClient } from '@hankgalt/scheduler-client';

const schedulerClient = new ServiceClient();

const workflowAPIRouter = express.Router();

workflowAPIRouter.post('/search', async (req: Request, res: Response) => {
  const reqBody = req.body;
  console.log('/api/workflow/search - reqBody', reqBody);
  const { runId, workflowId, externalRef, type, status } = reqBody;
  try {
    const { runs, error } = await schedulerClient.searchWorkflowRuns({
      runId,
      workflowId,
      externalRef,
      type,
      status,
    });
    if (error) {
      console.log('/workflow/search: error fetching workflow runs', error);
      res.status(500).json({ error });
      return;
    }
    res.status(200).json({ runs });
  } catch (error) {
    console.log('/file/list: error fetching workflow runs', error);
    res.status(500).json({ error });
  }
});

export default workflowAPIRouter;
