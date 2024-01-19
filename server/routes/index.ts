import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/biz', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Biz API response message' });
});

router.get('/other', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Other API response message' });
});

export default router;
