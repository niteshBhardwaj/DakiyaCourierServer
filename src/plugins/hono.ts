import { Hono, HonoRequest } from 'hono';
import { cors } from 'hono/cors';
// import { logger } from 'hono/logger'

// Register Hone routes.
export default async () => {
    const app = new Hono()
    // app.use(logger());
    app.use(cors({
        origin: '*',
        credentials: true,
        allowMethods: ['GET', 'POST'],
        allowHeaders: ['Content-Type', 'Authorization'],
    }))
    app.get('/', (c) => c.text('Welcome to Dakiya API!'))
    app.get('/health', (c) => c.text('OK'))
    return app
};
