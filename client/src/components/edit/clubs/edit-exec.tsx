import React, { useEffect, useState } from 'react';
import type { Control, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ImageUpload from './image-upload';
import TrashCan from './trash-can';
import ControlledTextField from '../shared/controlled-text-field';

interface EditExecProps {
    /** React hook form controller */
    control: Control<FieldValues, object>;

    /** React hook form register function */
    register: UseFormRegister<FieldValues>;

    /** React hook form set value function */
    setValue: UseFormSetValue<FieldValues>;

    /** State variable storing the profile pics array */
    profilePics: Blob[];

    /** State function to set profile pics array */
    setProfilePics: Function;

    /** React hook form error state */
    errors: object;

    /** Index of the link in the array */
    index: number;

    /** Default committee info */
    exec: Exec;
}

/**
 * Displays a card with all fields to edit an exec
 */
const EditExec = (props: EditExecProps) => {
    const namePrefix = `execs.${props.index}.`;
    const [deleted, setDeleted] = useState(false);

    // Register image and deleted fields on form controller
    props.register(`${namePrefix}deleted`);
    props.register(`${namePrefix}img`);

    // If exec values already exist, pass them in and load it into the form
    useEffect(() => {
        if (props.exec) {
            props.setValue(`${namePrefix}img`, props.exec.img);
        }
    }, [props.exec]);

    // Delete the current exec, which simply hides this component
    const deleteMe = () => {
        // TODO: Make this undoable
        props.setValue(`${namePrefix}name`, 'deleted');
        props.setValue(`${namePrefix}position`, 'deleted');
        props.setValue(`${namePrefix}deleted`, true);
        setDeleted(true);
    };

    // Update the profile picture of the exec that was changed
    // by replacing that exec's image in the array
    const setExecImage = (value: Blob) => {
        const newProfilePics = [
            ...props.profilePics.slice(0, props.index),
            value,
            ...props.profilePics.slice(props.index + 1),
        ];
        props.setProfilePics(newProfilePics);
    };

    return (
        <ListItem sx={{ display: deleted ? 'none' : 'flex' }}>
            <Card elevation={3} sx={{ width: '100%', padding: { lg: 3, xs: 1 } }}>
                <Box
                    sx={{
                        marginBottom: 2,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: { lg: 'row', xs: 'column' },
                    }}
                >
                    <Box
                        sx={{
                            marginBottom: { lg: 0, xs: 2 },
                            width: { lg: 'unset', xs: '100%' },
                            display: 'flex',
                            flexGrow: 7,
                        }}
                    >
                        <TrashCan
                            label="Exec"
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
                            value={props.exec.name}
                            label="Exec Name"
                            name={`${namePrefix}name`}
                            variant="outlined"
                            required
                            errorMessage="Please enter a name"
                            sx={{ flexGrow: 1, marginLeft: { lg: 2, xs: 0.5 } }}
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
                        sx={{ flexGrow: 4, marginLeft: { lg: 2, xs: 0 }, width: { lg: 'unset', xs: '100%' } }}
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
                    maxSize={5}
                />
            </Card>
        </ListItem>
    );
};

export default EditExec;
