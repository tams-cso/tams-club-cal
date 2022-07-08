import React, { useEffect, useState } from 'react';
import type { Control, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { createExec, createPopupEvent } from '../../../util/constructors';

import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Popup from '../../shared/popup';
import EditExec from './edit-exec';

interface EditExecListProps {
    /** React hook form controller */
    control: Control<FieldValues, object>;

    /** React hook form register function */
    register: UseFormRegister<FieldValues>;

    /** React hook form set value function */
    setValue: UseFormSetValue<FieldValues>;

    /** React hook form error state */
    errors: object;

    /** State variable storing the profile pics array */
    profilePics: Blob[];

    /** State function to set profile pics array */
    setProfilePics: Function;

    /** List of execs or empty array. The component will not render if null */
    execList: Exec[];
}

/**
 * Displays the list of EditExec components.
 * This component also supports adding more execs.
 */
const EditExecList = (props: EditExecListProps) => {
    const [listItems, setListItems] = useState([]);
    const [addedList, setAddedList] = useState([]);
    const [popupEvent, setPopupEvent] = useState(null);

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
            setPopupEvent(
                createPopupEvent(
                    'This program does not support adding more than 20 execs. Please remove execs or reload the page.',
                    3
                )
            );
            return;
        }

        // Add the new exec to the list
        setAddedList([...addedList, createExec()]);
        props.setProfilePics([...props.profilePics, null]);
    };

    return (
        <React.Fragment>
            <List>{listItems}</List>
            <Popup event={popupEvent} />
            <Button color="secondary" onClick={addItem} sx={{ margin: '6px auto 24px', display: 'block' }}>
                Add Exec
            </Button>
        </React.Fragment>
    );
};

export default EditExecList;
