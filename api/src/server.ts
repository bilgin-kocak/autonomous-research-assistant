import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'ScienceDAO API',
    version: '1.0.0',
    endpoints: [
      '/api/status',
      '/api/hypotheses',
      '/api/papers',
      '/api/proposals',
      '/api/agents',
      '/api/activity',
    ],
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 =======================================');
  console.log('🔬 ScienceDAO API Server');
  console.log('🚀 =======================================');
  console.log('');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('📊 Available endpoints:');
  console.log(`   GET /api/status      - Agent statistics`);
  console.log(`   GET /api/hypotheses  - Recent hypotheses`);
  console.log(`   GET /api/papers      - Analyzed papers`);
  console.log(`   GET /api/proposals   - Funding proposals`);
  console.log(`   GET /api/agents      - Multi-agent stats`);
  console.log(`   GET /api/activity    - Activity feed`);
  console.log('');
  console.log('🚀 =======================================');
  console.log('');
});

export default app;
