import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import ReservationDay from '../components/reservations/reservation-day';
import ReservationMonth from '../components/reservations/reservation-month';
import { isNotMidnight } from './datetime';

// ================== DATA PARSING FUNCTIONS =================== //
/**
 * Will split up multiple day events to be displayed correctly.
 * This will essentially create a new event for each day of the multi-day event.
 *
 * @param eventList The unparsed event list
 * @returns The event list with split up events across days
 */

export function parsePublicEventList(eventList: CalEvent[]): CalEvent[] {
    const outputList = [];
    eventList.forEach((a) => {
        // Simply return the event if it does not span across multiple days
        if (dayjs(a.start).isSame(dayjs(a.end), 'day') || isNotMidnight(a.end) === 0) {
            outputList.push(a);
            return;
        }

        // Calculate how many days the events span
        // TODO: This still probably doesn't work with events that start/end on midnight
        let currDate = dayjs(a.start);
        const span = dayjs(a.end).diff(currDate, 'day') + isNotMidnight(a.start);

        // Iterate through the days and set the display start/end times
        for (let day = 1; day <= span; day++) {
            const currEnd = day === span ? dayjs(a.end) : currDate.add(1, 'day').startOf('day');
            outputList.push({
                ...a,
                start: currDate.valueOf(),
                end: currEnd.valueOf(),
                name: `${a.name} (Day ${day}/${span})`,
                allDay:
                    (day !== 1 && day !== span) ||
                    (day === 1 && isNotMidnight(a.start) === 0) ||
                    (day === span && isNotMidnight(a.end) === 0),
            });
            currDate = currEnd;
        }
    });
    return outputList.sort((a, b) => a.start - b.start);
}
/**
 * Function to break up reservations by day and filter out reservations outside
 * of the defined time range.
 *
 * @param reservationList List of reservations
 * @param date Date to get reservations; this can be any day in the week (or month if useMonth)
 * @param useMonth If true, will return a list of reservations within the current month
 * @param room Room object, required if useMonth is true
 * @returns List of ReservationDay elements for each reservation set
 */

export function parseReservations(
    reservationList: CalEvent[],
    date: Dayjs,
    useMonth: boolean = false,
    room?: Room
): JSX.Element[] {
    // Break up reservations into days and sort the reservations
    const brokenUpReservationList: BrokenReservation[] = [];
    reservationList.forEach((r) => {
        // Use variable to track the current day that we are working on
        let curr = dayjs(r.start);

        // Iterate through the days until we reach the end of the reservation
        // This is useful for splitting up reservations that span multiple days
        while (!curr.isSame(dayjs(r.end), 'day')) {
            // If the current hour is 23 and the "end" of the event is within the next hour, break
            // This is to prevent events that end at midnight from appearing on the next day
            if (curr.hour() === 23 && curr.add(1, 'hour').isSame(dayjs(r.end), 'hour')) break;

            // Calculate the number of hours between the current hour and the end of the day
            const currEnd = curr.add(1, 'day').startOf('day');
            const currSpan = currEnd.diff(curr, 'hour');

            // Create an entry for the section of the event that spans this day
            // This entry will span the entire length of the day if it crosses over the entire day
            // However, the span will be less than 24 if it is less than the entire day
            brokenUpReservationList.push({ start: curr.valueOf(), end: currEnd.valueOf(), span: currSpan, data: r });
            curr = currEnd;
        }

        // Now we calculate the number of hours between the current hour and the end of the reservation
        // This is because the while loop will break on the last day of the reservation and we must
        // push the last segment on manually
        const span = dayjs(r.end).diff(curr, 'hour');
        brokenUpReservationList.push({ start: curr.valueOf(), end: r.end, span, data: r });
    });

    // The reservation list is sorted by start date
    const sortedReservationList = brokenUpReservationList.sort((a, b) => a.start.valueOf() - b.start.valueOf());

    // Create a cut reservation list that only contains reservation blocks that
    // start at 6am or after -> this will remove all blocks between 12am and 6am
    // and truncate blocks that start within this interval but end after
    const cutReservationList = [];
    sortedReservationList.forEach((r) => {
        // Convert to dayjs
        const start = dayjs(r.start);
        const end = dayjs(r.end);
        // If the reservation starts outside of the interval, simply add it to the list
        if (start.hour() >= 6) {
            cutReservationList.push(r);
        } else {
            // If the reservation starts within the 6am-12am interval,
            // and ends after this interval, keep the block but truncate the start
            // Otherwise we will simply ignore the block and remove it from the list
            if (end.hour() >= 6 || end.day() !== start.day()) {
                const diff = 6 - start.hour();
                cutReservationList.push({ ...r, start: start.hour(6), span: r.span - diff });
            }
        }
    });

    // If using months, there's only one ReservationMonth component
    // This will still return an array of "components", but it will just be a single element array
    if (useMonth) {
        const monthStart = date.startOf('month');
        const monthReservations = cutReservationList.filter((r) => monthStart.isSame(dayjs(r.start), 'month'));
        return [<ReservationMonth reservationList={monthReservations} date={date} room={room} />];
    }

    // Calculate start/end dates for list
    const start = date.startOf('week');
    const end = start.add(7, 'day');

    // Create the actual reservation components by iterating through the sorted list
    // and incrementing days when the next event in the sorted list is on the next day
    // This will continue to increment until the last day of the week
    // TODO: Add a catch for an infinite loop
    const components = [];
    let currTime = start;
    while (currTime.isBefore(end, 'day')) {
        components.push(
            <ReservationDay
                reservationList={cutReservationList.filter((r) => currTime.isSame(dayjs(r.start), 'day'))}
                date={currTime}
                key={currTime.valueOf()}
            />
        );
        currTime = currTime.add(1, 'day');
    }

    return components;
}
