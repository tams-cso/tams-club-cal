import React from 'react';
import { Link } from 'react-router-dom';
import { darkSwitch, darkSwitchGrey } from '../../functions/util';
import { Club } from '../../functions/entries';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Image from '../shared/image';

/**
 * Displays the clubs in a table. The clubs prop will be mapped to table rows.
 * For descriptions, the newline character will be replaced with a pipe character.
 *
 * @param {object} props React props object
 * @param {Club[]} props.clubs Club list
 */
const ClubTable = (props) => {
    return (
        <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
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
                            to={`/clubs?id=${v.id}&view=table`}
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: '0.3s',
                                '&:hover': (theme) => ({
                                    backgroundColor: darkSwitch(
                                        theme,
                                        theme.palette.grey[200],
                                        theme.palette.grey[700]
                                    ),
                                }),
                            }}
                        >
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
                            <TableCell sx={{ color: v.advised ? 'primary.main' : 'secondary.main' }}>
                                {v.advised ? 'Advised' : 'Independent'}
                            </TableCell>
                            <TableCell sx={{ color: (theme) => darkSwitchGrey(theme) }}>
                                {v.description.replace(/\n/g, ' | ')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClubTable;
