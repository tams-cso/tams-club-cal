import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core';
import { getParams } from '../../functions/util';
import { useForm } from 'react-hook-form';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DateTimeInput from './date-time-input';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        fontSize: '3rem',
    },
    form: {
        padding: 24,
    },
    field: {
        width: '100%',
        marginBottom: 16,
    },
    dateBox: {
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
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
}));

const EditEvents = () => {
    const [id, setId] = useState(null);
    const location = useLocation();
    const classes = useStyles();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        control,
        watch,
    } = useForm();
    const watchStart = watch('start');
    const watchEnd = watch('end');

    useEffect(() => {
        // Extract ID from url search params
        const id = getParams('id');

        // Set the ID state variable
        if (id === null) setId('');
        else setId(id);
    }, [location]);

    useEffect(() => {
        if (watchEnd === undefined) return;
        if (watchEnd.isBefore(watchStart)) setError('end');
        else clearErrors('end');
    }, [watchStart, watchEnd]);

    const onSubmit = async (data) => {
        console.log(data);
    };

    return (
        <React.Fragment>
            <Typography variant="h1" className={classes.title}>
                Edit Event
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <TextField
                    {...register('name', { required: true })}
                    label="Event Name"
                    variant="outlined"
                    defaultValue=""
                    error={errors.name !== undefined}
                    helperText={errors.name ? 'Please enter a name' : null}
                    className={classes.field}
                />
                <TextField
                    {...register('club', { required: true })}
                    label="Club"
                    variant="outlined"
                    defaultValue=""
                    error={errors.club !== undefined}
                    helperText={errors.club ? 'Please enter a name' : null}
                    className={classes.field}
                />
                <Box className={classes.dateBox}>
                    <DateTimeInput name="start" label="Start date/time" control={control} required={true} />
                    <div className={classes.spacer} />
                    <DateTimeInput name="end" label="End date/time" control={control} required={true} />
                </Box>
                <TextField
                    {...register('description', { required: false })}
                    label="Description (optional)"
                    variant="outlined"
                    multiline
                    rows={4}
                    defaultValue=""
                    className={classes.field}
                />
                <Button type="submit" variant="outlined" color="primary" className={classes.submit}>
                    Submit
                </Button>
            </form>
        </React.Fragment>
    );
};

export default EditEvents;
