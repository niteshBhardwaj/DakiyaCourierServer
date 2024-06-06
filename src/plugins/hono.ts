import { Hono, HonoRequest } from 'hono';
import { logger } from 'hono/logger'

// Register Hone routes.
export default async () => {
    const app = new Hono()
    app.use(logger())
    app.get('/', (c) => c.text('Hello World!'))
    return app
};
