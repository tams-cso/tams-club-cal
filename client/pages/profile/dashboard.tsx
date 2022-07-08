import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Cookies from 'universal-cookie';
import { getUserInfo } from '../../src/api';
import { AccessLevel } from '../../src/types';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import PageWrapper from '../../src/components/shared/page-wrapper';
import Loading from '../../src/components/shared/loading';
import TitleMeta from '../../src/components/meta/title-meta';
import { accessLevelToString, getTokenFromCookies } from '../../src/util/miscUtil';

// Server-side Rendering to check for token and get data
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Error object to return if outside conditions fails
    const error = { props: { authorized: false, level: AccessLevel.STANDARD, info: null, error: false } };

    // Get the token from cookies
    const token = getTokenFromCookies(ctx);
    if (!token) return error;

    // Check if valid token and compare with database
    const userRes = await getUserInfo(token);
    if (userRes.status !== 200) return error;

    // Check to see if user is an admin and show button if so
    return {
        props: {
            authorized: true,
            level: userRes.data.level,
            info: userRes.data,
            error: false,
        },
    };
};

/**
 * User dashboard page that displays the user's profile information,
 * along with their personal edit history.
 */
const Dashboard = ({ authorized, error, level, info }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    // Redirect the user to the admin page
    const toAdmin = () => router.push('/profile/admin');

    // Log the user out by removing their auth cookies
    const logout = () => {
        const cookies = new Cookies();
        cookies.remove('token', { path: '/' });
        cookies.set('success', 'Successfully logged out!', { path: '/' });
        router.push('/profile');
    };

    // Redirect user if they are not logged in
    useEffect(() => {
        const cookies = new Cookies();

        // If missing or bad token, return user to login page
        if (!authorized) {
            // cookies.remove('token', { path: '/' });
            router.push('/profile');
        }
    }, []);

    // Redirect user if unauthorized
    if (!authorized) {
        return (
            <PageWrapper>
                <Loading error={error}>
                    Unable to load dashboard. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <TitleMeta title="Profile" path="/profile/dashboard" />
            <Container>
                <Card>
                    <CardContent>
                        <Typography variant="h2" component="h1">
                            User Information
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Access Level</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{info.name}</TableCell>
                                        <TableCell>{info.email}</TableCell>
                                        <TableCell>{accessLevelToString(level)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <Button onClick={logout}>Logout</Button>
                        </Box>
                        {level === AccessLevel.ADMIN ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                <Button onClick={toAdmin}>Go to Admin Dashboard</Button>
                            </Box>
                        ) : null}
                    </CardContent>
                </Card>
            </Container>
        </PageWrapper>
    );
};

export default Dashboard;
