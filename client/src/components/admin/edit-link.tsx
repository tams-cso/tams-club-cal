import React, { useState } from 'react';
import type { Control, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import TrashCan from '../edit/clubs/trash-can';
import ControlledTextField from '../edit/shared/controlled-text-field';

interface EditLinkProps {
    /** React hook form controller */
    control: Control<FieldValues, object>;

    /** React hook form register function */
    register: UseFormRegister<FieldValues>;

    /** React hook form set value function */
    setValue: UseFormSetValue<FieldValues>;

    /** React hook form error state */
    errors: object;

    /** Index of the link in the array */
    index: number;

    /** Default committee info */
    link: ExternalLink;
}

/**
 * Displays a card with all fields to edit a committee
 */
const EditLink = (props: EditLinkProps) => {
    const namePrefix = `links.${props.index}.`;
    const [deleted, setDeleted] = useState(false);

    // Register the deleted attribute to the form controller
    props.register(`${namePrefix}deleted`);

    // When deleted, hide the card and set the deleted attribute to true
    const deleteMe = () => {
        props.setValue(`${namePrefix}name`, 'deleted');
        props.setValue(`${namePrefix}deleted`, true);
        setDeleted(true);
    };

    return (
        <ListItem sx={{ display: deleted ? 'none' : 'flex' }}>
            <Card elevation={3} sx={{ width: '100%', padding: { lg: 3, xs: 1 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <TrashCan
                        label="Edit Link"
                        onClick={deleteMe}
                        sx={{
                            height: { lg: 48, xs: 36 },
                            width: { lg: 48, xs: 36 },
                            marginTop: { lg: 0.25, xs: 1.25 },
                            alignSelf: 'center',
                        }}
                    />
                    <ControlledTextField
                        control={props.control}
                        setValue={props.setValue}
                        value={props.link.name}
                        label="Display Name"
                        name={`${namePrefix}name`}
                        variant="outlined"
                        required
                        errorMessage="Please enter a name"
                        sx={{ flexGrow: 1, marginLeft: { lg: 2, xs: 0.5 } }}
                    />
                    <ControlledTextField
                        control={props.control}
                        setValue={props.setValue}
                        value={props.link.icon}
                        label="Link Icon"
                        name={`${namePrefix}icon`}
                        variant="outlined"
                        required
                        errorMessage="Please enter an icon"
                        sx={{ flexGrow: 1, marginLeft: { lg: 2, xs: 0.5 } }}
                    />
                </Box>
                <ControlledTextField
                    control={props.control}
                    setValue={props.setValue}
                    value={props.link.url}
                    label="URL"
                    name={`${namePrefix}url`}
                    variant="outlined"
                    required
                    errorMessage="Please enter a URL"
                    fullWidth
                />
            </Card>
        </ListItem>
    );
};

export default EditLink;
