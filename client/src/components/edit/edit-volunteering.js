import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import { openPopup } from '../../redux/actions';
import { getParams, redirect } from '../../functions/util';
import { Filters, Volunteering } from '../../functions/entries';
import { postVolunteering } from '../../functions/api';

import { Controller } from 'react-hook-form';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import UploadBackdrop from '../shared/upload-backdrop';

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
    field: {
        width: '100%',
        marginBottom: 16,
    },
    grow: {
        flexGrow: 1,
    },
    area: {
        width: '100%',
        margin: '16px 0',
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
    const [backdrop, setBackdrop] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        // Extract ID from url search params
        const id = getParams('id');

        // Set the ID state variable
        if (id !== null) setId(id);
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

    return (
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
                    <TextField
                        {...register('name', { required: true })}
                        label="Volunteering Name"
                        variant="outlined"
                        defaultValue=""
                        error={errors.name !== undefined}
                        helperText={errors.name ? 'Please enter a name' : null}
                        className={`${classes.grow} ${classes.name}`}
                    />
                    <div className={classes.spacer} />
                    <TextField
                        {...register('club', { required: true })}
                        label="Club"
                        variant="outlined"
                        defaultValue=""
                        error={errors.club !== undefined}
                        helperText={errors.club ? 'Please enter a name' : null}
                        className={classes.grow}
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
                <TextField
                    {...register('description', { required: false })}
                    label="Description (optional)"
                    variant="outlined"
                    multiline
                    rows={4}
                    defaultValue=""
                    className={classes.area}
                />
                <Button type="submit" variant="outlined" color="primary" className={classes.submit}>
                    Submit
                </Button>
            </form>
        </React.Fragment>
    );
};

export default EditVolunteering;
