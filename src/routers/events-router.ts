import { Router } from 'express';
import { getDefaultEvent } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const eventsRouter = Router();

eventsRouter
    .all('/*', authenticateToken)
    .get('/', getDefaultEvent);

export { eventsRouter };
