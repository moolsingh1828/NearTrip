import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import placeRoutes from './routes/place.routes.js';
import routeRoutes from './routes/route.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import shareRoutes from './routes/share.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();
app.use(cors({ origin: env.clientUrl === '*' ? true : env.clientUrl }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'roamly-api', time: new Date().toISOString() }));
app.use('/api/places', placeRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/share', shareRoutes);
app.use(notFound);
app.use(errorHandler);

await connectDb();
app.listen(env.port, () => console.log(`[server] Roamly API running at http://localhost:${env.port}`));
