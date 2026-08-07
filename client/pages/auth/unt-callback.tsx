import React, { useEffect, useState } from 'react';
import PageWrapper from '../../src/components/shared/page-wrapper';
import Loading from '../../src/components/shared/loading';
import TitleMeta from '../../src/components/meta/title-meta';
import RobotBlockMeta from '../../src/components/meta/robot-block-meta';
import { postLinkMicrosoft } from '../../src/api';

const UntCallback = () => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function processRedirect() {
            const hash = window.location.hash.substring(1);
            if (!hash) {
                setErrorMsg('Missing OAuth response from Microsoft. Please try again from the dashboard.');
                return;
            }

            const params = new URLSearchParams(hash);
            const idToken = params.get('id_token');
            const state = params.get('state');
            const errDesc = params.get('error_description') || params.get('error');

            if (errDesc) {
                setErrorMsg(errDesc);
                return;
            }

            if (!idToken) {
                setErrorMsg('Missing ID token from Microsoft. Please try again from the dashboard.');
                return;
            }

            const returnUrl = sessionStorage.getItem('msReturnUrl') || '/profile/dashboard';
            sessionStorage.removeItem('msReturnUrl');

            const res = await postLinkMicrosoft(idToken, state);
            if (res.status === 200) {
                window.location.hash = '';
                window.location.href = returnUrl;
            } else {
                const serverError = (res.data as { error?: string })?.error;
                setErrorMsg(serverError || 'Failed to link UNT account. Please try again from the dashboard.');
            }
        }

        processRedirect();
    }, []);

    return (
        <PageWrapper>
            <TitleMeta title="Linking UNT Account" path="/auth/unt-callback" />
            <RobotBlockMeta />
            <Loading error={!!errorMsg}>{errorMsg || 'Processing UNT account link...'}</Loading>
        </PageWrapper>
    );
};

export default UntCallback;
