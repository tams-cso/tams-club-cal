import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useForm } from 'react-hook-form';
import { AccessLevelEnum } from '../../../src/types/enums';
import { processLinkObjectList, getTokenFromCookies } from '../../../src/util/miscUtil';
import { createPopupEvent, createClub, createClubImageBlobs } from '../../../src/util/constructors';
import { getClub, getUserInfo, postClub, putClub } from '../../../src/api';

import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import LinkInputList from '../../../src/components/edit/clubs/link-input-list';
import EditCommitteeList from '../../../src/components/edit/clubs/edit-committee-list';
import ControlledTextField from '../../../src/components/edit/shared/controlled-text-field';
import ControlledSelect from '../../../src/components/edit/shared/controlled-select';
import UploadBackdrop from '../../../src/components/edit/shared/upload-backdrop';
import ImageUpload from '../../../src/components/edit/clubs/image-upload';
import EditExecList from '../../../src/components/edit/clubs/edit-exec-list';
import TwoButtonBox from '../../../src/components/shared/two-button-box';
import AddButton from '../../../src/components/shared/add-button';
import FormWrapper from '../../../src/components/edit/shared/form-wrapper';
import Spacer from '../../../src/components/shared/spacer';
import Popup from '../../../src/components/shared/popup';
import EditWrapper from '../../../src/components/edit/shared/edit-wrapper';
import TitleMeta from '../../../src/components/meta/title-meta';
import RobotBlockMeta from '../../../src/components/meta/robot-block-meta';
import DeleteButton from '../../../src/components/shared/delete-button';
import UnauthorizedAlert from '../../../src/components/edit/shared/unauthorized-alert';
import { setCookie } from '../../../src/util/cookies';
import FormBox from '../../../src/components/edit/shared/form-box';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Get editor information
    const token = getTokenFromCookies(ctx);
    const userRes = await getUserInfo(token);
    const userId = userRes.status === 200 ? userRes.data.id : null;
    const level = userId ? userRes.data.level : AccessLevelEnum.NONE;

    // Check if adding club
    const id = ctx.params.id as string;
    if (!id) return { props: { club: createClub(), id: null, error: false, level } };

    // Get club info
    const clubRes = await getClub(id);
    const error = clubRes.status !== 200;
    const club = error ? createClub() : clubRes.data;
    return {
        props: { club, error, id: error ? null : id, level },
    };
};

/**
 * Main form for editing and adding clubs
 */
const EditClubs = ({ club, id, error, level }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [backdrop, setBackdrop] = useState(false);
    const [cover, setCover] = useState<Blob>(null);
    const [profilePics, setProfilePics] = useState(null);
    const [popupEvent, setPopupEvent] = useState<PopupEvent>();
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

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
        const newClub = createClub(
            id,
            data.name,
            data.advised === 'advised',
            links,
            data.description,
            club.coverImgThumbnail,
            club.coverImg,
            execs,
            committees
        );

        // Create the club image object containing cover and exec profile picture blobs
        const newImages = createClubImageBlobs(cover, execProfilePics);

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
        if (res.status === 204) {
            setCookie('success', id ? 'update-club' : 'add-club');
            back();
        } else setPopupEvent(createPopupEvent('Unable to upload data. Please refresh the page or try again.', 4));
    };

    // Process execs by filtering out deleted execs and adding an attribute that indicates if the exec has a new profile pic
    const processExecs = (execs: (Exec & { deleted: boolean })[]) => {
        const cleanedExecs = execs.map((e) => (e.deleted ? null : e));
        const outProfilePics = profilePics.filter((p: Blob, i: number) => cleanedExecs[i] !== null);
        const outExecs = cleanedExecs.filter((e) => e !== null);
        const hasNewPicture = outProfilePics.map((p: Blob) => p !== null);
        return { execs: outExecs, execProfilePics: outProfilePics, execPhotos: hasNewPicture };
    };

    // Returns the user back to the club display page
    const back = () => {
        router.push(`/clubs${id ? `/${id}` : ''}`);
    };

    // On load
    useEffect(() => {
        // Send error if can't fetch resource
        if (error) {
            setPopupEvent(createPopupEvent('Error fetching club info. Please refresh the page or add a new event.', 4));
        }

        // When the club data changes, set the value of the advised variable in the form controller to a string
        // Also set up the profile pics array
        setValue('advised', club.advised ? 'advised' : 'independent');
        setProfilePics(Array(club.execs.length).fill(null));
    }, []);

    return (
        <EditWrapper>
            <TitleMeta title={`${id ? 'Edit' : 'Add'} Club`} path={`/edit/clubs/${id ? id : ''}`} />
            <RobotBlockMeta />
            <UploadBackdrop open={backdrop} />
            <Popup event={popupEvent} />
            <Typography variant="h1" sx={{ textAlign: 'center', fontSize: '3rem' }}>
                {id ? 'Edit Club' : 'Add Club'}
            </Typography>
            <UnauthorizedAlert show={level < AccessLevelEnum.CLUBS} resource="club" />
            {id ? (
                <React.Fragment>
                    <AddButton editHistory path={`/edit/history/clubs/${id}`} />
                    <DeleteButton
                        resource="clubs"
                        id={id}
                        name={club.name}
                        hidden={!id || level < AccessLevelEnum.CLUBS}
                    />
                </React.Fragment>
            ) : null}
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <FormBox>
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
                </FormBox>
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
                <TwoButtonBox
                    success="Submit"
                    onCancel={back}
                    onSuccess={onSubmit}
                    submit
                    right
                    disabled={level < AccessLevelEnum.CLUBS}
                />
            </FormWrapper>
        </EditWrapper>
    );
};

export default EditClubs;
