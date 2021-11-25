import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openPopup } from '../../../redux/actions';
import { Exec } from '../../../functions/entries';
import EditExec from './edit-exec';

import List from '@mui/material/List';
import Button from '@mui/material/Button';

/**
 * Displays the list of EditExec components.
 * This component also supports adding more execs.
 *
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

    // On mount and new exec creation, re-render the list of EditExec components
    useEffect(() => {
        // If the exec list is null, do nothing
        if (!props.execList) return;
        
        // Map the list of execs and added list of execs to EditExec components
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

    // Adds new execs to the list; this will cap at 20 execs and return an error
    // TODO: Ideally this limit will not be hit, but this does not consider deleted execs and may cap earlier than expected if the user has deleted a lot of execs before adding new ones
    const addItem = () => {
        // Checks to see if the limit has been hit and returns an error if it has
        if (props.profilePics.length >= 20) {
            dispatch(
                openPopup(
                    'This program does not support adding more than 20 execs. Please remove execs or reload the page.',
                    3
                )
            );
            return;
        }

        // Add the new exec to the list
        setAddedList([...addedList, new Exec()]);
        props.setProfilePics([...props.profilePics, null]);
    };

    return (
        <React.Fragment>
            <List>{listItems}</List>
            <Button color="secondary" onClick={addItem} sx={{ margin: '6px auto 24px', display: 'block' }}>
                Add Exec
            </Button>
        </React.Fragment>
    );
};

export default EditExecList;
