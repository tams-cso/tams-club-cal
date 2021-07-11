import React from 'react';
import { Link, makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Committee } from '../../functions/entries';
import Paragraph from '../shared/paragraph';
import { darkSwitchGrey } from '../../functions/util';

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
                <Link href={l} className={classes.link} key={l}>
                    {l}
                </Link>
            ))}
        </Card>
    );
};

export default CommitteeCard;
