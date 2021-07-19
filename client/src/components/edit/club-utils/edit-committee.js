import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Committee } from '../../../functions/entries';

import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import LinkInputList from '../util/link-input-list';
import TrashCan from '../util/trash-can';
import ControlledTextField from '../util/controlled-text-field';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: 24,
        [theme.breakpoints.down('sm')]: {
            padding: 6,
        },
    },
    titleWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    name: {
        flexGrow: 1,
        [theme.breakpoints.up('sm')]: {
            marginLeft: 16,
        },
    },
    hidden: {
        display: 'none',
    },
    trash: {
        height: 48,
    },
    area: {
        width: '100%',
    },
}));

/**
 * Displays a card with all fields to edit a committee
 *
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {Function} props.register React hook form register function
 * @param {Function} props.setValue React hook form set value function
 * @param {object} props.errors React hook form error state
 * @param {number} props.index Index of the link in the array
 * @param {Committee} props.committee Default committee info
 */
const EditCommitttee = (props) => {
    const namePrefix = `committees.${props.index}.`;
    const [deleted, setDeleted] = useState(false);
    const classes = useStyles();

    props.register(`${namePrefix}deleted`);

    const deleteMe = () => {
        props.setValue(`${namePrefix}name`, 'deleted');
        props.setValue(`${namePrefix}deleted`, true);
        setDeleted(true);
    };

    return (
        <ListItem className={deleted ? classes.hidden : null}>
            <Card elevation={3} className={classes.root}>
                <Box className={classes.titleWrapper}>
                    <TrashCan label="Committee" onClick={deleteMe} className={classes.trash} />
                    <ControlledTextField
                        control={props.control}
                        setValue={props.setValue}
                        value={props.committee.name}
                        label="Committee Name"
                        name={`${namePrefix}name`}
                        variant="outlined"
                        required
                        errorMessage="Please enter a name"
                        className={classes.name}
                    />
                </Box>
                <LinkInputList
                    control={props.control}
                    register={props.register}
                    setValue={props.setValue}
                    name={`${namePrefix}heads`}
                    label="Committee head"
                    links={props.committee.heads}
                />
                <ControlledTextField
                    control={props.control}
                    setValue={props.setValue}
                    value={props.committee.description}
                    label="Description (optional)"
                    name={`${namePrefix}description`}
                    variant="outlined"
                    multiline
                    rows={4}
                    className={classes.area}
                />
                <LinkInputList
                    control={props.control}
                    register={props.register}
                    setValue={props.setValue}
                    name={`${namePrefix}links`}
                    label="Link"
                    links={props.committee.links}
                />
            </Card>
        </ListItem>
    );
};

export default EditCommitttee;
