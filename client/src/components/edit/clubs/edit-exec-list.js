import React, { useEffect, useState } from 'react';
import { Exec } from '../../../functions/entries';
import EditExec from './edit-exec';

import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { openPopup } from '../../../redux/actions';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles({
    addButton: {
        display: 'block',
        margin: '6px auto 24px',
    },
});

/**
 * Displays the list of link inputs
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {Function} props.register React hook form register function
 * @param {Function} props.setValue React hook form set value function
 * @param {object} props.errors React hook form error state
 * @param {Blob[]} props.profilePics State variable storing the profile pics array
 * @param {Function} props.setProfilePics State function to set profile pics array
 * @param {Exec[]} props.execList List of execs or empty array. The component will not render if null
 */
const EditExecList = (props) => {
    const [listItems, setListItems] = useState([]);
    const [addedList, setAddedList] = useState([]);
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (!props.execList) return;
        setListItems(
            [...props.execList, ...addedList].map((e, i) => (
                <EditExec
                    control={props.control}
                    register={props.register}
                    setValue={props.setValue}
                    profilePics={props.profilePics}
                    setProfilePics={props.setProfilePics}
                    errors={props.errors}
                    index={i}
                    key={i}
                    exec={e}
                />
            ))
        );
    }, [props, addedList]);

    const addItem = () => {
        if (props.profilePics.length >= 20) {
            dispatch(
                openPopup(
                    'This program does not support adding more than 20 execs. Please remove execs or reload the page.',
                    3
                )
            );
            return;
        }
        setAddedList([...addedList, new Exec()]);
        props.setProfilePics([...props.profilePics, null]);
    };

    return (
        <React.Fragment>
            <List>{listItems}</List>
            <Button color="secondary" onClick={addItem} className={classes.addButton}>
                Add Exec
            </Button>
        </React.Fragment>
    );
};

export default EditExecList;
