import React from 'react';

import Alert from '@mui/material/Alert';
import { darkSwitch } from '../../../util/cssUtil';

interface UnauthorizedAlertProps {
    /** Name of the resource to show an alert about */
    resource: string;

    /** True to show this alert */
    show: boolean;

    /** Style the Alert component */
    sx?: object;
}

const UnauthorizedAlert = (props: UnauthorizedAlertProps) => {
    return (
        <Alert
            severity="error"
            sx={{
                marginTop: 3,
                mx: 3,
                backgroundColor: (theme) => darkSwitch(theme, null, '#3d2d2c'),
                display: props.show ? 'flex' : 'none',
            }}
        >
            Please log in to make edits to this {props.resource}! If you are already logged in, you may not have the
            proper access level to edit this resource.
        </Alert>
    );
};

export default UnauthorizedAlert;
