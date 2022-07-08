import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { getRoomReservationList } from '../../../../../src/api';
import { parseReservations } from '../../../../../src/util/dataParsing';
import { parseDateParams } from '../../../../../src/util/datetime';
import HomeBase from '../../../../../src/components/home/home-base';
import TitleMeta from '../../../../../src/components/meta/title-meta';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

import data from '../../../../../src/data.json';
import Loading from '../../../../../src/components/shared/loading';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Extract params to get the month to use
    const now = parseDateParams(ctx.params.date as string[]);

    // Make sure room is a valid room and return error if not
    const room = ctx.params.room as string;
    const roomObj = data.rooms.find((r) => r.value === room);
    if (!roomObj) {
        return {
            props: { now: now.valueOf(), reservationList: [], error: true, room: { label: '', value: '' } },
        };
    }

    // Get the reservations for a specific room for a given month
    // and send an error if either fails to retrieve
    const reservations = await getRoomReservationList(ctx.params.room as string, now.valueOf());

    return {
        props: {
            now: now.valueOf(),
            reservationList: reservations.data,
            error: reservations.status !== 200,
            room: roomObj,
        },
    };
};

const ReservationRoom = ({
    now,
    reservationList,
    error,
    room,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const month = dayjs(now);
    const [resMonthComponent, setResMonthComponent] = useState(null);

    // Adjust the offset of month when user clicks on the arrow buttons
    // The change that is passed in will be +1 or -1 depending on which arrow button was clicked
    const offsetMonth = (forward: boolean) => {
        const newMonth = forward ? month.add(1, 'month') : month.subtract(1, 'month');
        router.push(`/events/reservations/room/${room.value}/${newMonth.format('YYYY/M')}`);
    };

    const back = () => {
        router.push(`/events/reservations/${month.format('YYYY/MM/DD')}`);
    };

    // Parse fetched reservations
    useEffect(() => {
        if (error) return;

        // Parse the reservations and save to state variable
        setResMonthComponent(parseReservations(reservationList, month, true, room)[0]);
    }, [reservationList]);

    // Send error if cannot get data
    if (error) {
        return (
            <HomeBase noDrawer noActionBar>
                <Loading error sx={{ marginBottom: 4 }}>
                    Invalid room name! Please navigate back here through the reservation calendar
                    <Button size="small" onClick={back} sx={{ margin: 'auto', marginTop: 1, display: 'block' }}>
                        Back
                    </Button>
                </Loading>
            </HomeBase>
        );
    }

    return (
        <HomeBase noDrawer noActionBar>
            <TitleMeta title={`${room.label} Reservations`} path={`/events/reservations/room/${room}`} />
            <Typography variant="h1" sx={{ textAlign: 'center', marginTop: 2, marginBottom: 1 }}>
                Reservations for {room.label}
            </Typography>
            <Button size="small" onClick={back} sx={{ margin: 'auto', marginBottom: 1 }}>
                Back
            </Button>
            <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                <IconButton size="small" onClick={offsetMonth.bind(this, false)}>
                    <ArrowBackIosRoundedIcon />
                </IconButton>
                <Typography variant="h1" component="h2" sx={{ width: 250, textAlign: 'center' }}>
                    {month.format('MMMM YYYY')}
                </Typography>
                <IconButton size="small" onClick={offsetMonth.bind(this, true)}>
                    <ArrowForwardIosRoundedIcon />
                </IconButton>
            </Box>
            {resMonthComponent}
        </HomeBase>
    );
};

export default ReservationRoom;
