import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import { getParams, createPopupEvent, createVolunteering, createFilters } from '../../../src/util';
import type { Filters, PopupEvent, Volunteering } from '../../../src/types';
import { getVolunteering, postVolunteering, putVolunteering } from '../../../src/api';

import { Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Hidden from '@mui/material/Hidden';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ControlledTextField from '../../../src/components/edit/shared/controlled-text-field';
import UploadBackdrop from '../../../src/components/edit/shared/upload-backdrop';
import Loading from '../../../src/components/shared/loading';
import TwoButtonBox from '../../../src/components/shared/two-button-box';
import ControlledFilterCheckbox from '../../../src/components/edit/volunteering/controlled-filter-checkbox';
import AddButton from '../../../src/components/shared/add-button';
import Title from '../../../src/components/shared/title';
import FormWrapper from '../../../src/components/edit/shared/form-wrapper';
import Spacer from '../../../src/components/shared/spacer';
import Popup from '../../../src/components/shared/popup';
import EditWrapper from '../../../src/components/edit/shared/edit-wrapper';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const id = ctx.params.id as string;
    if (!id) return { props: { volunteering: createVolunteering(), id: null, error: false } };
    const volRes = await getVolunteering(id);
    const error = volRes.status !== 200;
    const volunteering = error ? createVolunteering() : volRes.data;
    return {
        props: { volunteering, error, id: error ? null : id },
    };
};

/**
 * Main form for editing and adding volunteering
 */
const EditVolunteering = ({ volunteering, id, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [backdrop, setBackdrop] = useState(false);
    const [popupEvent, setPopupEvent] = useState<PopupEvent>(null);
    const { handleSubmit, control, setValue } = useForm();

    // When the user submits the form, either create or update the volunteering opportunity
    const onSubmit = async (data) => {
        // If the name is empty, do nothing
        if (!('name' in data)) return;

        // Create the volunteering object from the data
        const newVolunteering = createVolunteering(
            id,
            data.name,
            data.club,
            data.description,
            createFilters(data.limited, data.semester, data.setTimes, data.weekly, data.open),
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
        } else setPopupEvent(createPopupEvent('Unable to upload data. Please refresh the page or try again.', 4));
    };

    // Returns the user back to the volunteering display page
    const back = () => {
        router.push(`/volunteering${id ? `/${id}` : ''}`);
    };

    // On load
    useEffect(() => {
        // Send error if can't fetch resource
        if (error) {
            setPopupEvent(
                createPopupEvent('Error fetching volunteering info. Please refresh the page or add a new event.', 4)
            );
        }

        // When the volunteering data is loaded, set the open value to the controller as a seperate variable
        setValue('open', volunteering.filters.open);
    }, []);

    return (
        <EditWrapper>
            <Title title={`${id ? 'Edit' : 'Add'} Volunteering`} />
            <UploadBackdrop open={backdrop} />
            <Popup event={popupEvent} />
            <Typography variant="h1" sx={{ textAlign: 'center', fontSize: '3rem' }}>
                {id ? 'Edit Volunteering' : 'Add Volunteering'}
            </Typography>
            {id ? <AddButton editHistory path={`/edit/history/volunteering/${id}`} /> : null}
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
        </EditWrapper>
    );
};

export default EditVolunteering;
