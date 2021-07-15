import { createServer, Response } from 'miragejs';
import eventList from './mirage/events.json';
import clubList from './mirage/clubs.json';
import volunteeringList from './mirage/volunteering.json';

export default function () {
    createServer({
        routes() {
            this.get('/events', () => eventList, { timing: 1000 });
            this.get('/events/:id', (schema, req) => {
                const data = eventList.find((e) => e.id === req.params.id);
                if (data !== undefined) return data;
                else return new Response(400, {}, { error: 'Unable to retrive current event' });
            });
            this.post('/events', () => {
                return new Response(200, {}, { n: 1 });
            }, { timing: 2000 });
            this.get('/clubs', () => clubList, { timing: 1000 });
            this.get('/clubs/:id', (schema, req) => {
                const data = clubList.find((c) => c.id === req.params.id);
                if (data !== undefined) return data;
                else return new Response(400, {}, { error: 'Unable to retrive current club' });
            });
            this.post('/clubs', () => {
                return new Response(200, {}, { n: 1 });
            });
            this.get('/volunteering', () => volunteeringList, { timing: 1000 });
            this.get('/volunteering/:id', (schema, req) => {
                const data = volunteeringList.find((v) => v.id === req.params.id);
                if (data !== undefined) return data;
                else return new Response(400, {}, { error: 'Unable to retrive current volunteering' });
            });
            this.post('/volunteering', () => {
                return new Response(200, {}, { n: 1 });
            });                
            this.get('/auth/ip', () => ({ ip: '192.168.1.000' }));
            this.post('/auth', () => {
                return new Response(200, {}, { loggedIn: true });
            });
            this.get('/auth/user/:id', () => {
                return new Response(200, {}, { name: 'Bob Joe', email: 'bobjoe@gmail.com' });
            });
        },
    });
}
