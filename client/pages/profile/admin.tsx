import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getIsAdmin, getLoggedIn } from '../../src/api';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import PageWrapper from '../../src/components/shared/page-wrapper';
import Loading from '../../src/components/shared/loading';
import ManageResources from '../../src/components/admin/manage-resources';
import TitleMeta from '../../src/components/meta/title-meta';
import RobotBlockMeta from '../../src/components/meta/robot-block-meta';

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
            <TitleMeta title="Admin Dashboard" path="/profile/admin" />
            <RobotBlockMeta />
            <Container>
                <Typography variant="h2" component="h1" sx={{ textAlign: 'center', padding: 2 }}>
                    Admin Dashboard
                </Typography>
                <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 3 }}>
                    Manage Resources
                </Typography>
                <ManageResources />
                <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 3 }}>
                    Edit External Links
                </Typography>
                <Typography sx={{ textAlign: 'center', color: '#888', paddingTop: 2 }}>To be added</Typography>
                <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 3 }}>
                    Change User Permissions
                </Typography>
                <Typography sx={{ textAlign: 'center', color: '#888', paddingTop: 2 }}>To be added</Typography>
                <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 3 }}>
                    Feedback
                </Typography>
                <Typography sx={{ textAlign: 'center', color: '#888', paddingTop: 2 }}>To be added</Typography>
                <List></List>
            </Container>
        </PageWrapper>
    );
};

export default Admin;
