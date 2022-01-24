import dayjs, { Dayjs } from 'dayjs';
import Event from '../models/event';
import { addRecurringToCalendar, deleteCalendarEvent, updateCalendar, updateRecurringCalendar } from './gcal';
import { EventObject, RepeatingStatus } from './types';
import type { calendar_v3 } from 'googleapis';
import { newId } from './util';

/**
 * Creates the repeating events for a given event
 *
 * @param originalId Original event ID or new ID
 * @param originalEvent Original Event Document to create or modify repeating events for
 * @param offsetEvent Last event in previous repeating instances; used for appending events
 */
export async function addRepeatingEvents(
    originalId: string,
    originalEvent: EventObject,
    offsetEvent?: EventObject
): Promise<EventObject[]> {
    // Make sure the event is actually repeating lol
    if (originalEvent.repeats === RepeatingStatus.NONE)
        throw new Error(`Event passed in is not repeating! ID: ${originalId}, event: ${JSON.stringify(originalEvent)}`);

    // Get repeating unit of time (month/week)
    const unit = originalEvent.repeats === RepeatingStatus.MONTHLY ? 'month' : 'week';

    // Create duplicate reservations
    const repeatDates = [];
    let currStart = dayjs(offsetEvent ? offsetEvent.start : originalEvent.start).add(1, unit);
    let currEnd = dayjs(offsetEvent ? offsetEvent.end : originalEvent.end).add(1, unit);
    while (currStart.isBefore(originalEvent.repeatsUntil)) {
        repeatDates.push({ start: currStart, end: currEnd });
        currStart = currStart.add(1, unit);
        currEnd = currEnd.add(1, unit);
    }
    const extraRepeatingEvents = repeatDates.map((d) => ({
        id: newId(),
        eventId: null,
        type: originalEvent.type,
        name: originalEvent.name,
        club: originalEvent.club,
        description: originalEvent.description,
        start: d.start,
        end: d.end,
        location: originalEvent.location,
        noEnd: originalEvent.noEnd,
        allDay: originalEvent.allDay,
        repeats: originalEvent.repeats,
        repeatsUntil: originalEvent.repeatsUntil,
        repeatOriginId: originalId,
        publicEvent: originalEvent.publicEvent,
        reservation: originalEvent.reservation,
        history: [],
    }));
    return extraRepeatingEvents;
}

/**
 * Updates a repeating event and its repeating children.
 * This function will **NOT** update the time or repeating statuses of events, only the data!!
 * This will also update the history field for the main event
 *
 * @param originalId ID of the original repeating event
 * @param updateData Object data to update
 */
export async function updateRepeatingEvents(originalId: string, updateData: EventObject) {
    await Event.updateMany(
        { repeatOriginId: originalId },
        {
            $set: {
                type: updateData.type,
                name: updateData.name,
                club: updateData.club,
                description: updateData.description,
                location: updateData.location,
                allDay: updateData.allDay,
                noEnd: updateData.noEnd,
                publicEvent: updateData.name,
                reservation: updateData.name,
            },
        }
    );
    await Event.updateOne({ id: originalId }, { $set: { history: updateData.history } });
}
