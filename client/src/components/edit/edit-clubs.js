import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import { openPopup } from '../../redux/actions';
import { getParams, processLinkObjectList, redirect } from '../../functions/util';
import { Club, ClubImageBlobs } from '../../functions/entries';
import { getClub, postClub, putClub } from '../../functions/api';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
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
import Title from '../shared/title';
import FormWrapper from './shared/form-wrapper';
import Spacer from './shared/spacer';

/**
 * Main form for editing and adding clubs
 */
const EditClubs = () => {
    const [id, setId] = useState(null);
    const [club, setClub] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const [cover, setCover] = useState(false);
    const [profilePics, setProfilePics] = useState(null);
    const dispatch = useDispatch();
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // When mounted, get the ID and fetch club data
    useEffect(async () => {
        // Extract ID from url search params
        const id = getParams('id');

        // If the ID is not null, fetch the club data from the backend and set the state variables
        // Otherwise, create a new club and load the default data into the controller
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

    // When the club data changes, set the value of the advised variable in the form controller to a string
    useEffect(() => {
        if (club === null) return;
        setValue('advised', club.advised ? 'advised' : 'independent');
    }, [club]);

    // When the user submits the form, either create or update the club
    const onSubmit = async (data) => {
        // If the name is empty, do nothing
        if (!('name' in data)) return;

        // Process the exec data, profile pictures, and picture data
        const { execs, execProfilePics, execPhotos } = data.execs
            ? processExecs(data.execs)
            : { execs: [], execProfilePics: [], execPhotos: [] };
        
        // Filter out deleted commmittees and process the lists
        const filteredCommittees = data.committees ? data.committees.filter((c) => !c.deleted) : [];
        const committees = filteredCommittees.map((c) => ({
            ...c,
            heads: processLinkObjectList(c.heads),
            links: processLinkObjectList(c.links),
        }));

        // Process the link object list
        const links = processLinkObjectList(data.links);

        // Create the club object from the data
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

        // Create the club image object containing cover and exec profile picture blobs
        const newImages = new ClubImageBlobs(cover, execProfilePics);

        // Start the upload process
        setBackdrop(true);

        // If the club ID is null, create the club, otherwise update it
        const res =
            id === null
                ? await postClub(newClub, newImages, execPhotos)
                : await putClub(newClub, newImages, execPhotos, id);

        // Finished uploading
        setBackdrop(false);

        // If the response is successful, redirect to the club page, otherwise display an error
        if (res.status === 200) {
            new Cookies().set('success', id ? 'update-club' : 'add-club', { sameSite: 'strict', path: '/' });
            back();
        } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
    };

    // Process execs by filtering out deleted execs and adding an attribute that indicates if the exec has a new profile pic
    const processExecs = (execs) => {
        const cleanedExecs = execs.map((e) => (e.deleted ? null : e));
        const outProfilePics = profilePics.filter((p, i) => cleanedExecs[i] !== null);
        const outExecs = cleanedExecs.filter((e) => e !== null);
        const hasNewPicture = outProfilePics.map((p) => p !== null);
        return { execs: outExecs, execProfilePics: outProfilePics, execPhotos: hasNewPicture };
    };

    // Returns the user back to the club display page
    const back = () => {
        redirect(`/clubs${id ? `?id=${id}` : ''}`);
    };

    return club === null ? (
        <Loading flat />
    ) : (
        <React.Fragment>
            <Title title={`${id ? 'Edit' : 'Add'} Club`} />
            <UploadBackdrop open={backdrop} />
            <Typography variant="h1" sx={{ textAlign: 'center', fontSize: '3rem' }}>
                {id ? 'Edit Club' : 'Add Club'}
            </Typography>
            {id ? <AddButton editHistory path={`/edit/history/clubs?id=${id}`} /> : null}
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: { lg: 'row', xs: 'column' } }}>
                    <ControlledSelect
                        control={control}
                        setValue={setValue}
                        value={club.advised ? 'advised' : 'independent'}
                        name="advised"
                        variant="outlined"
                        sx={{ height: 56 }}
                    >
                        <MenuItem value="advised">Advised</MenuItem>
                        <MenuItem value="independent">Independent</MenuItem>
                    </ControlledSelect>
                    <Spacer />
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
                <Typography variant="h2" sx={{ paddingTop: 4, textAlign: 'center', fontSize: '2rem' }}>
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
                <Typography variant="h2" sx={{ paddingTop: 4, textAlign: 'center', fontSize: '2rem' }}>
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
            </FormWrapper>
        </React.Fragment>
    );
};

export default EditClubs;
