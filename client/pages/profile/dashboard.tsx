import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Cookies from 'universal-cookie';
import { getLoggedIn, getUserInfo, getIsAdmin } from '../../src/api';

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

// Server-side Rendering to check for token and get data
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // TODO: Remove nested if statements by replacing it with if-false-return structure

    // Get the token from cookies
    const token = ctx.req.cookies.token;
    if (token !== undefined) {
        // Check if valid token and compare with database
        const res = await getLoggedIn(token);
        if (res.status === 200 && res.data.loggedIn) {
            // Token is valid, get user info
            const userRes = await getUserInfo(token);
            if (userRes.status === 200) {
                // Check to see if user is an admin and show button if so
                const adminRes = await getIsAdmin(token);
                return {
                    props: {
                        authorized: true,
                        isAdmin: adminRes.data && adminRes.data.admin,
                        info: userRes.data,
                        error: true,
                    },
                };
            }
            // Show error if user info cannot be gotten
            return { props: { authorized: true, isAdmin: false, info: null, error: false } };
        }
    }
    // Return not authorized if token is missing/bad
    return { props: { authorized: false, isAdmin: false, info: null, error: false } };
};

/**
 * User dashboard page that displays the user's profile information,
 * along with their personal edit history.
 */
const Dashboard = ({ authorized, error, isAdmin, info }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    // Redirect the user to the admin page
    const toAdmin = () => router.push('/profile/admin');

    // Redirect user if they are not logged in
    useEffect(() => {
        const cookies = new Cookies();

        // If missing or bad token, return user to login page
        if (!authorized) {
            cookies.remove('token', { path: '/' });
            router.push('/profile');
            return;
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{info ? info.name : 'Loading...'}</TableCell>
                                        <TableCell>{info ? info.email : 'Loading...'}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {isAdmin ? (
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
