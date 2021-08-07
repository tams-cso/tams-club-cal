import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import { openPopup } from '../../redux/actions';
import { getParams, processLinkObjectList, redirect } from '../../functions/util';
import { Club, ClubImageBlobs } from '../../functions/entries';
import { getClub, postClub, putClub } from '../../functions/api';

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
import AddButton from '../shared/add-button';

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

        const { execs, execProfilePics, execPhotos } = data.execs
            ? processExecs(data.execs)
            : { execs: [], execProfilePics: [], execPhotos: [] };
        const filteredCommittees = data.committees ? data.committees.filter((c) => !c.deleted) : [];
        const committees = filteredCommittees.map((c) => ({
            ...c,
            heads: processLinkObjectList(c.heads),
            links: processLinkObjectList(c.links),
        }));
        const links = processLinkObjectList(data.links);

        const newClub = new Club(
            id,
            data.name,
            data.advised === 'advised',
            links,
            data.description,
            club.coverImgThumbnail,
            club.coverImg,
            execs,
            committees,
            club.history
        );
        const newImages = new ClubImageBlobs(cover, execProfilePics);

        setBackdrop(true);
        const res =
            id === null
                ? await postClub(newClub, newImages, execPhotos)
                : await putClub(newClub, newImages, execPhotos, id);
        setBackdrop(false);
        if (res.status === 200) {
            cookies.set('success', id ? 'update-club' : 'add-club', { sameSite: 'strict', path: '/' });
            back();
        } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
    };

    const processExecs = (execs) => {
        const cleanedExecs = execs.map((e) => (e.deleted ? null : e));
        const outProfilePics = profilePics.filter((p, i) => cleanedExecs[i] !== null);
        const outExecs = cleanedExecs.filter((e) => e !== null);
        const hasNewPicture = outProfilePics.map((p) => p !== null);
        return { execs: outExecs, execProfilePics: outProfilePics, execPhotos: hasNewPicture };
    };

    const back = () => {
        redirect(`/clubs${id ? `?id=${id}` : ''}`);
    };

    return club === null ? (
        <Loading flat />
    ) : (
        <React.Fragment>
            <Helmet>
                <title>{`${id ? 'Edit' : 'Add'} Club - TAMS Club Calendar`}</title>
            </Helmet>
            <UploadBackdrop open={backdrop} />
            <Typography variant="h1" className={classes.title}>
                {id ? 'Edit Club' : 'Add Club'}
            </Typography>
            {id ? <AddButton editHistory path={`/edit/history/clubs?id=${id}`} /> : null}
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
                <TwoButtonBox success="Submit" onCancel={back} onSuccess={onSubmit} submit right />
            </form>
        </React.Fragment>
    );
};

export default EditClubs;
