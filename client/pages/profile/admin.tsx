import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { AccessLevelEnum } from '../../src/types/enums';
import { getUserInfo } from '../../src/api';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PageWrapper from '../../src/components/shared/page-wrapper';
import Loading from '../../src/components/shared/loading';
import TitleMeta from '../../src/components/meta/title-meta';
import RobotBlockMeta from '../../src/components/meta/robot-block-meta';
import Link from '../../src/components/shared/Link';
import ManageResources from '../../src/components/admin/manage-resources';
import EditLinkList from '../../src/components/admin/edit-link-list';
import ChangeUserPermissions from '../../src/components/admin/change-user-permissions';
import ViewFeedback from '../../src/components/admin/view-feedback';

// Server-side Rendering to check for token
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Get the token from cookies
    const tokenCookie = ctx.req.cookies.token;
    if (tokenCookie === undefined) return { props: { authorized: false, error: false } };
    const token = JSON.parse(tokenCookie).token as string;

    // Check if valid token and compare with database
    const res = await getUserInfo(token);
    if (res.status !== 200) return { props: { authorized: false, error: true } };

    // If there is no issue with the authorization, authorize user!
    return { props: { authorized: res.data.level === AccessLevelEnum.ADMIN, error: false } };
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
                    Edit External Links
                </Typography>
                <Typography sx={{ textAlign: 'center', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                    All icon names are found from{' '}
                    <Link href="https://fonts.google.com/icons?icon.style=Rounded" target="_blank">
                        Google Material Symbols
                    </Link>
                    . Type the icon name as shown on the icon list with underscore case.
                </Typography>
                <EditLinkList />
                <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 3 }}>
                    Manage Resources
                </Typography>
                <ManageResources />
                <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 3 }}>
                    Change User Permissions
                </Typography>
                <ChangeUserPermissions />
                <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 3 }}>
                    Feedback
                </Typography>
                <ViewFeedback />
            </Container>
        </PageWrapper>
    );
};

export default Admin;
