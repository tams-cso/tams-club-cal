import { createServer, Response } from 'miragejs';
import eventList from './mirage/events.json';
import clubList from './mirage/clubs.json';
import volunteeringList from './mirage/volunteering.json';

export default function () {
    createServer({
        routes() {
            this.get('/events', () => eventList, { timing: 1000 });
            this.get(
                '/events/:id',
                (schema, req) => {
                    const data = eventList.find((e) => e.id === req.params.id);
                    if (data !== undefined) return data;
                    else return new Response(400, null, { error: 'Unable to retrive current event' });
                },
                { timing: 1000 }
            );
            this.get('/clubs', () => clubList, { timing: 1000 });
            this.get(
                '/clubs/:id',
                (schema, req) => {
                    const data = clubList.find((c) => c.id === req.params.id);
                    if (data !== undefined) return data;
                    else return new Response(400, null, { error: 'Unable to retrive current club' });
                },
                { timing: 1000 }
            );
            this.get('/volunteering', () => volunteeringList, { timing: 1000 });
            this.get(
                '/clubs/:id',
                (schema, req) => {
                    const data = volunteeringList.find((v) => v.id === req.params.id);
                    if (data !== undefined) return data;
                    else return new Response(400, null, { error: 'Unable to retrive current volunteering' });
                },
                { timing: 1000 }
            );
        },
    });
}
