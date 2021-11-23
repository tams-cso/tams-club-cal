import React from 'react';
import { Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { darkSwitch } from '../../functions/util';
import { Club } from '../../functions/entries';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Image from '../shared/image';

const useStyles = makeStyles((theme) => ({
    tableLink: {
        textDecoration: 'none',
        color: 'inherit',
        transition: '0.3s',
        '&:hover': {
            backgroundColor: darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[700]),
        },
    },
    advised: {
        color: theme.palette.primary.main,
    },
    independent: {
        color: theme.palette.secondary.main,
    },
}));

/**
 * Displays the clubs in a table
 *
 * @param {object} props React props object
 * @param {Club[]} props.clubs Club list
 */
const ClubTable = (props) => {
    const classes = useStyles();
    return (
        <TableContainer component={Paper}>
            <Table aria-label="club table">
                <TableHead>
                    <TableRow>
                        <TableCell>Cover</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Advised</TableCell>
                        <TableCell>Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.clubs.map((v) => (
                        <TableRow component={Link} to={`/clubs?id=${v.id}&view=list`} className={classes.tableLink}>
                            <TableCell>
                                <Image
                                    src={v.coverImgThumbnail}
                                    default="/default-cover.webp"
                                    alt="cover image"
                                    raised
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {v.name}
                            </TableCell>
                            <TableCell className={v.advised ? classes.advised : classes.independent}>
                                {v.advised ? 'Advised' : 'Independent'}
                            </TableCell>
                            <TableCell>{v.description.replace(/\n/g, ' | ')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClubTable;
