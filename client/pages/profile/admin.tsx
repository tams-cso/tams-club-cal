import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getIsAdmin, getLoggedIn } from '../../src/api';
import type { Resource } from '../../src/types';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import PageWrapper from '../../src/components/shared/page-wrapper';
import Loading from '../../src/components/shared/loading';
import ManageResources from '../../src/components/admin/manage-resources';

// Server-side Rendering to check for token
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Get the token from cookies
    const token = ctx.req.cookies.token;
    if (token === undefined) return { props: { authorized: false, error: false } };

    // Check if valid token and compare with database
    const res = await getLoggedIn(token);
    const adminRes = await getIsAdmin(token);
    if (res.status !== 200 || adminRes.status !== 200) return { props: { authorized: false, error: true } };

    // If there is no issue with the authorization, authorize user!
    return { props: { authorized: res.data.loggedIn && adminRes.data.admin, error: false } };
};

/**
 * Admin dashboard page -- users can only access if they are
 * logged in and have admin privileges.
 */
const Admin = ({ authorized, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    // Redirect the user if they are illegally here
    useEffect(() => {
        if (!authorized) {
            router.push('/profile');
        }
    }, []);

    // Return error if user is not logged in and is not an admin
    if (!authorized) {
        return (
            <PageWrapper>
                <Loading error={error}>
                    Could not get data. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container>
                <Typography variant="h2" component="h1" sx={{ textAlign: 'center', padding: 2 }}>
                    Admin Dashboard
                </Typography>
                <Grid container spacing={{ xs: 2, lg: 4 }} sx={{ padding: 3 }}>
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={1} sx={{ padding: 2, height: '100%' }}>
                            <Typography variant="h3" sx={{ textAlign: 'center' }}>
                                Manage Resources
                            </Typography>
                            <ManageResources />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={1} sx={{ padding: 2, height: '100%' }}>
                            <Typography variant="h3" sx={{ textAlign: 'center' }}>
                                Edit External Links
                            </Typography>
                            <Typography sx={{ textAlign: 'center', color: '#888', paddingTop: 2 }}>
                                To be added
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={1} sx={{ padding: 2, height: '100%' }}>
                            <Typography variant="h3" sx={{ textAlign: 'center' }}>
                                Change User Permissions
                            </Typography>
                            <Typography sx={{ textAlign: 'center', color: '#888', paddingTop: 2 }}>
                                To be added
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={1} sx={{ padding: 2, height: '100%' }}>
                            <Typography variant="h3" sx={{ textAlign: 'center' }}>
                                Feedback
                            </Typography>
                            <Typography sx={{ textAlign: 'center', color: '#888', paddingTop: 2 }}>
                                To be added
                            </Typography>
                            <List></List>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </PageWrapper>
    );
};

export default Admin;
