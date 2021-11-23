import React from 'react';
import { Link } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { darkSwitchGrey } from '../../functions/util';
import { Committee } from '../../functions/entries';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Paragraph from '../shared/paragraph';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 8,
        marginTop: 0,
        padding: 8,
    },
    name: {
        fontSize: '1.75rem',
        lineHeight: 1.1,
        marginBottom: 4,
    },
    description: {
        color: darkSwitchGrey(theme),
    },
    link: {
        display: 'block',
        width: 'max-content',
    },
}));

/**
 * Displays the information for a club's committee
 *
 * @param {object} props React props object
 * @param {Committee} props.committee The committee to display
 * @returns
 */
const CommitteeCard = (props) => {
    const classes = useStyles();
    return (
        <Card elevation={3} className={classes.root}>
            <Typography variant="h2" className={classes.name}>
                {props.committee.name}
            </Typography>
            <Paragraph text={props.committee.description} className={classes.description} />
            {props.committee.links.map((l) => (
                <Link href={l} className={classes.link} key={l} target="_blank">
                    {l}
                </Link>
            ))}
        </Card>
    );
};

export default CommitteeCard;
