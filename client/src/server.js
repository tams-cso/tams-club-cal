import { createServer, Response } from 'miragejs';
import eventsList from './mirage/events.json';
import clubsList from './mirage/clubs.json';

export default function () {
    createServer({
        routes() {
            this.get('/events', () => eventsList, { timing: 1000 });
            this.get('/events/:id', (schema, req) => {
                const data = eventsList.find((e) => e.id === req.params.id);
                if (data !== undefined) return data;
                else return new Response(400, null, { error: 'Unable to retrive current event' });
            }, { timing: 1000 });
            this.get('/clubs', () => clubsList, { timing: 1000 });
            this.get('/clubs/:id', (schema, req) => {
                const data = clubsList.find((c) => c.id === req.params.id);
                if (data !== undefined) return data;
                else return new Response(400, null, { error: 'Unable to retrive current club' });
            }, { timing: 1000 });
            
        },
    });
}
