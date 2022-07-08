import React, { useEffect, useState } from 'react';
import { AccessLevelEnum } from '../../types/enums';
import { getUserList, putUserLevel } from '../../api';
import { accessLevelToString } from '../../util/miscUtil';
import { createPopupEvent } from '../../util/constructors';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
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

import Popup from '../shared/popup';
import UploadBackdrop from '../edit/shared/upload-backdrop';
import { setCookie } from '../../util/cookies';

const ChangeUserPermissions = () => {
    const [user, setUser] = useState<User>({ id: '0', level: AccessLevelEnum.STANDARD, name: '', email: '' });
    const [editLevelPrompt, setEditLevelPrompt] = useState(false);
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
    const [filterValue, setFilterValue] = useState<GridFilterItem>(null);

    // Function to format the enum values for filter
    const levelFormat = (params) => accessLevelToString(params.row.level);

    // Define filters to use
    const filterOperators = getGridStringOperators().filter((operator) => operator.value === 'contains');

    // Define columns to show for events
    const userColumns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 300, filterOperators },
        { field: 'email', headerName: 'Email', width: 300, filterOperators },
        { field: 'level', headerName: 'Level', width: 150, valueGetter: levelFormat, filterOperators },
        { field: 'id', headerName: 'ID', width: 325, filterOperators },
        {
            field: 'edit',
            headerName: '✏️',
            width: 75,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={levelEditPopup.bind(
                        this,
                        params.row.id,
                        params.row.name,
                        params.row.email,
                        params.row.level
                    )}
                    sx={{ margin: 'auto' }}
                >
                    <EditRoundedIcon />
                </IconButton>
            ),
        },
    ];

    // When sorting changes
    const handleSortModelChange = (newModel: GridSortModel) => {
        setSortModel(newModel);
    };

    // When filtering changes
    const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
        setFilterValue(filterModel.items[0]);
    }, []);

    // This function will show a popup to edit the level of the user
    const levelEditPopup = async (id: string, name: string, email: string, level: AccessLevel) => {
        setUser({ id, name, email, level });
        setEditLevelPrompt(true);
    };

    // Whenever the user sets the level
    const handleLevelChange = (event: SelectChangeEvent<AccessLevel>) => {
        setUser({ ...user, level: event.target.value as AccessLevel });
    };

    // After user changes level, request for the change
    const editUserLevel = async () => {
        setEditLevelPrompt(false);
        setBackdrop(true);
        const res = await putUserLevel(user.id, user.level);
        if (res.status === 204) {
            setCookie('success', `${user.name}'s level updated to ${accessLevelToString(user.level)}!`);
            window.location.reload();
        } else {
            setPopupEvent(createPopupEvent('Error changing user access levels', 4));
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

            // Default to sort by name ascending
            if (!sort) {
                setSortModel([{ field: 'name', sort: 'asc' }]);
                return;
            }

            const rowsRes = await getUserList(1, rowsState.pageSize, sort, reverse, filter);
            if (rowsRes.status !== 200) {
                setPopupEvent(
                    createPopupEvent('Error fetching resource. Please check your connection and reload the page.', 4)
                );
                return;
            }
            setRowsState((prev) => ({ ...prev, rows: rowsRes.data.docs, page: 0, loading: false }));
            setRowCount(rowsRes.data.totalPages * 10);
        })();
    }, [sortModel, filterValue]);

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

            const newRowsRes = await getUserList(rowsState.page + 1, rowsState.pageSize, sort, reverse, filter);
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
                open={editLevelPrompt}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Edit access level for {user.name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 2 }}>
                        <FormControl sx={{ maxWidth: 300 }} fullWidth>
                            <InputLabel id="level-select-label">Access Level</InputLabel>
                            <Select
                                labelId="level-select-label"
                                id="level-select"
                                label="Access Level"
                                value={user.level}
                                onChange={handleLevelChange}
                            >
                                <MenuItem value={AccessLevelEnum.STANDARD}>Standard</MenuItem>
                                <MenuItem value={AccessLevelEnum.CLUBS}>Clubs</MenuItem>
                                <MenuItem value={AccessLevelEnum.ADMIN}>Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={setEditLevelPrompt.bind(this, false)} color="error" variant="text">
                        Cancel
                    </Button>
                    <Button onClick={editUserLevel} color="primary" variant="contained">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
            <UploadBackdrop text="Uploading data..." open={backdrop} />
            <DataGrid
                columns={userColumns}
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

export default ChangeUserPermissions;
