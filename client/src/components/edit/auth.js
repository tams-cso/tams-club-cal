import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { getParams } from '../../functions/util';

import PageWrapper from '../shared/page-wrapper';
import Loading from '../shared/loading';
import { useHistory } from 'react-router';

/**
 * Authentication page to redirect to check if the user is
 * correctly logged in. If not, redirect them back to the home page.
 * Otherwise, return them to the previous page they were on.
 * This component utilizes browser cookies to log in the user.
 */
const Auth = () => {
    const [error, setError] = useState();
    const history = useHistory();

    // When loaded, check if the user has a token parameter in the url
    // If they do, return the user to the previous page they were on
    // Otherwise, redirect them to the home page and show an error
    useEffect(() => {
        // Get the token from the url params
        const token = getParams('token');

        // Check for token
        if (token === null) {
            setError(true);
            setTimeout(() => {
                history.push('/');
            }, 3000);
        } else {
            // Saves the token into the cookies so the user doesn't have to re-login
            // TODO: This does not seem to work lol
            const cookies = new Cookies();
            cookies.set('token', token, { sameSite: 'strict', path: '/' });
            
            // Return the user to the previous page they were on
            const prev = cookies.get('prev');
            cookies.remove('prev', { path: '/' });
            if (prev !== null) history.push(prev);
            else history.push('/');
        }
    }, []);

    return (
        <PageWrapper>
            <Loading error={error}>
                Error logging in. Please check your internet and allow cookies then try again. Redirecting you to the
                home page in 3 seconds...
            </Loading>
        </PageWrapper>
    );
};

export default Auth;
