import React from 'react';
import type { NextPage } from 'next';
import { darkSwitchGrey } from '../src/util/cssUtil';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import Link from '../src/components/shared/Link';

// Style the subtitle text
const textStyle = { textAlign: 'center', fontSize: '1.5rem' };

/**
 * 404 page for when the user tries to access a page that doesn't exist
 */
const PageNotFound: NextPage = () => {
    return (
        <Container sx={{ paddingTop: { md: 12, xs: 2 } }}>
            <Paper sx={{ py: 3 }}>
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
                        <ListItemButton component={Link} href="/">
                            <ListItemIcon>
                                <HomeRoundedIcon />
                            </ListItemIcon>
                            <ListItemText>Home - See upcoming events and helpful external resources</ListItemText>
                        </ListItemButton>
                        <ListItemButton component={Link} href="/clubs">
                            <ListItemIcon>
                                <AppsRoundedIcon />
                            </ListItemIcon>
                            <ListItemText>
                                Clubs - List of all the student organizations, both advised and independent
                            </ListItemText>
                        </ListItemButton>
                        <ListItemButton component={Link} href="/volunteering">
                            <ListItemIcon>
                                <EmojiPeopleRoundedIcon />
                            </ListItemIcon>
                            <ListItemText>
                                Volunteering - Information about all the volunteering opportunities our clubs provide
                            </ListItemText>
                        </ListItemButton>
                        <ListItemButton component={Link} href="/about">
                            <ListItemIcon>
                                <InfoRoundedIcon />
                            </ListItemIcon>
                            <ListItemText>
                                About - Learn about the history and creators behind tams.club, as well as leave us some
                                feedback!
                            </ListItemText>
                        </ListItemButton>
                    </List>
                </Container>
            </Paper>
        </Container>
    );
};

export default PageNotFound;
