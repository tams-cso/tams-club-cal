import React, { useEffect, useState } from 'react';

import ListItem from '@mui/material/ListItem';
import TrashCan from './trash-can';
import ControlledTextField from '../shared/controlled-text-field';

/**
 * Displays an input for a single link
 *
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {Function} props.register React hook form register function
 * @param {Function} props.setValue React hook form set value function
 * @param {string} props.name String name of the field
 * @param {string} props.label String name of the label
 * @param {number} props.index Index of the link in the array
 * @param {string} props.link Default value of the link
 */
const LinkInput = (props) => {
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
