import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import { openPopup } from '../../redux/actions';
import { getParams, redirect } from '../../functions/util';
import { Filters, Volunteering } from '../../functions/entries';
import { getVolunteering, postVolunteering } from '../../functions/api';

import { Controller } from 'react-hook-form';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ControlledTextField from './util/controlled-text-field';
import UploadBackdrop from './util/upload-backdrop';
import Loading from '../shared/loading';
import TwoButtonBox from './util/two-button-box';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        fontSize: '3rem',
    },
    form: {
        padding: 24,
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
    check: {
        alignSelf: 'flex-start',
        [theme.breakpoints.up('md')]: {
            marginLeft: 8,
            marginTop: 6,
        },
    },
    spacer: {
        width: 20,
        [theme.breakpoints.down('sm')]: {
            height: 16,
        },
    },
    submit: {
        margin: 'auto',
        display: 'block',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    uploading: {
        marginRight: 12,
    },
}));

const EditVolunteering = () => {
    const [id, setId] = useState(null);
    const [volunteering, setVolunteering] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm();

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

    const onSubmit = async (data) => {
        const cookies = new Cookies();
        if (id === null) {
            const newVolunteering = new Volunteering(
                null,
                data.name,
                data.club,
                data.description || '',
                new Filters(
                    data.limited || false,
                    data.semester || false,
                    data.setTimes || false,
                    data.weekly || false,
                    data.open || false
                )
            );

            setBackdrop(true);
            const res = await postVolunteering(newVolunteering);
            setBackdrop(false);

            if (res.status === 200) {
                redirect('/');
                cookies.set('success', 'add-volunteering', { sameSite: 'strict', path: '/' });
            } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
        }
    };

    const onCancel = () => {
        redirect(`/volunteering${id ? `?id=${id}` : ''}`);
    };

    return volunteering === null ? (
        <Loading />
    ) : (
        <React.Fragment>
            <UploadBackdrop open={backdrop} />
            <Typography variant="h1" className={classes.title}>
                {id ? 'Edit Volunteering' : 'Add Volunteering'}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <Box className={classes.boxWrapper}>
                    <Controller
                        control={control}
                        name="open"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormControlLabel
                                label="Open"
                                labelPlacement="start"
                                control={<Switch color="primary" value={value} onChange={onChange} onBlur={onBlur} />}
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
                <Controller
                    control={control}
                    name="limited"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <FormControlLabel
                            control={<Checkbox onChange={onChange} onBlur={onBlur} checked={value} />}
                            label="Limited Slots"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="semester"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <FormControlLabel
                            control={<Checkbox onChange={onChange} onBlur={onBlur} checked={value} />}
                            label="Semester Long Committment"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="setTimes"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <FormControlLabel
                            control={<Checkbox onChange={onChange} onBlur={onBlur} checked={value} />}
                            label="Set Time Slots"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="weekly"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <FormControlLabel
                            control={<Checkbox onChange={onChange} onBlur={onBlur} checked={value} />}
                            label="Weekly Volunteering"
                        />
                    )}
                />
                <ControlledTextField
                    control={control}
                    setValue={setValue}
                    value={event.description}
                    label="Description (optional)"
                    name="description"
                    variant="outlined"
                    area
                />
                <TwoButtonBox success="Submit" onCancel={onCancel} onSubmit={onSubmit} submit right />
            </form>
        </React.Fragment>
    );
};

export default EditVolunteering;
