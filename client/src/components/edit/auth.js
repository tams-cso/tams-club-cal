import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { getParams } from '../../functions/util';

import PageWrapper from '../shared/page-wrapper';
import Loading from '../shared/loading';
import { useHistory } from 'react-router';

const Auth = () => {
    const [error, setError] = useState();
    const history = useHistory();

    useEffect(() => {
        const token = getParams('token');
        if (token === null) {
            setError(true);
            setTimeout(() => {
                history.push('/');
            }, 3000);
        } else {
            // Get cookies and redirect the user back to the previous edit page
            const cookies = new Cookies();
            cookies.set('token', token, { sameSite: 'strict', path: '/' });
            const prev = cookies.get('prev');
            cookies.remove('prev', { path: '/' });
            if (prev !== null) history.push(prev);
            else history.push('/');
        }
    }, []);

    return (
        <PageWrapper>
            <Loading error={error}>Error logging in. Redirecting you to the home page in 3 seconds...</Loading>
        </PageWrapper>
    );
};

export default Auth;
