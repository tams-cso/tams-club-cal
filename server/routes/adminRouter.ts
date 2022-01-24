import express from 'express';
import type { Request, Response } from 'express';
import { sendError } from '../functions/util';
import { validateHeader } from '../functions/auth';
import { deleteClubImages } from '../functions/images';
import Event from '../models/event';
import Club from '../models/club';
import Volunteering from '../models/volunteering';
import History from '../models/history';
import { deleteCalendarEvent } from '../functions/gcal';

const router = express.Router();

/**
 * GET /admin/resoruces/<resource>/<field>/<search>/[page]
 *
 * Will retrieve the list of resources based on the resource, field, and search parameters.
 * If the field is 'all', then the search parameter is ignored.
 * If the page field is defined and the field is 'all', then the function will return
 * the specified page of the resource list.
 */
router.get('/resources/:resource/:field/:search/:page?', async (req: Request, res: Response) => {
    const getAll = req.params.field === 'all';
    const pageLength = 50;
    const page = req.params.page ? parseInt(req.params.page) : 0;

    switch (req.params.resource) {
        case 'events': {
            const events = getAll
                ? await Event.find({})
                      .limit(pageLength)
                      .skip((page || 0) * pageLength)
                      .exec()
                : await Event.find({ [req.params.field]: req.params.search });
            res.send(events);
            break;
        }
        case 'clubs': {
            const clubs = getAll
                ? await Club.find({})
                      .limit(pageLength)
                      .skip((page || 0) * pageLength)
                      .exec()
                : await Club.find({ [req.params.field]: req.params.search });
            res.send(clubs);
            break;
        }
        case 'volunteering': {
            const volunteering = getAll
                ? await Volunteering.find({})
                      .limit(pageLength)
                      .skip((page || 0) * pageLength)
                      .exec()
                : await Volunteering.find({ [req.params.field]: req.params.search });
            res.send(volunteering);
            break;
        }
        default:
            sendError(res, 400, 'Invalid resource field!');
            return;
    }
});

/**
 * DELETE /admin/resources/<resource>/<id>
 *
 * Deletes the given resource by id. This will also delete the related history entries.
 * Additionally, if the resource is an event, then the related reservation will also be deleted.
 */
router.delete('/resources/:resource/:id', async (req: Request, res: Response) => {
    // TODO: This is honestly also a spaghetti pile but idk if it can actually be cleaned up LMAO

    // Check to see if header is there
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        sendError(res, 401, 'Missing authorization token');
        return;
    }

    // Make sure the token is valid
    const validHeader = await validateHeader(req.headers.authorization.substring(7));
    if (!validHeader) {
        sendError(res, 401, 'Invalid authorization token');
        return;
    }

    // If everything is good, delete the resource
    try {
        switch (req.params.resource) {
            case 'events': {
                // Get previous event and return error if invalid ID
                const event = await Event.findOne({ id: req.params.id });
                if (!event) {
                    sendError(res, 400, 'Invalid ID');
                    return;
                }
    
                // Delete event from Google Calendar, History DB, and Events DB
                await deleteCalendarEvent(event.eventId);
                const deleteRes = await Event.deleteOne({ id: req.params.id });
                await History.deleteMany({ resource: 'events', id: req.params.id });
    
                // Also delete any repeating events
                await Event.deleteMany({ repeatOriginId: req.params.id });
    
                // Return ok: 1 or error
                if (deleteRes.deletedCount === 1) res.send({ ok: 1 });
                else sendError(res, 500, 'Could not delete event');
                break;
            }
            case 'clubs': {
                const club = await Club.findOne({ id: req.params.id });
                const deleteRes = await Club.deleteOne({ id: req.params.id });
                const deleteImageRes = await deleteClubImages(club);
                if (deleteImageRes !== 1) club.save();
                await History.deleteMany({ resource: 'clubs', id: req.params.id });
                if (deleteRes.deletedCount === 1 && deleteImageRes === 1) res.send({ ok: 1 });
                else sendError(res, 500, 'Could not delete club');
                break;
            }
            case 'volunteering': {
                const deleteRes = await Volunteering.deleteOne({ id: req.params.id });
                await History.deleteMany({ resource: 'volunteering', id: req.params.id });
                if (deleteRes.deletedCount === 1) res.send({ ok: 1 });
                else sendError(res, 500, 'Could not delete volunteering');
                break;
            }
            default:
                sendError(res, 400, 'Invalid resource field!');
                return;
        }
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Internal server error when deleting resource!');
    }
});

export default router;
