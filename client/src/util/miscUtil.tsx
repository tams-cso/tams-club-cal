import React from 'react';
import Link from '../components/shared/Link';
import { AccessLevelEnum } from '../types/enums';
import { getUserInfo } from '../api';
import { GetServerSidePropsContext } from 'next';

import data from '../data.json';

/**
 * Gets a query parameter given the key
 */
export function getParams(key: string): string | null {
    return new URLSearchParams(window.location.search).get(key);
}

/**
 * Takes in text and a classname, parses the links, and creates
 * a Fragment with the links in Link elements. Uses a regular expression
 * to parse links in paragraphs -- must begin with http or https.
 *
 * @param text The text to parse and display
 * @returns A React jsx fragment containing text and link components
 */
export function parseLinks(text: string): React.ReactFragment {
    const re = /((?:http|https):\/\/.+?)(?:\.|\?|!)?(?:\s|$)/g;
    let m: RegExpExecArray;
    let matches = [];
    do {
        m = re.exec(text);
        if (m) matches.push(m);
    } while (m);

    let tempText = text;
    let outText = [];
    let prevIndex = 0;
    matches.forEach((m) => {
        outText.push(tempText.substring(prevIndex, tempText.indexOf(m[1])));
        outText.push(
            <Link key={m[1]} href={m[1]} target="_blank">
                {m[1]}
            </Link>
        );
        tempText = tempText.substring(tempText.indexOf(m[1]) + m[1].length);
    });
    outText.push(tempText);

    return <React.Fragment>{outText}</React.Fragment>;
}

/**
 * Redirect user and reload the page to a specified path
 */
export function redirect(path: string): void {
    window.location.href = `${window.location.origin}${path}`;
}

/**
 * This function will remove all deleted links and return
 * a string list of the values, with the empty ones removed
 *
 * @param list List of link objects with deleted and value attributes
 */
export function processLinkObjectList(list: LinkInputData[]): string[] {
    if (!list) return [];
    return list.filter((l) => !l.deleted && l.value.trim() !== '').map((l) => l.value);
}

/**
 * Converts the access level enum to a string
 * @param level Access level
 */
export function accessLevelToString(level: AccessLevel): string {
    const levelMap = ['Standard', 'Clubs', 'Admin'];
    return levelMap[level];
}

/**
 * Gets the access level of the user
 */
export async function getAccessLevel(ctx: GetServerSidePropsContext): Promise<AccessLevel> {
    // Get token cookie from SSR props context
    const token = getTokenFromCookies(ctx);
    if (!token) return AccessLevelEnum.NONE;

    // Check if valid token and compare with database
    const res = await getUserInfo(token);
    if (res.status !== 200) return AccessLevelEnum.NONE;

    return res.data.level;
}

/**
 * Extracts the user login token from the cookies
 */
export function getTokenFromCookies(ctx: GetServerSidePropsContext): string {
    const tokenCookie = ctx.req.cookies.token;
    if (tokenCookie === undefined) return null;
    return JSON.parse(tokenCookie).token as string;
}

/**
 * Converts the event type to a capitalized string
 *
 * @param type Event type
 * @returns Capitalized string
 */
export function eventTypeToString(type: EventType): string {
    switch (type) {
        case 'event':
            return 'Event';
        case 'ga':
            return 'GA';
        case 'meeting':
            return 'Meeting';
        case 'volunteering':
            return 'Volunteering';
        default:
            return 'Other';
    }
}

/**
 * Converts a location to a string
 *
 * @param location Location value
 * @return String representation of the location, or null if no location
 */
export function locationToString(location: string): string {
    if (location === 'none') return null;

    const room = data.rooms.find((d) => d.value === location);
    if (room) return room.label;
    return location;
}
