import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openConnectionErrorPopup, openPopup } from '../../redux/actions';
import { getLoggedIn, getUserInfo, getIsAdmin } from '../../functions/api';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


/**
 * User dashboard page that displays the user's profile information,
 * along with their personal edit history.
 */
const Dashboard = () => {
    const [info, setInfo] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    // Redirect the user to the admin page
    const toAdmin = () => history.push('/profile/admin');

    useEffect(async () => {
        // Verify that the token is valid and
        // get the user info from the saved token
        const cookies = new Cookies();
        const token = cookies.get('token');
        if (token !== undefined) {
            const res = await getLoggedIn(token);
            if (res.status === 200 && res.data.loggedIn) {
                // Token is valid, get user info
                const userRes = await getUserInfo(token);
                if (userRes.status === 200) {
                    // Show the info to the user!
                    setInfo(userRes.data);

                    // Check to see if user is an admin and show button if so
                    const adminRes = await getIsAdmin(token);
                    if (adminRes && adminRes.data.admin) setIsAdmin(true);
                } else {
                    // Show error if cannot get the user's info
                    dispatch(openConnectionErrorPopup());
                }
                return;
            }
        }

        // If the token cannot be verified, redirect to the login page
        dispatch(
            openPopup('You must be logged in to view this page. Redirecting to the login page in 3 seconds...', 4)
        );
    }, []);

    return (
        <Card>
            <CardContent>
                <Typography variant="h2" component="h1">
                    User Information
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{info ? info.name : 'Loading...'}</TableCell>
                                <TableCell>{info ? info.email : 'Loading...'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {isAdmin ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                        <Button onClick={toAdmin}>Go to Admin Dashboard</Button>
                    </Box>
                ) : null}
            </CardContent>
        </Card>
    );
};

export default Dashboard;
