import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { capitalize, useMediaQuery, useTheme } from '@mui/material';

import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import Popup from './popup';
import UploadBackdrop from '../edit/shared/upload-backdrop';
import { PopupEvent, Resource } from '../../types';
import Cookies from 'universal-cookie';
import { createPopupEvent } from '../../util/constructors';
import { deleteClub, deleteEvent, deleteVolunteering } from '../../api';

interface DeleteButtonProps {
    /** Resource that is being deleted */
    resource: Resource;

    /** ID of resource to delete */
    id: string;

    /** Name of the resource to delete */
    name: string;

    /** True if button should be disabled */
    disabled?: boolean;

    /** True if button should be hidden */
    hidden?: boolean;
}

/**
 * Shows a delete button on the right side of the resource edit page
 */
const DeleteButton = (props: DeleteButtonProps) => {
    const [deletePrompt, setDeletePrompt] = useState(false);
    const [popupEvent, setPopupEvent] = useState<PopupEvent>(null);
    const [backdrop, setBackdrop] = useState(false);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();

    const deleteMe = async () => {
        setDeletePrompt(false);
        setBackdrop(true);

        // Call the delete endpoint
        let res = null;
        if (props.resource === 'events') {
            res = await deleteEvent(props.id);
        } else if (props.resource === 'clubs') {
            res = await deleteClub(props.id);
        } else if (props.resource === 'volunteering') {
            res = await deleteVolunteering(props.id);
        } else {
            console.error('Invalid resource name at delete-button.tsx!');
            return;
        }

        // Make sure delete was successful and send error if not
        if (res.status === 204) {
            const cookies = new Cookies();
            cookies.set('success', `${props.name} deleted successfully!`, { path: '/' });
            router.push(`/${props.resource}`);
        } else {
            setPopupEvent(createPopupEvent('Error deleting resource', 4));
        }
        setBackdrop(false);
    };

    return (
        <React.Fragment>
            <Popup event={popupEvent} />
            <Dialog
                open={deletePrompt}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Delete {capitalize(props.resource).replace(/s/g, '')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete <b>{props.name}</b>? This action is permanent and the resource
                        cannot be recovered!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={setDeletePrompt.bind(this, false)} sx={{ color: '#aaa' }} variant="text">
                        Cancel
                    </Button>
                    <Button onClick={deleteMe} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <UploadBackdrop text="Deleting Resource..." open={backdrop} />
            <Tooltip title={`Delete ${props.resource.replace('s', '')}`}>
                <Fab
                    variant="extended"
                    size={matches ? 'small' : 'large'}
                    color="inherit"
                    aria-label="delete"
                    onClick={setDeletePrompt.bind(this, true)}
                    disabled={props.disabled}
                    sx={{
                        display: props.hidden ? 'none' : 'flex',
                        margin: '12px auto',
                        position: 'fixed',
                        bottom: { lg: 32, xs: 12 },
                        zIndex: (theme) => theme.zIndex.appBar + 1,
                        color: (theme) => theme.palette.common.white,
                        right: { lg: 32, xs: 12 },
                        backgroundColor: (theme) => theme.palette.error.main,
                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.error.dark,
                        },
                    }}
                >
                    <DeleteIcon sx={{ marginRight: 1 }} width="16" />
                    Delete {props.resource.replace('s', '')}
                </Fab>
            </Tooltip>
        </React.Fragment>
    );
};

export default DeleteButton;
