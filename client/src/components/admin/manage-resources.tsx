import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { deleteAdminResource, getAdminResources } from '../../api';
import { Resource, PopupEvent, RepeatingStatus } from '../../types';
import { createPopupEvent, formatDate } from '../../util';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    DataGrid,
    getGridStringOperators,
    GridColDef,
    GridFilterItem,
    GridFilterModel,
    GridSortModel,
} from '@mui/x-data-grid';
import Popup from '../shared/popup';
import { capitalize } from '@mui/material';
import UploadBackdrop from '../edit/shared/upload-backdrop';

interface DeleteObject {
    /** Resource type to delete */
    resource: Resource;

    /** ID of resource to delete */
    id: string;

    /** Name of resource to delete */
    name: string;
}

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

    // Format start/end datetime
    const dts = (params) => formatDate(params.row.start, 'MM/DD/YY, HH:mma');
    const dte = (params) => formatDate(params.row.end, 'MM/DD/YY, HH:mma');

    // Define filters to use
    const filterOperators = getGridStringOperators().filter((operator) => operator.value === 'contains');

    // Define columns to show for events
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 325, filterOperators },
        { field: 'club', headerName: 'Club', width: 150, filterOperators },
        { field: 'start', headerName: 'Start', width: 150, valueGetter: dts, filterable: false },
        { field: 'end', headerName: 'End', width: 150, valueGetter: dte, filterable: false },
        { field: 'id', headerName: 'ID', width: 225, filterOperators },
        {
            field: 'view',
            headerName: '👁️',
            width: 75,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <IconButton
                        onClick={window.open.bind(this, `${window.location.origin}/${resource}/${params.row.id}`)}
                        sx={{ margin: 'auto' }}
                    >
                        <VisibilityIcon />
                    </IconButton>
                );
            },
        },
        {
            field: 'delete',
            headerName: '❌',
            width: 75,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                if (params.row.repeats !== RepeatingStatus.NONE && params.row.id !== params.row.repeatOriginId)
                    return null;
                return (
                    <IconButton
                        onClick={promptDelete.bind(this, params.row.id, params.row.name)}
                        sx={{ margin: 'auto' }}
                    >
                        <DeleteOutlineIcon />
                    </IconButton>
                );
            },
        },
    ];

    // When sorting changes
    const handleSortModelChange = (newModel: GridSortModel) => {
        setSortModel(newModel);
    };

    // When filtering changes
    const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
        console.log(filterModel.items[0]);
        setFilterValue(filterModel.items[0]);
    }, []);

    // This function will prompt the user first to see if they are sure they want to delete
    const promptDelete = (id: string, name: string) => {
        setDataToDelete({ resource, id, name });
        setDeletePrompt(true);
    };

    // Actually delete the resource
    const deleteResource = async () => {
        setDeletePrompt(false);
        setBackdrop(true);
        const res = await deleteAdminResource(dataToDelete.resource, dataToDelete.id);
        if (res.status === 200) {
            const cookies = new Cookies();
            cookies.set('success', `${dataToDelete.name} deleted successfully!`, { path: '/' });
            window.location.reload();
        } else {
            setPopupEvent(createPopupEvent('Error deleting resource', 4));
        }
        setBackdrop(false);
    };

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

            const rowsRes = await getAdminResources('events', 1, rowsState.pageSize, sort, reverse, filter);
            if (rowsRes.status !== 200) {
                setPopupEvent(createPopupEvent('Error fetching resource', 4));
                return;
            }
            setRowsState((prev) => ({ ...prev, rows: rowsRes.data.docs, page: 0, loading: false }));
            setRowCount(rowsRes.data.totalPages * 10);
        })();
    }, [sortModel, filterValue]);

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
                'events',
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
                    <Button onClick={setDeletePrompt.bind(this, false)} sx={{ color: 'white' }} variant="text">
                        Cancel
                    </Button>
                    <Button onClick={deleteResource} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <UploadBackdrop text="Deleting Resource..." open={backdrop} />
            <DataGrid
                columns={columns}
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
                onSortModelChange={handleSortModelChange}
                sx={{ marginTop: 2, height: 650 }}
            />
        </React.Fragment>
    );
};

export default ManageResources;
