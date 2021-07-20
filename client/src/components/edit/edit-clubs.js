import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import { openPopup } from '../../redux/actions';
import { getParams, processLinkObjectList, redirect } from '../../functions/util';
import { Club, ClubImageBlobs } from '../../functions/entries';
import { getClub, postClub } from '../../functions/api';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import LinkInputList from './clubs/link-input-list';
import EditCommitteeList from './clubs/edit-committee-list';
import ControlledTextField from './shared/controlled-text-field';
import ControlledSelect from './shared/controlled-select';
import Loading from '../shared/loading';
import UploadBackdrop from './shared/upload-backdrop';
import ImageUpload from './clubs/image-upload';
import EditExecList from './clubs/edit-exec-list';
import TwoButtonBox from './shared/two-button-box';

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
    subtitle: {
        paddingTop: 24,
        textAlign: 'center',
        fontSize: '2rem',
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
    spacer: {
        width: 20,
        [theme.breakpoints.down('sm')]: {
            height: 16,
        },
    },
}));

const EditClubs = () => {
    const [id, setId] = useState(null);
    const [club, setClub] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const [cover, setCover] = useState(false);
    const [profilePics, setProfilePics] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(async () => {
        // Extract ID from url search params
        const id = getParams('id');

        // Set the ID and club state variable
        if (id !== null) {
            const currClub = await getClub(id);
            if (currClub.status === 200) {
                setId(id);
                setProfilePics(Array(currClub.data.execs.length).fill(null));
                setClub(currClub.data);
            } else openPopup('Error fetching club info. Please refresh the page or add a new club.', 4);
        } else {
            setProfilePics([]);
            setClub(new Club());
        }
    }, []);

    useEffect(() => {
        if (club === null) return;
        setValue('advised', club.advised ? 'advised' : 'independent');
    }, [club]);

    const onSubmit = async (data) => {
        if (!('name' in data)) return;
        const cookies = new Cookies();

        if (id === null) {
            const { execs, execProfilePics } = data.execs
                ? processExecs(data.execs)
                : { execs: [], execProfilePics: [] };
            const filteredCommittees = data.committees ? data.committees.filter((c) => !c.deleted) : [];
            const committees = filteredCommittees.map((c) => ({
                ...c,
                links: processLinkObjectList(c.links),
            }));
            const links = processLinkObjectList(data.links);

            const newClub = new Club(
                null,
                data.name,
                data.advised === 'advised',
                links,
                data.description || '',
                null,
                null,
                execs,
                committees
            );
            const newImages = new ClubImageBlobs(cover, execProfilePics);

            setBackdrop(true);
            const res = await postClub(newClub, newImages);
            setBackdrop(false);

            if (res.status === 200) {
                redirect('/clubs');
                cookies.set('success', 'add-club', { sameSite: 'strict', path: '/' });
            } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
        }
    };

    const processExecs = (execs) => {
        const cleanedExecs = execs.map((e) => (e.deleted ? null : e));
        const outProfilePics = profilePics.filter((p, i) => cleanedExecs[i] !== null);
        const outExecs = cleanedExecs.filter((e) => e !== null);
        return { execs: outExecs, execProfilePics: outProfilePics };
    };

    const onCancel = () => {
        redirect(`/clubs${id ? `?id=${id}` : ''}`);
    };

    return club === null ? (
        <Loading flat />
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
                        grow
                        required
                        errorMessage="Please enter a name"
                    />
                </Box>
                <ControlledTextField
                    control={control}
                    setValue={setValue}
                    value={club.description}
                    label="Description (optional)"
                    name="description"
                    variant="outlined"
                    area
                />
                <ImageUpload
                    setValue={setCover}
                    src={club.coverImg}
                    default="/default-cover.webp"
                    alt="cover photo"
                    width={300}
                    height={125}
                    aspect={12 / 5}
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
                    Execs
                </Typography>
                <EditExecList
                    control={control}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    profilePics={profilePics}
                    setProfilePics={setProfilePics}
                    execList={club.execs}
                />
                <Typography variant="h2" className={classes.subtitle}>
                    Committees
                </Typography>
                <EditCommitteeList
                    control={control}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    committeeList={club.committees}
                />
                <TwoButtonBox success="Submit" onCancel={onCancel} onSuccess={onSubmit} submit right />
            </form>
        </React.Fragment>
    );
};

export default EditClubs;
