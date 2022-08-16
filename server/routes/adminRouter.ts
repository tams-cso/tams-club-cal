import express from 'express';
import type { Request, Response } from 'express';
import { sendError } from '../functions/util';
import { isAuthenticated } from '../functions/auth';
import { deleteClubImages } from '../functions/images';
import Event from '../models/event';
import Club from '../models/club';
import Volunteering from '../models/volunteering';
import History from '../models/history';
import { AccessLevelEnum } from '../types/AccessLevel';

const router = express.Router();

/**
 * GET /admin/resoruces/<resource>?page=<page_num>&limit=<items_per_page>&sort=<sorting_method>&reverse=<true_if_sort_reverse>&filter=<filter>
 *
 * Will retrieve the list of resources based on the resource, field, and search parameters.
 * If the field is 'all', then the search parameter is ignored.
 * If the page field is defined and the field is 'all', then the function will return
 * the specified page of the resource list.
 */
router.get('/resources/:resource', async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const sort = req.query.sort ? { [req.query.sort as string]: req.query.reverse === 'true' ? -1 : 1 } : null;
    // TODO: The filter querystring should NOT be JSON TT -> change it to be filter-field=[field]&filter-value=[value]
    const filterData = req.query.filter ? JSON.parse(req.query.filter as string) : null;
    const filter = filterData ? { [filterData.columnField]: new RegExp(`.*${filterData.value}.*`, 'i') } : {};

    switch (req.params.resource) {
        case 'events': {
            const events = await Event.paginate(filter, { lean: true, leanWithId: false, page, limit, sort });
            res.send(events);
            break;
        }
        case 'clubs': {
            const clubs = await Club.paginate(filter, { lean: true, leanWithId: false, page, limit, sort });
            res.send(clubs);
            break;
        }
        case 'volunteering': {
            const volunteering = await Volunteering.paginate(filter, {
                lean: true,
                leanWithId: false,
                page,
                limit,
                sort,
            });
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

    // Check if user is authenticated
    if (!isAuthenticated(req, res, AccessLevelEnum.ADMIN)) return;

    // If everything is good, delete the resource
    try {
        switch (req.params.resource) {
            case 'events': {
                // Get previous event and return error if invalid ID
                const event: EventObject = await Event.findOne({ id: req.params.id });
                if (!event) {
                    sendError(res, 400, 'Invalid ID');
                    return;
                }

                // Delete event from History DB and Events DB
                const deleteRes = await Event.deleteOne({ id: req.params.id });
                await History.deleteMany({ resource: 'events', editId: req.params.id });

                // Return ok or error
                if (deleteRes.deletedCount === 1) res.status(204);
                else sendError(res, 500, 'Could not delete event');
                break;
            }
            case 'clubs': {
                // Get club
                const club = await Club.findOne({ id: req.params.id });

                // Delete images from AWS
                await deleteClubImages(club);

                // Delete club and history
                const deleteRes = await Club.deleteOne({ id: req.params.id });
                await History.deleteMany({ resource: 'clubs', editId: req.params.id });

                // Return ok or error
                if (deleteRes.deletedCount === 1) res.status(204);
                else sendError(res, 500, 'Could not delete club');
                break;
            }
            case 'volunteering': {
                // Delete volunteering and history
                const deleteRes = await Volunteering.deleteOne({ id: req.params.id });
                await History.deleteMany({ resource: 'volunteering', editId: req.params.id });

                // Return ok or error
                if (deleteRes.deletedCount === 1) res.status(204);
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
