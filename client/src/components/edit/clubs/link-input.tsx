import React, { useEffect, useState } from 'react';
import type { Control, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import ListItem from '@mui/material/ListItem';
import TrashCan from './trash-can';
import ControlledTextField from '../shared/controlled-text-field';

interface LinkInputProps {
    /** React hook form controller */
    control: Control<FieldValues, object>;

    /** React hook form register function */
    register: UseFormRegister<FieldValues>;

    /** React hook form set value function */
    setValue: UseFormSetValue<FieldValues>;

    /** String name of the field */
    name: string;

    /** String name of the label */
    label: string;

    /** Index of the link in the array */
    index: number;

    /** Default value of the link */
    link: string;
}

/**
 * Displays an input for a single link
 */
const LinkInput = (props: LinkInputProps) => {
    const name = `${props.name}.${props.index}.value`;
    const [deleted, setDeleted] = useState(false);

    // If a link is passed in, set that value to the controller
    useEffect(() => {
        props.setValue(name, props.link);
    }, [props.link]);

    // Register the deleted prop with the form controller
    props.register(`${props.name}.${props.index}.deleted`);

    // Delete a prop by setting the deleted prop to true
    // TODO: Show popup for deleted and allow user to undo this action!!
    const deleteLink = () => {
        props.setValue(`${props.name}.${props.index}.deleted`, true);
        setDeleted(true);
    };

    return (
        <ListItem sx={{ display: deleted ? 'none' : 'flex', flexDirection: 'row' }}>
            <ControlledTextField
                control={props.control}
                setValue={props.setValue}
                value={props.link}
                label={props.label}
                name={name}
                sx={{ flexGrow: 1 }}
            />
            <TrashCan label={props.label} onClick={deleteLink} />
        </ListItem>
    );
};

export default LinkInput;
