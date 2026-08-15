import React, { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    DataGrid,
    getGridStringOperators,
    GridColDef,
    GridFilterItem,
    GridFilterModel,
    GridSortModel,
} from '@mui/x-data-grid';

import Popup from '../shared/popup';

import { getMicrosoftAccounts } from '../../api';
import { createPopupEvent } from '../../util/constructors';

const MicrosoftAccounts = () => {
    const [popupEvent, setPopupEvent] = useState<PopupEvent>(null);
    const [rowCount, setRowCount] = useState(0);
    const [rowsState, setRowsState] = useState({
        page: 0,
        pageSize: 10,
        rows: [],
        loading: true,
    });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [filterValue, setFilterValue] = useState<GridFilterItem>(null);

    const filterOperators = getGridStringOperators().filter((operator) => operator.value === 'contains');

    const googleEmail = (params) => params.row.email || '—';
    const displayName = (params) => params.row.name || '—';

    const msColumns: GridColDef[] = [
        { field: 'name', headerName: 'Display Name', width: 200, valueGetter: displayName, filterOperators },
        { field: 'email', headerName: 'Google / Email', width: 240, valueGetter: googleEmail, filterOperators },
        { field: 'msEmail', headerName: 'UNT Email', width: 260, filterOperators },
        { field: 'msName', headerName: 'UNT Name', width: 200, filterOperators },
        { field: 'id', headerName: 'User ID', width: 240, filterOperators },
    ];

    const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
        setFilterValue(filterModel.items[0]);
    }, []);

    const handleSortModelChange = (newModel: GridSortModel) => {
        setSortModel(newModel);
    };

    useEffect(() => {
        (async () => {
            setRowsState((prev) => ({ ...prev, loading: true }));

            const sort = sortModel[0] ? sortModel[0].field : null;
            const reverse = sortModel[0] ? sortModel[0].sort === 'desc' : false;
            const filter = filterValue && filterValue.value ? filterValue : null;

            if (!sort) {
                setSortModel([{ field: 'name', sort: 'asc' }]);
                return;
            }

            const rowsRes = await getMicrosoftAccounts(1, rowsState.pageSize, sort, reverse, filter);
            if (rowsRes.status !== 200) {
                setPopupEvent(
                    createPopupEvent('Error fetching UNT accounts. Please check your connection.', 4),
                );
                return;
            }
            setRowsState((prev) => ({ ...prev, rows: rowsRes.data.docs, page: 0, loading: false }));
            setRowCount(rowsRes.data.totalPages * 10);
        })();
    }, [sortModel, filterValue]);

    useEffect(() => {
        if (rowCount === 0) return;

        (async () => {
            setRowsState((prev) => ({ ...prev, loading: true }));

            const sort = sortModel[0] ? sortModel[0].field : null;
            const reverse = sortModel[0] ? sortModel[0].sort === 'desc' : false;
            const filter = filterValue && filterValue.value ? filterValue : null;

            const newRowsRes = await getMicrosoftAccounts(rowsState.page + 1, rowsState.pageSize, sort, reverse, filter);
            if (newRowsRes.status !== 200) {
                setPopupEvent(createPopupEvent('Error fetching UNT accounts', 4));
                return;
            }

            setRowsState((prev) => ({ ...prev, loading: false, rows: newRowsRes.data.docs }));
        })();
    }, [rowsState.page, rowsState.pageSize]);

    return (
        <React.Fragment>
            <Popup event={popupEvent} />
            {rowsState.rows.length === 0 && !rowsState.loading ? (
                <Typography sx={{ textAlign: 'center', marginTop: 2, color: 'text.secondary' }}>
                    No UNT accounts linked yet.
                </Typography>
            ) : null}
            <Box sx={{ marginTop: 2, height: 400 }}>
                <DataGrid
                    columns={msColumns}
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
                    sx={{ marginTop: 2 }}
                />
            </Box>
        </React.Fragment>
    );
};

export default MicrosoftAccounts;
