import React, { useState } from 'react';
import type { Control, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import LinkInputList from './link-input-list';
import TrashCan from './trash-can';
import ControlledTextField from '../shared/controlled-text-field';

interface EditCommitteeProps {
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
    committee: Committee;
}

/**
 * Displays a card with all fields to edit a committee
 */
const EditCommitttee = (props: EditCommitteeProps) => {
    const namePrefix = `committees.${props.index}.`;
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrashCan
                        label="Committee"
                        onClick={deleteMe}
                        sx={{
                            height: { lg: 48, xs: 36 },
                            width: { lg: 48, xs: 36 },
                            marginTop: { lg: 0.25, xs: 1.25 },
                        }}
                    />
                    <ControlledTextField
                        control={props.control}
                        setValue={props.setValue}
                        value={props.committee.name}
                        label="Committee Name"
                        name={`${namePrefix}name`}
                        variant="outlined"
                        required
                        errorMessage="Please enter a name"
                        sx={{ flexGrow: 1, marginLeft: { lg: 2, xs: 0.5 } }}
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
                    area
                    sx={{ width: '100%' }}
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
