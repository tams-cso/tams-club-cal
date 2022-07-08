import React, { useEffect, useState } from 'react';
import { createConnectionErrorPopup } from '../../util/constructors';
import { formatDate } from '../../util/datetime';
import { getFeedback } from '../../api';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Popup from '../shared/popup';
import Paragraph from '../shared/paragraph';
import Loading from '../shared/loading';

const ViewFeedback = () => {
    const [feedback, setFeedback] = useState<Feedback[]>(null);
    const [popupEvent, setPopupEvent] = useState<PopupEvent>(null);

    useEffect(() => {
        (async () => {
            const feedbackRes = await getFeedback();
            if (feedbackRes.status !== 200) {
                setPopupEvent(createConnectionErrorPopup());
                return;
            }

            setFeedback(feedbackRes.data);
        })();
    }, []);

    return feedback ? (
        <TableContainer sx={{ marginBottom: 4 }}>
            <Popup event={popupEvent} />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Feedback</TableCell>
                        <TableCell>Submitter</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {feedback.map((entry, i) => (
                        <TableRow key={i}>
                            <TableCell>{formatDate(entry.time, 'MM/DD/YYYY H:mma')}</TableCell>
                            <TableCell>
                                <Paragraph text={entry.feedback} />
                            </TableCell>
                            <TableCell>{entry.name ? entry.name : 'Annonymous'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    ) : (
        <Loading sx={{ marginBottom: 4 }} />
    );
};

export default ViewFeedback;
