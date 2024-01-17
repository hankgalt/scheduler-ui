import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/biz', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Biz API response message' });
});

export default router;
