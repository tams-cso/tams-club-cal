import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Committee } from '../../../functions/entries';

import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import TrashCan from '../util/trash-can';
import ControlledTextField from '../util/controlled-text-field';
import ImageUpload from './image-upload';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: 24,
        [theme.breakpoints.down('sm')]: {
            padding: 6,
        },
    },
    titleWrapper: {
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    nameWrapper: {
        display: 'flex',
        flexGrow: 7,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginBottom: 12,
        },
    },
    name: {
        flexGrow: 1,
        [theme.breakpoints.up('md')]: {
            marginLeft: 16,
        },
    },
    position: {
        flexGrow: 4,
        marginLeft: 12,
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0,
            width: '100%',
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
 * @param {Blob[]} props.profilePics State variable storing the profile pics array
 * @param {Function} props.setProfilePics State function to set profile pics array
 * @param {object} props.errors React hook form error state
 * @param {number} props.index Index of the link in the array
 * @param {Committee} props.committee Default committee info
 */
const EditExec = (props) => {
    const namePrefix = `execs.${props.index}.`;
    const [deleted, setDeleted] = useState(false);
    const classes = useStyles();

    props.register(`${namePrefix}deleted`);

    const deleteMe = () => {
        props.setValue(`${namePrefix}name`, 'deleted');
        props.setValue(`${namePrefix}position`, 'deleted');
        props.setValue(`${namePrefix}deleted`, true);
        setDeleted(true);
    };

    const setExecImage = (value) => {
        const newProfilePics = [
            ...props.profilePics.slice(0, props.index),
            value,
            ...props.profilePics.slice(props.index + 1),
        ];
        props.setProfilePics(newProfilePics);
    };

    return (
        <ListItem className={deleted ? classes.hidden : null}>
            <Card elevation={3} className={classes.root}>
                <Box className={classes.titleWrapper}>
                    <Box className={classes.nameWrapper}>
                        <TrashCan label="Exec" onClick={deleteMe} className={classes.trash} />
                        <ControlledTextField
                            control={props.control}
                            setValue={props.setValue}
                            value={props.exec.name}
                            label="Exec Name"
                            name={`${namePrefix}name`}
                            variant="outlined"
                            required
                            errorMessage="Please enter a name"
                            className={classes.name}
                        />
                    </Box>
                    <ControlledTextField
                        control={props.control}
                        setValue={props.setValue}
                        value={props.exec.position}
                        label="Exec Position"
                        name={`${namePrefix}position`}
                        variant="outlined"
                        required
                        errorMessage="Please enter a position"
                        className={classes.position}
                    />
                </Box>
                <ControlledTextField
                    control={props.control}
                    setValue={props.setValue}
                    value={props.exec.description}
                    label="Biography/description (optional)"
                    name={`${namePrefix}description`}
                    variant="outlined"
                    fullWidth
                    area
                />
                <ImageUpload
                    setValue={setExecImage}
                    src={props.exec.img}
                    default="/default-profile.webp"
                    alt="profile picture"
                    width={100}
                    height={100}
                    aspect={1}
                />
            </Card>
        </ListItem>
    );
};

export default EditExec;
