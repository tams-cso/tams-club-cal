import React, { useEffect, useState } from 'react';
import type { Control, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { createCommittee } from '../../../util/constructors';

import List from '@mui/material/List';
import Button from '@mui/material/Button';
import EditCommitttee from './edit-committee';

interface EditCommitteeListProps {
    /** React hook form controller */
    control: Control<FieldValues, object>;

    /** React hook form register function */
    register: UseFormRegister<FieldValues>;

    /** React hook form set value function */
    setValue: UseFormSetValue<FieldValues>;

    /** React hook form error state */
    errors: object;

    /** List of links or empty array. The component will not render if null */
    committeeList: Committee[];
}

/**
 * Displays the list of EditCommittee components.
 * This component also supports adding more committees.
 */
const EditCommitteeList = (props: EditCommitteeListProps) => {
    const [listItems, setListItems] = useState([]);
    const [addedList, setAddedList] = useState([]);

    // On mount and new exec creation, re-render the list of EditCommittee components
    useEffect(() => {
        // If the committee list is null, do nothing
        if (!props.committeeList) return;

        // Map the list of committees and added list of committees to EditCommittee components
        setListItems(
            [...props.committeeList, ...addedList].map((c, i) => (
                <EditCommitttee
                    control={props.control}
                    register={props.register}
                    setValue={props.setValue}
                    errors={props.errors}
                    index={i}
                    key={i}
                    committee={c}
                />
            ))
        );
    }, [props, addedList]);

    // Add the new committee to the list
    const addItem = () => {
        setAddedList([...addedList, createCommittee()]);
    };

    return (
        <React.Fragment>
            <List>{listItems}</List>
            <Button color="secondary" onClick={addItem} sx={{ margin: '6px auto 24px', display: 'block' }}>
                Add Committee
            </Button>
        </React.Fragment>
    );
};

export default EditCommitteeList;
