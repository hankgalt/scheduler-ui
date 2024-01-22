import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRoutes from './routes';
import fileAPIRoutes from './routes/file';
import workflowAPIRoutes from './routes/workflow';
import entityAPIRoutes from './routes/entity';

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

app.use(express.static(path.join(__dirname, staticDir)));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// File API Routes
app.use('/api/file', fileAPIRoutes);

// Workflow API Routes
app.use('/api/workflow', workflowAPIRoutes);

// Entity API Routes
app.use('/api/entity', entityAPIRoutes);

// Other API Routes
app.use('/api', apiRoutes);

app.get('/*', (_req: Request, res: Response): void => {
  res.sendFile('index.html', {
    root: path.join(__dirname, staticDir),
  });
});

app.listen(port, () => {
  console.log(`Express server listeting on port ${port}`);
});
