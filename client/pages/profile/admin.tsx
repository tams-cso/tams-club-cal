import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Cookies from 'universal-cookie';
import { getAdminResources, deleteAdminResource, getIsAdmin, getLoggedIn } from '../../src/api';
import type { AdminResource, PopupEvent, Resource } from '../../src/entries';
import { createPopupEvent } from '../../src/util';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ControlledSelect from '../../src/components/edit/shared/controlled-select';
import ControlledTextField from '../../src/components/edit/shared/controlled-text-field';
import FormWrapper from '../../src/components/edit/shared/form-wrapper';
import PageWrapper from '../../src/components/shared/page-wrapper';
import Loading from '../../src/components/shared/loading';
import Popup from '../../src/components/shared/popup';

// TODO: This component is a spaghetti pile someone pls clean it up TwT

interface DeleteObject {
    /** Resource type to delete */
    resource: Resource;
    id: string;
    name: string;
}

// Server-side Rendering to check for token
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Get the token from cookies
    const token = ctx.req.cookies.token;
    if (token === undefined) return { props: { authorized: false, error: false } };

    // Check if valid token and compare with database
    const res = await getLoggedIn(token);
    const adminRes = await getIsAdmin(token);
    if (res.status !== 200 || adminRes.status !== 200) return { props: { authorized: false, error: true } };

    // If there is no issue with the authorization, authorize user!
    return { props: { authorized: res.data.loggedIn && adminRes.data.admin, error: false } };
};

/**
 * Admin dashboard page -- users can only access if they are
 * logged in and have admin privileges.
 */
