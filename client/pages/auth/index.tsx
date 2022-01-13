import React, { useEffect } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';

import PageWrapper from '../../src/components/shared/page-wrapper';
import Loading from '../../src/components/shared/loading';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Get the token from cookies
    const token = ctx.query.token;
    if (token === undefined) return { props: { token: null, error: true } };
    else return { props: { token, error: false } };
};

/**
 * Authentication page to redirect to check if the user is
 * correctly logged in. If not, redirect them back to the home page.
 * Otherwise, return them to the previous page they were on.
 * This component utilizes browser cookies to log in the user.
 */
const Auth = ({ token, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    // When loaded, check if the user has a token parameter in the url
    // If they do, return the user to the previous page they were on
    // Otherwise, redirect them to the home page and show an error
    useEffect(() => {
        if (error) {
            setTimeout(() => {
                router.push('/profile');
            }, 3000);
        } else {
            // Saves the token into the cookies so the user doesn't have to re-login
            // TODO: This does not seem to work for long TT-TT
            const cookies = new Cookies();
            cookies.set('token', token, { sameSite: 'strict', path: '/' });

            // Return the user to the previous page they were on
            const prev = cookies.get('prev');
            cookies.remove('prev', { path: '/' });
            if (prev) router.push(prev);
            else router.push('/profile/dashboard');
        }
    }, []);

    return (
        <PageWrapper>
            <Loading error={error}>
                Error logging in. Please check your internet and allow cookies then try again. Redirecting you to the
                login page in 3 seconds...
            </Loading>
        </PageWrapper>
    );
};

export default Auth;
