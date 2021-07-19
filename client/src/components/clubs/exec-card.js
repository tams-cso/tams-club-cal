import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { darkSwitchGrey } from '../../functions/util';
import { Exec } from '../../functions/entries';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Image from '../shared/image';
import Paragraph from '../shared/paragraph';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: 12,
        paddingTop: 0,
        display: 'flex',
        flexDirection: 'row',
    },
    image: {
        marginRight: 12,
        flexBasis: '20%',
        flexShrink: 0,
        height: 'min-content',
    },
    name: {
        fontSize: '1.75rem',
        lineHeight: 1.1,
    },
    description: {
        color: darkSwitchGrey(theme),
    },
}));

/**
 * Displays the information for an exec of a club
 *
 * @param {object} props React props object
 * @param {Exec} props.exec The exec to display
 * @returns
 */
const ExecCard = (props) => {
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <Image
                className={classes.image}
                src={props.exec.img}
                alt="profile pic"
                default="/default-profile.webp"
                raised
            ></Image>
            <Box className="exec-card-info">
                <Typography variant="h2" className={classes.name}>
                    {props.exec.name}
                </Typography>
                <Typography variant="subtitle1">
                    {props.exec.position}
                </Typography>
                <Paragraph text={props.exec.description} className={classes.description} />
            </Box>
        </Box>
    );
};

export default ExecCard;
