import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { darkSwitchGrey } from '../../functions/util';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import AppsRoundedIcon from '@material-ui/icons/AppsRounded';
import EmojiPeopleRoundedIcon from '@material-ui/icons/EmojiPeopleRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

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
        [theme.breakpoints.down('md')]: {
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
