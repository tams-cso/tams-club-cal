import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormGroup, makeStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import { openPopup } from '../../redux/actions';
import { dateToMillis, getParams, redirect } from '../../functions/util';
import { Club, Committee, Event } from '../../functions/entries';
import { getClub, postEvent } from '../../functions/api';

import { Controller } from 'react-hook-form';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DateTimeInput from './util/date-time-input';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import UploadBackdrop from '../shared/upload-backdrop';
import LinkInputList from './util/link-input-list';
import EditCommitteeList from './club-utils/edit-committee-list';
import ControlledTextField from './util/controlled-text-field';
import Loading from '../shared/loading';
import ControlledSelect from './util/controlled-select';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        fontSize: '3rem',
    },
    subtitle: {
        paddingTop: 24,
        textAlign: 'center',
        fontSize: '2rem',
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
    type: {
        height: 56,
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
    grow: {
        flexGrow: 1,
    },
    area: {
        width: '100%',
    },
    submit: {
        margin: 'auto',
        display: 'block',
    },
}));

const EditClubs = () => {
    const [id, setId] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const [club, setClub] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm();
    const text = watch('name');

    useEffect(async () => {
        // Extract ID from url search params
        const id = getParams('id');

        // Set the ID state variable
        if (id !== null) {
            const currClub = await getClub(id);
            if (currClub.status === 200) {
                setId(id);
                setClub(currClub.data);
            } else openPopup('Error fetching club info. Please refresh the page or add a new club.', 4);
        } else setClub(new Club());
    }, []);

    useEffect(() => {
        if (club === null) return;
        setValue('advised', club.advised ? 'advised' : 'independent');
    }, [club]);

    const onSubmit = async (data) => {
        console.log(data);
        const cookies = new Cookies();
        if (id === null) {
            const newClub = new Club();
            return;
            setBackdrop(true);
            const res = await postEvent(newEvent);
            setBackdrop(false);

            if (res.status === 200) {
                redirect('/');
                cookies.set('success', 'add-event', { sameSite: 'strict', path: '/' });
            } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
        }
    };

    return club === null ? (
        <Loading />
    ) : (
        <React.Fragment>
            <UploadBackdrop open={backdrop} />
            <Typography variant="h1" className={classes.title}>
                {id ? 'Edit Club' : 'Add Club'}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <Box className={classes.boxWrapper}>
                    <ControlledSelect
                        control={control}
                        setValue={setValue}
                        value={club.advised ? 'advised' : 'independent'}
                        name="advised"
                        variant="outlined"
                        className={classes.type}
                    >
                        <MenuItem value="advised">Advised</MenuItem>
                        <MenuItem value="independent">Independent</MenuItem>
                    </ControlledSelect>
                    <div className={classes.spacer} />
                    <ControlledTextField
                        control={control}
                        setValue={setValue}
                        value={club.name}
                        label="Club Name"
                        name="name"
                        variant="outlined"
                        required
                        errorMessage="Please enter a name"
                        className={classes.grow}
                    />
                </Box>
                <ControlledTextField
                    control={control}
                    setValue={setValue}
                    value={club.description}
                    label="Description (optional)"
                    name="description"
                    variant="outlined"
                    multiline
                    rows={4}
                    className={classes.area}
                />
                <LinkInputList
                    control={control}
                    register={register}
                    setValue={setValue}
                    name="links"
                    label="Link (start with http/https)"
                    links={club.links}
                />
                <Typography variant="h2" className={classes.subtitle}>
                    Committees
                </Typography>
                <EditCommitteeList
                    control={control}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    committeeList={club ? club.committees : null}
                />
                <Button type="submit" variant="outlined" color="primary" className={classes.submit}>
                    Submit
                </Button>
            </form>
        </React.Fragment>
    );
};

export default EditClubs;
