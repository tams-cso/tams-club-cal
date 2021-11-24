import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { darkSwitchGrey } from '../../functions/util';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

// Style the subtitle text
const textStyle = { textAlign: 'center', fontSize: '1.5rem' };

/**
 * 404 page for when the user tries to access a page that doesn't exist
 */
const PageNotFound = () => {
    const history = useHistory();

    // If the page is not the correct path, set the path to /pagenotfound
    // This will trigger when the page loads due to the fact that the path that
    // the user enters is normally not /pagenotfound and the router
    // will automatically redirect here but not change the path
    useEffect(() => {
        if (window.location.pathname !== '/pagenotfound') history.push('/pagenotfound');
    }, []);

    return (
        <Container sx={{ paddingTop: { md: 12, xs: 2 } }}>
            <Paper>
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: '10rem',
                        fontWeight: 100,
                        color: (theme) => darkSwitchGrey(theme),
                        textAlign: 'center',
                    }}
                >
                    404
                </Typography>
                <Typography sx={textStyle}>The page you are trying to access could not be found :(</Typography>
                <Typography sx={textStyle}>But here are some cool pages that you could go to!</Typography>
                <Container sx={{ width: { md: '50%', xs: '100%' } }}>
                    <List sx={{ color: (theme) => darkSwitchGrey(theme) }}>
                        <ListItem button component={Link} to="/">
                            <ListItemIcon>
                                <HomeRoundedIcon />
                            </ListItemIcon>
                            <ListItemText>Home - See upcoming events and helpful external resources</ListItemText>
                        </ListItem>
                        <ListItem button component={Link} to="/clubs">
                            <ListItemIcon>
                                <AppsRoundedIcon />
                            </ListItemIcon>
                            <ListItemText>
                                Clubs - List of all the student organizations, both advised and independent
                            </ListItemText>
                        </ListItem>
                        <ListItem button component={Link} to="/volunteering">
                            <ListItemIcon>
                                <EmojiPeopleRoundedIcon />
                            </ListItemIcon>
                            <ListItemText>
                                Volunteering - Information about all the volunteering opportunities our clubs provide
                            </ListItemText>
                        </ListItem>
                        <ListItem button component={Link} to="/about">
                            <ListItemIcon>
                                <InfoRoundedIcon />
                            </ListItemIcon>
                            <ListItemText>
                                About - Learn about the history and creators behind tams.club, as well as leave us some
                                feedback!
                            </ListItemText>
                        </ListItem>
                    </List>
                </Container>
            </Paper>
        </Container>
    );
};

export default PageNotFound;
