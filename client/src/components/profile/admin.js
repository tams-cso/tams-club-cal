import React from 'react';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

/**
 * Admin dashboard page -- users can only access if they are
 * logged in and have admin privileges.
 */
const Admin = () => {
    return (
        <Paper>
            <Typography variant="h2" component="h1" sx={{ textAlign: 'center', padding: 2 }}>
                Admin Dashboard
            </Typography>
        </Paper>
    );
};

export default Admin;
