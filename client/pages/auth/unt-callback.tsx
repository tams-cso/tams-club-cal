import React, { useEffect, useState } from 'react';
import PageWrapper from '../../src/components/shared/page-wrapper';
import Loading from '../../src/components/shared/loading';
import TitleMeta from '../../src/components/meta/title-meta';
import RobotBlockMeta from '../../src/components/meta/robot-block-meta';
import { postLinkMicrosoft } from '../../src/api';

const UntCallback = () => {
    const [error, setError] = useState(false);

    useEffect(() => {
        async function processRedirect() {
            const hash = window.location.hash.substring(1);
            if (!hash) {
                setError(true);
                return;
            }

            const params = new URLSearchParams(hash);
            const idToken = params.get('id_token');
            const state = params.get('state');
            const errDesc = params.get('error_description') || params.get('error');

            if (errDesc) {
                setError(true);
                return;
            }

            if (!idToken) {
                setError(true);
                return;
            }

            const savedState = sessionStorage.getItem('msState');
            if (state && savedState && state !== savedState) {
                setError(true);
                return;
            }

            sessionStorage.removeItem('msNonce');
            sessionStorage.removeItem('msState');
            const returnUrl = sessionStorage.getItem('msReturnUrl') || '/profile/dashboard';
            sessionStorage.removeItem('msReturnUrl');

            const res = await postLinkMicrosoft(idToken);
            if (res.status === 200) {
                window.location.hash = '';
                window.location.href = returnUrl;
            } else {
                setError(true);
            }
        }

        processRedirect();
    }, []);

    return (
        <PageWrapper>
            <TitleMeta title="Linking UNT Account" path="/auth/unt-callback" />
            <RobotBlockMeta />
            <Loading error={error}>
                {error
                    ? 'Failed to link UNT account. Please try again from the dashboard.'
                    : 'Processing UNT account link...'}
            </Loading>
        </PageWrapper>
    );
};

export default UntCallback;
