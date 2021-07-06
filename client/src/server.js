import { createServer, Response } from 'miragejs';
import eventsList from './mirage/events.json';

export default function () {
    createServer({
        routes() {
            this.get('/events', () => eventsList, { timing: 1000 });
            this.get('/events/:id', (schema, req) => {
                const data = eventsList.find((e) => e.id === req.params.id);
                if (data !== undefined) return data;
                else return new Response(400, null, { error: 'Unable to retrive current event' });
            })
        },
    });
}
