import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import { openPopup } from '../../redux/actions';
import { getParams, redirect } from '../../functions/util';
import { Filters, Volunteering } from '../../functions/entries';
import { getVolunteering, postVolunteering, putVolunteering } from '../../functions/api';

import { Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Hidden from '@mui/material/Hidden';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ControlledTextField from './shared/controlled-text-field';
import UploadBackdrop from './shared/upload-backdrop';
import Loading from '../shared/loading';
import TwoButtonBox from './shared/two-button-box';
import ControlledFilterCheckbox from './volunteering/controlled-filter-checkbox';
import AddButton from '../shared/add-button';
import Title from '../shared/title';
import FormWrapper from './shared/form-wrapper';
import Spacer from './shared/spacer';

/**
 * Main form for editing and adding volunteering
 */
const EditVolunteering = () => {
    const [id, setId] = useState(null);
    const [volunteering, setVolunteering] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const dispatch = useDispatch();
    const { handleSubmit, control, setValue } = useForm();

    // When mounted, get the ID and fetch event data
    useEffect(async () => {
        // Extract ID from url search params
        const id = getParams('id');

        // If the ID is not null, fetch the volunteering data from the backend and set the state variables
        // Otherwise, create a new volunteering and load the default data into the controller
        if (id !== null) {
            const currVolunteering = await getVolunteering(id);
            if (currVolunteering.status === 200) {
                setId(id);
                setVolunteering(currVolunteering.data);
            } else openPopup('Error fetching volunteering info. Please refresh the page or add a new event.', 4);
        } else setVolunteering(new Volunteering());
    }, []);

    // When the volunteering data is loaded, set the open value to the controller as a seperate variable
    useEffect(() => {
        if (!volunteering) return;
        setValue('open', volunteering.filters.open);
    }, [volunteering]);

    // When the user submits the form, either create or update the volunteering opportunity
    const onSubmit = async (data) => {
        // If the name is empty, do nothing
        if (!('name' in data)) return;

        // Create the volunteering object from the data
        const newVolunteering = new Volunteering(
            id,
            data.name,
            data.club,
            data.description,
            new Filters(data.limited, data.semester, data.setTimes, data.weekly, data.open),
            volunteering.history
        );

        // Start the upload process
        setBackdrop(true);

        // If the ID is null, create the volunteering, otherwise update it
        const res = id === null ? await postVolunteering(newVolunteering) : await putVolunteering(newVolunteering, id);

        // Finished uploading
        setBackdrop(false);

        // If the request was successful, redirect to the volunteering page, otherwise display an error
        if (res.status === 200) {
            new Cookies().set('success', id ? 'update-volunteering' : 'add-volunteering', {
                sameSite: 'strict',
                path: '/',
            });
            back();
        } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
    };

    // Returns the user back to the volunteering display page
    const back = () => {
        redirect(`/volunteering${id ? `?id=${id}` : ''}`);
    };

    return volunteering === null ? (
        <Loading flat />
    ) : (
        <React.Fragment>
            <Title title={`${id ? 'Edit' : 'Add'} Volunteering`} />
            <UploadBackdrop open={backdrop} />
            <Typography variant="h1" sx={{ textAlign: 'center', fontSize: '3rem' }}>
                {id ? 'Edit Volunteering' : 'Add Volunteering'}
            </Typography>
            {id ? <AddButton editHistory path={`/edit/history/volunteering?id=${id}`} /> : null}
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                {/* TODO: Make a BoxWrapper component as this css is repeated so much across all forms */}
                <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: { lg: 'row', xs: 'column' } }}>
                    <Controller
                        control={control}
                        name="open"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormControlLabel
                                label="Open"
                                labelPlacement="start"
                                control={
                                    <Switch
                                        color="primary"
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        checked={value}
                                        defaultChecked={volunteering.filters.open}
                                    />
                                }
                            />
                        )}
                    />
                    <Spacer />
                    <ControlledTextField
                        control={control}
                        setValue={setValue}
                        value={volunteering.name}
                        label="Volunteering Name"
                        name="name"
                        variant="outlined"
                        grow
                        required
                        errorMessage="Please enter a name"
                        sx={{ marginLeft: { lg: 2, xs: 0 } }}
                    />
                    <Spacer />
                    <ControlledTextField
                        control={control}
                        setValue={setValue}
                        value={volunteering.club}
                        label="Club"
                        name="club"
                        variant="outlined"
                        grow
                        required
                        errorMessage="Please enter a club name"
                    />
                </Box>
                <Hidden mdDown>
                    <Typography sx={{ display: 'inline', marginRight: { lg: 16, xs: 0 } }}>Filters:</Typography>
                </Hidden>
                <ControlledFilterCheckbox
                    control={control}
                    setValue={setValue}
                    name="limited"
                    label="Limited Slots"
                    value={volunteering.filters.limited}
                />
                <ControlledFilterCheckbox
                    control={control}
                    setValue={setValue}
                    name="semester"
                    label="Semester Long Committment"
                    value={volunteering.filters.semester}
                />
                <ControlledFilterCheckbox
                    control={control}
                    setValue={setValue}
                    name="setTimes"
                    label="Set Time Slots"
                    value={volunteering.filters.setTimes}
                />
                <ControlledFilterCheckbox
                    control={control}
                    setValue={setValue}
                    name="weekly"
                    label="Repeats Weekly"
                    value={volunteering.filters.weekly}
                />
                <ControlledTextField
                    control={control}
                    setValue={setValue}
                    value={volunteering.description}
                    label="Description (optional)"
                    name="description"
                    variant="outlined"
                    area
                    sx={{ marginTop: 2 }}
                />
                <TwoButtonBox success="Submit" onCancel={back} onSuccess={onSubmit} submit right />
            </FormWrapper>
        </React.Fragment>
    );
};

export default EditVolunteering;
