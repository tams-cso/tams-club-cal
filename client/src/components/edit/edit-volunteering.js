import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import { openPopup } from '../../redux/actions';
import { getParams, redirect } from '../../functions/util';
import { Filters, Volunteering } from '../../functions/entries';
import { getVolunteering, postVolunteering, putVolunteering } from '../../functions/api';

import { Controller } from 'react-hook-form';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ControlledTextField from './shared/controlled-text-field';
import UploadBackdrop from './shared/upload-backdrop';
import Loading from '../shared/loading';
import TwoButtonBox from './shared/two-button-box';
import ControlledFilterCheckbox from './volunteering/controlled-filter-checkbox';
import AddButton from '../shared/add-button';
import Title from '../shared/title';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        fontSize: '3rem',
    },
    form: {
        padding: 24,
        [theme.breakpoints.down('sm')]: {
            padding: 12,
        },
    },
    boxWrapper: {
        marginBottom: 16,
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    name: {
        [theme.breakpoints.up('md')]: {
            marginLeft: 12,
        },
    },
    filtersTitle: {
        display: 'inline',
        [theme.breakpoints.up('md')]: {
            marginRight: 16,
        },
    },
    spacer: {
        width: 20,
        [theme.breakpoints.down('sm')]: {
            height: 16,
        },
    },
    area: {
        marginTop: 12,
    },
}));

const EditVolunteering = () => {
    const [id, setId] = useState(null);
    const [volunteering, setVolunteering] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();
    const { handleSubmit, control, setValue } = useForm();

    useEffect(async () => {
        // Extract ID from url search params
        const id = getParams('id');

        // Set the ID and volunteering state variable
        if (id !== null) {
            const currVolunteering = await getVolunteering(id);
            if (currVolunteering.status === 200) {
                setId(id);
                setVolunteering(currVolunteering.data);
            } else openPopup('Error fetching volunteering info. Please refresh the page or add a new event.', 4);
        } else setVolunteering(new Volunteering());
    }, []);

    useEffect(() => {
        if (!volunteering) return;
        setValue('open', volunteering.filters.open);
    }, [volunteering]);

    const onSubmit = async (data) => {
        if (!('name' in data)) return;
        const cookies = new Cookies();

        const newVolunteering = new Volunteering(
            id,
            data.name,
            data.club,
            data.description,
            new Filters(data.limited, data.semester, data.setTimes, data.weekly, data.open === 'open'),
            volunteering.history
        );

        setBackdrop(true);
        const res = id === null ? await postVolunteering(newVolunteering) : await putVolunteering(newVolunteering, id);
        if (res.status === 200) {
            cookies.set('success', id ? 'update-volunteering' : 'add-volunteering', { sameSite: 'strict', path: '/' });
            back();
        } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
        setBackdrop(false);
    };

    const back = () => {
        redirect(`/volunteering${id ? `?id=${id}` : ''}`);
    };

    return volunteering === null ? (
        <Loading flat />
    ) : (
        <React.Fragment>
            <Title title={`${id ? 'Edit' : 'Add'} Volunteering`} />
            <UploadBackdrop open={backdrop} />
            <Typography variant="h1" className={classes.title}>
                {id ? 'Edit Volunteering' : 'Add Volunteering'}
            </Typography>
            {id ? <AddButton editHistory path={`/edit/history/volunteering?id=${id}`} /> : null}
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <Box className={classes.boxWrapper}>
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
                    <div className={classes.spacer} />
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
                        className={classes.name}
                    />
                    <div className={classes.spacer} />
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
                <Hidden smDown>
                    <Typography className={classes.filtersTitle}>Filters:</Typography>
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
                    className={classes.area}
                />
                <TwoButtonBox success="Submit" onCancel={back} onSuccess={onSubmit} submit right />
            </form>
        </React.Fragment>
    );
};

export default EditVolunteering;
