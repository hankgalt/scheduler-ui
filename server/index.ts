import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

const { PORT, NODE_ENV } = process.env;
const app: express.Application = express();
const port: string | number = PORT || 4000;
const isDevelopment: boolean = !NODE_ENV || NODE_ENV === 'development';
const staticDir: string = isDevelopment ? './build' : '.';

console.log(`Express server environment is development: ${isDevelopment}`);

const allowedOrigins = ['http://localhost:8080'];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, staticDir)));

// API Routes
app.use('/api', apiRoutes);

app.get('/*', (_req: Request, res: Response): void => {
  res.sendFile('index.html', {
    root: path.join(__dirname, staticDir),
  });
});

app.listen(port, () => {
  console.log(`Express server listeting on port ${port}`);
});
