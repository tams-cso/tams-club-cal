import React, { useEffect, useState } from 'react';
import { deleteAdminResource, getAdminResources } from '../../api';
import { createPopupEvent } from '../../util/constructors';
import { formatDate } from '../../util/datetime';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {
    DataGrid,
    getGridStringOperators,
    GridColDef,
    GridFilterItem,
    GridFilterModel,
    GridSortModel,
} from '@mui/x-data-grid';
import { capitalize } from '@mui/material';

import Popup from '../shared/popup';
import UploadBackdrop from '../edit/shared/upload-backdrop';
import { setCookie } from '../../util/cookies';

const ManageResources = () => {
    const [dataToDelete, setDataToDelete] = useState<DeleteObject>({ resource: 'events', id: '', name: '' });
    const [deletePrompt, setDeletePrompt] = useState(false);
    const [popupEvent, setPopupEvent] = useState<PopupEvent>(null);
    const [backdrop, setBackdrop] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [rowsState, setRowsState] = useState({
        page: 0,
        pageSize: 10,
        rows: [],
        loading: true,
    });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [resource, setResource] = useState<Resource>('events');
    const [filterValue, setFilterValue] = useState<GridFilterItem>(null);
    const [colList, setColList] = useState<GridColDef[]>([]);

    // Format start/end datetime
    const dts = (params) => formatDate(params.row.start, 'MM/DD/YY, HH:mma');
    const dte = (params) => formatDate(params.row.end, 'MM/DD/YY, HH:mma');

    // Define filters to use
    const filterOperators = getGridStringOperators().filter((operator) => operator.value === 'contains');

    // Define the 2 columns for the view and delete action buttons
    const actionColumns: GridColDef[] = [
        {
            field: 'view',
            headerName: '👁️',
            width: 75,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={window.open.bind(this, `${window.location.origin}/${resource}/${params.row.id}`)}
                    sx={{ margin: 'auto' }}
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
        {
            field: 'delete',
            headerName: '❌',
            width: 75,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton onClick={promptDelete.bind(this, params.row.id, params.row.name)} sx={{ margin: 'auto' }}>
                    <DeleteOutlineIcon />
                </IconButton>
            ),
        },
    ];

    // Define columns to show for events
    const eventColumns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 325, filterOperators },
        { field: 'club', headerName: 'Club', width: 150, filterOperators },
        { field: 'start', headerName: 'Start', width: 150, valueGetter: dts, filterable: false },
        { field: 'end', headerName: 'End', width: 150, valueGetter: dte, filterable: false },
        { field: 'id', headerName: 'ID', width: 225, filterOperators },
        ...actionColumns,
    ];

    // Define columns to show for clubs
    // TODO: Figure out how to filter by a boolean value -- advised (need to fix adminRouter too)
    const clubColumns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 325, filterOperators },
        { field: 'advised', headerName: 'Advised', width: 100, filterOperators, filterable: false },
        { field: 'description', headerName: 'Description', width: 350, filterable: false },
        { field: 'id', headerName: 'ID', width: 225, filterOperators },
        ...actionColumns,
    ];

    // Define columns to show for volunteering
    const volunteeringColumns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 325, filterOperators },
        { field: 'club', headerName: 'Club', width: 150, filterOperators },
        { field: 'description', headerName: 'Description', width: 300, filterable: false },
        { field: 'id', headerName: 'ID', width: 225, filterOperators },
        ...actionColumns,
    ];

    // When filtering changes
    const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
        setFilterValue(filterModel.items[0]);
    }, []);

    // This function will prompt the user first to see if they are sure they want to delete
    const promptDelete = (id: string, name: string) => {
        setDataToDelete({ resource, id, name });
        setDeletePrompt(true);
    };

    // This function will trigger when the user selects a new resource
    const handleResourceChange = (event: SelectChangeEvent) => {
        setResource(event.target.value as Resource);
    };

    // Actually delete the resource
    const deleteResource = async () => {
        setDeletePrompt(false);
        setBackdrop(true);
        const res = await deleteAdminResource(dataToDelete.resource, dataToDelete.id);
        if (res.status === 200) {
            setCookie('success', `${dataToDelete.name} deleted successfully!`);
            window.location.reload();
        } else {
            setPopupEvent(createPopupEvent('Error deleting resource', 4));
        }
        setBackdrop(false);
    };

    // When the resource changes, change the columns
    useEffect(() => {
        if (resource === 'events') setColList(eventColumns);
        else if (resource === 'clubs') setColList(clubColumns);
        else if (resource === 'volunteering') setColList(volunteeringColumns);
    }, [resource]);

    // On load, get the number of rows
    // Also trigger this if the filtering or sorting changes
    useEffect(() => {
        (async () => {
            // Set loading state
            setRowsState((prev) => ({ ...prev, loading: true }));

            // Calculate sort and filters
            const sort = sortModel[0] ? sortModel[0].field : null;
            const reverse = sortModel[0] ? sortModel[0].sort === 'desc' : false;
            const filter = filterValue && filterValue.value ? filterValue : null;

            // Default to sort by name ascending
            if (!sort) {
                setSortModel([{ field: 'name', sort: 'asc' }]);
                return;
            }

            const rowsRes = await getAdminResources(resource, 1, rowsState.pageSize, sort, reverse, filter);
            if (rowsRes.status !== 200) {
                setPopupEvent(createPopupEvent('Error fetching resource', 4));
                return;
            }
            setRowsState((prev) => ({ ...prev, rows: rowsRes.data.docs, page: 0, loading: false }));
            setRowCount(rowsRes.data.totalPages * 10);
        })();
    }, [resource, sortModel, filterValue]);

    // Whenever the user scrolls to another page or changes the size of pages, load more content
    useEffect(() => {
        if (rowCount === 0) return;

        (async () => {
            // Set loading state
            setRowsState((prev) => ({ ...prev, loading: true }));

            // Calculate sort and filters
            const sort = sortModel[0] ? sortModel[0].field : null;
            const reverse = sortModel[0] ? sortModel[0].sort === 'desc' : false;
            const filter = filterValue && filterValue.value ? filterValue : null;

            const newRowsRes = await getAdminResources(
                resource,
                rowsState.page + 1,
                rowsState.pageSize,
                sort,
                reverse,
                filter
            );
            if (newRowsRes.status !== 200) {
                setPopupEvent(createPopupEvent('Error fetching resource', 4));
                return;
            }

            setRowsState((prev) => ({ ...prev, loading: false, rows: newRowsRes.data.docs }));
        })();
    }, [rowsState.page, rowsState.pageSize]);

    return (
        <React.Fragment>
            <Popup event={popupEvent} />
            <Dialog
                open={deletePrompt}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Delete {capitalize(dataToDelete.resource).replace(/s/g, '')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete {dataToDelete.name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={setDeletePrompt.bind(this, false)} sx={{ color: '#aaa' }} variant="text">
                        Cancel
                    </Button>
                    <Button onClick={deleteResource} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <UploadBackdrop text="Deleting Resource..." open={backdrop} />
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 2 }}>
                <FormControl sx={{ maxWidth: 300 }} fullWidth>
                    <InputLabel id="resource-select-label">Resource</InputLabel>
                    <Select
                        labelId="resource-select-label"
                        id="resource-select"
                        label="Resource"
                        value={resource}
                        onChange={handleResourceChange}
                    >
                        <MenuItem value="events">Event</MenuItem>
                        <MenuItem value="clubs">Clubs</MenuItem>
                        <MenuItem value="volunteering">Volunteering</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <DataGrid
                columns={colList}
                {...rowsState}
                rowCount={rowCount}
                pagination
                paginationMode="server"
                onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
                onPageSizeChange={(pageSize) => setRowsState((prev) => ({ ...prev, pageSize }))}
                sortingMode="server"
                sortModel={sortModel}
                filterMode="server"
                onFilterModelChange={onFilterChange}
                onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
                sx={{ marginTop: 2, height: 650 }}
            />
        </React.Fragment>
    );
};

export default ManageResources;
