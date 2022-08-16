import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createExternalLink, createPopupEvent, createTextData } from '../../util/constructors';
import { getExternalLinks, putExternalLinks } from '../../api';

import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import FormWrapper from '../edit/shared/form-wrapper';
import TwoButtonBox from '../shared/two-button-box';
import UploadBackdrop from '../edit/shared/upload-backdrop';
import Popup from '../shared/popup';
import EditLink from './edit-link';
import Loading from '../shared/loading';

const EditLinkList = () => {
    const [backdrop, setBackdrop] = useState(false);
    const [popupEvent, setPopupEvent] = useState<PopupEvent>(null);
    const [linkList, setLinkList] = useState<ExternalLink[]>(null);
    const [listItems, setListItems] = useState([]);
    const [addedList, setAddedList] = useState([]);
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // Load the list of links from the database
    const loadLinks = async () => {
        const linkRes = await getExternalLinks();
        if (linkRes.status === 200) {
            setLinkList(linkRes.data);
        } else {
            setPopupEvent(createPopupEvent('Could not get external links', 4));
        }
    };

    // Reset the form by clearing all new links and loading from database
    const reset = async () => {
        await loadLinks();
        setAddedList([]);
    };

    // When the user submits the form, either create or update the volunteering opportunity
    const onSubmit = async (data) => {
        // Don't allow submitting with errors
        if (Object.entries(errors).length > 0) return;

        // Filter out deleted links and process the list
        const filteredLinks = data.links ? data.links.filter((l) => !l.deleted) : [];
        const links = filteredLinks.map((l) => createExternalLink(l.name, l.url, l.icon));

        // Creates the TextData object
        const textData = createTextData<ExternalLink[]>('external-links', links);

        // Start the upload process
        setBackdrop(true);

        // If the ID is null, create the volunteering, otherwise update it
        const res = await putExternalLinks(textData);

        // Finished uploading
        setBackdrop(false);

        // If the request was successful, redirect to the volunteering page, otherwise display an error
        if (res.status === 204) setPopupEvent(createPopupEvent('Successfully uploaded new external links!', 2));
        else setPopupEvent(createPopupEvent('Unable to upload data. Please refresh the page or try again.', 4));
    };

    // On mount, load the list of links
    useEffect(() => {
        loadLinks();
    }, []);

    // On link list load and new link creation, re-render the list of EditLink components
    useEffect(() => {
        // If the committee list is null, do nothing
        if (!linkList) return;

        // Map the list of committees and added list of committees to EditCommittee components
        setListItems(
            [...linkList, ...addedList].map((l, i) => (
                <EditLink
                    control={control}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    index={i}
                    key={i}
                    link={l}
                />
            ))
        );
    }, [linkList, addedList]);

    // Add the new committee to the list
    const addItem = () => {
        setAddedList([...addedList, createExternalLink()]);
    };

    return linkList === null ? (
        <Loading />
    ) : (
        <Paper sx={{ marginBottom: 4 }}>
            <UploadBackdrop open={backdrop} />
            <Popup event={popupEvent} />
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <List>{listItems}</List>
                <Button color="secondary" onClick={addItem} sx={{ margin: '6px auto 24px', display: 'block' }}>
                    Add External Link
                </Button>
                <TwoButtonBox success="Save" onCancel={reset} submit right />
            </FormWrapper>
        </Paper>
    );
};

export default EditLinkList;
