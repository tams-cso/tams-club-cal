import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { getParams } from '../../../../src/util/miscUtil';
import { calculateEditDate } from '../../../../src/util/datetime';
import { darkSwitch } from '../../../../src/util/cssUtil';
import { getHistory } from '../../../../src/api';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Loading from '../../../../src/components/shared/loading';
import HistoryPopup from '../../../../src/components/edit/history/history-popup';
import EditWrapper from '../../../../src/components/edit/shared/edit-wrapper';
import Link from '../../../../src/components/shared/Link';
import ResourceMeta from '../../../../src/components/meta/resource-meta';
import RobotBlockMeta from '../../../../src/components/meta/robot-block-meta';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const id = ctx.params.id as string;
    const resource = ctx.params.resource as Resource;
    const historyRes = await getHistory(resource, id);
    const historyList = historyRes.status === 200 ? historyRes.data.history : null;
    const error = historyRes.status !== 200;
    const editId = ctx.query.editId as string;
    return {
        props: {
            historyList: error ? [] : historyList,
            name: error ? '' : (historyRes.data.name as string),
            editorList: error ? [] : historyRes.data.editorList,
            error,
            resource,
            id,
            editId,
        },
    };
};

/**
 * Displays a list of history entries for a specific object.
 * /edit/history/:resource will route to this component.
 */
const HistoryDisplay = ({
    historyList,
    name,
    editorList,
    error,
    resource,
    id,
    editId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [components, setComponents] = useState(null);
    const [currHistory, setCurrHistory] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);

    // When the history list is updated, create the table rows (edit history entries)
    useEffect(() => {
        (async () => {
            if (error) return;

            // Create the table rows and set the component list to the state variable
            setComponents(
                historyList.map((history: History, i: number) => (
                    <TableRow
                        onClick={openPopup.bind(this, i)}
                        key={i}
                        sx={{
                            transition: '0.3s',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: (theme) =>
                                    darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[700]),
                            },
                        }}
                    >
                        <TableCell>{calculateEditDate(history.time)}</TableCell>
                        <TableCell>
                            {i === historyList.length - 1
                                ? 'Resource created'
                                : `${history.fields.length} fields were updated`}
                        </TableCell>
                        <TableCell>{editorList[i]}</TableCell>
                    </TableRow>
                ))
            );
        })();
    }, [historyList]);

    // Open popup on load if editId is defined
    useEffect(() => {
        if (editId) {
            const ind = historyList.findIndex((entry) => entry.id === editId);
            if (ind != -1) {
                setCurrHistory(ind);
                setPopupOpen(true);
            }
        }
    }, []);

    // Opens the popup for a single edit when clicked
    const openPopup = (index: React.MouseEventHandler<HTMLTableRowElement>) => {
        setCurrHistory(index);
        setPopupOpen(true);
    };

    // Returns the user to the pervious page
    // If the user was on the edit page, return them there, or else return them to the edit page for the resource
    const back = () => {
        const view = getParams('view');
        if (view) router.push('/edit');
        else router.push(`/edit/${resource}/${id}`);
    };

    return (
        <EditWrapper>
            <ResourceMeta
                resource={resource}
                name={name}
                path={`/edit/${resource}/${id}`}
                description={`Edit history for ${name} (${resource})`}
                editHistory
            />
            <RobotBlockMeta />
            <TableContainer>
                {components === null ? (
                    error ? (
                        <Loading error flat>
                            Invalid {resource} ID. Please return to the home page and check the ID. The resource you are
                            trying to see the edit history for might be deleted. Please contact the site administrator
                            if you believe that this error is incorrect.
                        </Loading>
                    ) : (
                        <Loading />
                    )
                ) : (
                    <React.Fragment>
                        <Typography
                            variant="h1"
                            sx={{
                                textAlign: 'center',
                                marginBottom: 1.5,
                            }}
                        >
                            {`Edit History for ${name}`}
                        </Typography>
                        <Link href={`/edit/${resource}/${id}`} sx={{ textAlign: 'center', display: 'block' }}>
                            Edit this resource
                        </Link>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Edits</TableCell>
                                    <TableCell>Editor</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{components}</TableBody>
                        </Table>
                        <HistoryPopup
                            history={historyList[currHistory]}
                            name={name}
                            open={popupOpen}
                            close={setPopupOpen.bind(this, false)}
                        />
                        <Button
                            onClick={back}
                            sx={{
                                margin: 'auto',
                                marginTop: 12,
                                display: 'block',
                            }}
                        >
                            Back
                        </Button>
                    </React.Fragment>
                )}
            </TableContainer>
        </EditWrapper>
    );
};

export default HistoryDisplay;
