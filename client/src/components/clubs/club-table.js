import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { darkSwitch } from '../../functions/util';
import { Club, Volunteering } from '../../functions/entries';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
                        <TableRow
                            component={Link}
                            to={`/clubs?id=${v.id}&view=list`}
                            className={classes.tableLink}
                        >
                            <TableCell>
                                <Image src={v.coverImgThumbnail} default="/default-cover.webp" alt="cover image" raised />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {v.name}
                            </TableCell>
                            <TableCell>{v.advised ? 'Advised' : 'Independent'}</TableCell>
                            <TableCell>{v.description.replace(/\n/g, ' | ')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClubTable;
