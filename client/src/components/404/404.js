import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
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

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: 24,
    },
    title: {
        fontSize: '10rem',
        fontWeight: 100,
        color: darkSwitchGrey(theme),
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: '1.5rem',
    },
    listWrapper: {
        width: '50%',
        [theme.breakpoints.down('lg')]: {
            width: '100%',
        },
    },
}));

const PageNotFound = () => {
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        if (window.location.pathname !== '/pagenotfound') history.push('/pagenotfound');
    }, []);

    return (
        <Container className={classes.root}>
            <Paper>
                <Typography variant="h1" className={classes.title}>
                    404
                </Typography>
                <Typography className={classes.text}>
                    The page you are trying to access could not be found :(
                </Typography>
                <Typography className={classes.text}>But here are some cool pages that you could go to!</Typography>
                <Container className={classes.listWrapper}>
                    <List>
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