const Admin = ({ authorized, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [resourceList, setResourceList] = useState<AdminResource[]>([]);
    const [resourceComponentList, setResourceComponentList] = useState([]);
    const [prevSearch, setPrevSearch] = useState(null);
    const [dataToDelete, setDataToDelete] = useState<DeleteObject>({ resource: 'events', id: '', name: '' });
    const [deletePrompt, setDeletePrompt] = useState(false);
    const [popupEvent, setPopupEvent] = useState<PopupEvent>(null);
    const [page, setPage] = useState(0);
    const { control, handleSubmit, setValue } = useForm();

    // On form submit, get resource list
    const onSubmit = async (data) => {
        // Invalid resource field
        if (data.resource === undefined) {
            setPopupEvent(createPopupEvent('Please select a resource to search for', 4));
            return;
        }

        // Invalid field/search fields
        if (data.field !== 'all' && (data.search === '' || data.search === undefined)) {
            setPopupEvent(createPopupEvent('Please enter a search term or select "Find All"', 4));
            return;
        }

        // Fetches the resource list and save it to the state variable
        const resourceRes = await getAdminResources(data.resource, data.field, data.search, 0);
        if (resourceRes.status === 200) {
            console.log(data);
            setPrevSearch(data);
            setPage(0);
            setResourceList(resourceRes.data);
        } else {
            setPopupEvent(createPopupEvent('Error getting resource list', 4));
        }
    };

    // On page change, get next set of resources and append it to the list
    const nextPage = async () => {
        const resourceRes = await getAdminResources(
            prevSearch.resource,
            prevSearch.field,
            prevSearch.search || 'none',
            page + 1
        );
        if (resourceRes.status === 200) {
            setPage(page + 1);
            setResourceList([...resourceList, ...resourceRes.data]);
        } else {
            setPopupEvent(createPopupEvent('Error getting additional resource list', 4));
        }
    };

    // This function will prompt the user first to see if they are sure they want to delete
    const promptDelete = (resource: Resource, id: string, name: string) => {
        setDataToDelete({ resource, id, name });
        setDeletePrompt(true);
    };

    // Actually delete the resource
    const deleteResource = async () => {
        setDeletePrompt(false);
        const res = await deleteAdminResource(dataToDelete.resource, dataToDelete.id);
        if (res.status === 200) {
            const cookies = new Cookies();
            cookies.set('success', `${dataToDelete.name} deleted successfully!`, { path: '/' });
            window.location.reload();
        } else {
            setPopupEvent(createPopupEvent('Error deleting resource', 4));
        }
    };

    // Create list of resource components
    // whenever the resourceList updates
    useEffect(() => {
        setResourceComponentList([
            ...resourceList.map((resource) => {
                return (
                    <ListItem key={resource.id}>
                        <ListItemText primary={resource.name} />
                        <IconButton
                            onClick={window.open.bind(
                                this,
                                prevSearch.resource === 'repeating-reservations'
                                    ? `${window.location.origin}/reservations/${resource.id}?repeating=true`
                                    : `${window.location.origin}/${prevSearch.resource}/${resource.id}`
                            )}
                        >
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={promptDelete.bind(this, prevSearch.resource, resource.id, resource.name)}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </ListItem>
                );
            }),
            <ListItem key="next-page">
                {resourceList.length % 50 == 0 && resourceList.length !== 0 ? (
                    <Button onClick={nextPage}>Next Page</Button>
                ) : null}
            </ListItem>,
        ]);
    }, [resourceList]);

    // Redirect the user if they are illegally here
    useEffect(() => {
        if (!authorized) {
            router.push('/profile');
        }
    }, []);

    // Return error if user is not logged in and is not an admin
    if (!authorized) {
        return (
            <PageWrapper>
                <Loading error={error}>
                    Could not get data. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container>
                <Popup event={popupEvent} />
                <Dialog
                    open={deletePrompt}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                >
                    <DialogTitle id="delete-dialog-title">Delete {dataToDelete.resource}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                            Are you sure you want to delete {dataToDelete.name}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={setDeletePrompt.bind(this, false)} color="error">
                            Cancel
                        </Button>
                        <Button onClick={deleteResource} color="primary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                <Typography variant="h2" component="h1" sx={{ textAlign: 'center', padding: 2 }}>
                    Admin Dashboard
                </Typography>
                <Grid container spacing={{ xs: 2, lg: 4 }} sx={{ padding: 3 }}>
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={1} sx={{ padding: 2, height: '100%' }}>
                            <Typography variant="h3" sx={{ textAlign: 'center' }}>
                                Manage Resources
                            </Typography>
                            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 1 }}>
                                    <ControlledSelect
                                        control={control}
                                        setValue={setValue}
                                        name="resource"
                                        label="Resource"
                                        variant="standard"
                                        sx={{ marginRight: 1 }}
                                        wrapperSx={{ flexGrow: 1 }}
                                        autoWidth
                                    >
                                        <MenuItem value="events">Events</MenuItem>
                                        <MenuItem value="clubs">Clubs</MenuItem>
                                        <MenuItem value="volunteering">Volunteering</MenuItem>
                                        <MenuItem value="reservations">Reservations</MenuItem>
                                        <MenuItem value="repeating-reservations">Repeating Reservations</MenuItem>
                                    </ControlledSelect>
                                    <ControlledSelect
                                        control={control}
                                        setValue={setValue}
                                        name="field"
                                        label="Field to Search"
                                        variant="standard"
                                        wrapperSx={{ flexGrow: 1 }}
                                    >
                                        <MenuItem value="all">Find All</MenuItem>
                                        <MenuItem value="name">Name</MenuItem>
                                        <MenuItem value="id">ID</MenuItem>
                                    </ControlledSelect>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 1 }}>
                                    <ControlledTextField
                                        control={control}
                                        setValue={setValue}
                                        value=""
                                        label="Search"
                                        name="search"
                                        variant="standard"
                                        fullWidth
                                    />
                                    <Button type="submit" sx={{ marginLeft: 1 }}>
                                        Submit
                                    </Button>
                                </Box>
                            </FormWrapper>
                            <List sx={{ maxHeight: 500, overflowY: 'auto' }}>{resourceComponentList}</List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={1} sx={{ padding: 2, height: '100%' }}>
                            <Typography variant="h3" sx={{ textAlign: 'center' }}>
                                Edit External Links
                            </Typography>
                            <Typography sx={{ textAlign: 'center', color: '#888', paddingTop: 2 }}>
                                To be added
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={1} sx={{ padding: 2, height: '100%' }}>
                            <Typography variant="h3" sx={{ textAlign: 'center' }}>
                                Change User Permissions
                            </Typography>
                            <Typography sx={{ textAlign: 'center', color: '#888', paddingTop: 2 }}>
                                To be added
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={1} sx={{ padding: 2, height: '100%' }}>
                            <Typography variant="h3" sx={{ textAlign: 'center' }}>
                                Feedback
                            </Typography>
                            <Typography sx={{ textAlign: 'center', color: '#888', paddingTop: 2 }}>
                                To be added
                            </Typography>
                            <List></List>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </PageWrapper>
    );
};

export default Admin;
