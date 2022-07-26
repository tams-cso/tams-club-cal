import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import dayjs, { Dayjs } from 'dayjs';
import { AccessLevelEnum } from '../../../src/types/enums';
import { getReservationList } from '../../../src/api';
import { getAccessLevel } from '../../../src/util/miscUtil';
import { parseReservations } from '../../../src/util/dataParsing';
import { parseDateParams } from '../../../src/util/datetime';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DatePicker from '@mui/lab/DatePicker';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosRounded from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRounded from '@mui/icons-material/ArrowForwardIosRounded';
import Loading from '../../../src/components/shared/loading';
import AddButton from '../../../src/components/shared/add-button';
import { useRouter } from 'next/router';
import HomeBase from '../../../src/components/home/home-base';
import TitleMeta from '../../../src/components/meta/title-meta';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Extract params to get the month to use
    const now = parseDateParams(ctx.params.date as string[]);

    // Get the reservation for the given week
    // and send an error if either fails to retrieve
    const reservations = await getReservationList(now.valueOf());
    const level = await getAccessLevel(ctx);
    return {
        props: {
            now: now.valueOf(),
            reservationList: reservations.data,
            error: reservations.status !== 200,
            level,
        },
    };
};

/**
 * The main Reservations page that displays a list of reservations.
 * This page will fetch the list of reservations from the server for a given week,
 * split them by day, and display them in a table by hour.
 * There is also a Date Picker that allows the user to select a different week.
 */
const Reservations = ({
    now,
    reservationList,
    error,
    level,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [reservationComponentList, setReservationComponentList] = useState(null);

    // Adjust the offset of week when user clicks on the arrow buttons
    // The change that is passed in will be +1 or -1 depending on which arrow button was clicked
    const offsetWeek = (forward: boolean) => {
        // Increment week
        const newWeek = forward ? dayjs(now).add(1, 'week') : dayjs(now).subtract(1, 'week');
        router.push(`/events/reservations/${newWeek.format('YYYY/M/D')}`);
    };

    // Redirect the user to the new week if it changes and is not the same as the current
    const changeWeek = (date: Dayjs) => {
        // If the week is invalid (ie. user manually changed the text input), do nothing
        if (isNaN(date.valueOf())) return;

        // If the week is the same as before, don't do anything either
        if (date.isSame(now, 'week')) return;

        // Otherwise, redirect the user to the new week
        router.push(`/events/reservations/${date.format('YYYY/M/D')}`);
    };

    // Redirect the user to the current week on click
    const goToToday = () => {
        changeWeek(dayjs());
    };

    // Scroll down to the requested day
    // Index refers to the day of the week where Sunday = 0, Monday = 1, ..., Saturday = 6
    const goToDay = (index) => {
        window.scrollTo(0, 180 + 630 * index);
    };

    // When the list of reservations updates, re-render the reservation components
    // This will create a table of reservations
    useEffect(() => {
        // If the reservation list is null, do nothing
        if (error) return;

        // Parse the reservations by breaking up reservations and splitting them into days
        const components = parseReservations(reservationList, dayjs(now));

        // Update the state variable with the list of reservations
        setReservationComponentList(
            <Box display="flex" flexDirection="column">
                {components}
            </Box>
        );
    }, [reservationList]);

    // Send error if cannot get data
    if (error) {
        return (
            <HomeBase noDrawer>
                <Loading error sx={{ marginBottom: 4 }}>
                    Could not get reservation list. Please reload the page or contact the site manager to fix this
                    issue.
                </Loading>
            </HomeBase>
        );
    }

    // Create the list of buttons for the current week
    const weekButtonList = [];
    const start = dayjs(now).startOf('week');
    for (let i = 0; i < 7; i++) {
        weekButtonList.push(start.add(i, 'day').format('ddd M/D'));
    }

    return (
        <HomeBase noDrawer>
            <TitleMeta title="Reservations" path="/events/reservations" />
            <Box width="100%" display="flex" justifyContent="left" alignItems="center">
                <DatePicker
                    inputFormat="[Week of] MMM D, YYYY"
                    label="Select week to show"
                    value={now}
                    onChange={changeWeek}
                    renderInput={(params) => (
                        <TextField {...params} variant="standard" sx={{ marginLeft: { sm: 4, xs: 2 } }} />
                    )}
                />
                <IconButton size="small" onClick={offsetWeek.bind(this, false)} sx={{ marginLeft: 3 }}>
                    <ArrowBackIosRounded />
                </IconButton>
                <IconButton size="small" onClick={offsetWeek.bind(this, true)} sx={{ marginLeft: 1 }}>
                    <ArrowForwardIosRounded />
                </IconButton>
                <Button variant="outlined" onClick={goToToday} sx={{ mx: 3 }}>
                    Today
                </Button>
                {weekButtonList.map((day, i) => (
                    <Button
                        variant="text"
                        onClick={goToDay.bind(this, i)}
                        sx={{ mx: 2, display: { lg: 'flex', md: 'none' } }}
                        key={day}
                    >
                        {day}
                    </Button>
                ))}
            </Box>
            <AddButton
                color="primary"
                label="Event"
                path={level < AccessLevelEnum.STANDARD ? '/profile?prev=/edit/events' : '/edit/events'}
            />
            {reservationComponentList === null ? <Loading /> : reservationComponentList}
        </HomeBase>
    );
};

export default Reservations;
