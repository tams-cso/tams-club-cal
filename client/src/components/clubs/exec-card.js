import React from 'react';
import { darkSwitchGrey } from '../../functions/util';
import { Exec } from '../../functions/entries';

import Box from '@mui/material/Box';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';
import Image from '../shared/image';
import Paragraph from '../shared/paragraph';

/**
 * Displays the information for an exec of a club
 * using nested Box components.
 *
 * @param {object} props React props object
 * @param {Exec} props.exec The exec to display
 * @returns
 */
const ExecCard = (props) => {
    return (
        <React.Fragment>
            {/* TODO: Why can't I just do "padding: { xs: 1, lg: 2 }"" -> this will not retain "paddingTop: 0" */}
            <Box
                sx={{
                    width: '100%',
                    paddingLeft: { xs: 1, lg: 2 },
                    paddingRight: { xs: 1, lg: 2 },
                    paddingBottom: { xs: 1, lg: 2 },
                    paddingTop: 0,
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <Image
                    src={props.exec.img}
                    alt="profile pic"
                    default="/default-profile.webp"
                    raised
                    sx={{
                        marginRight: { xs: 1, lg: 2 },
                        flexBasis: '20%',
                        flexShrink: 0,
                        height: 'min-content',
                    }}
                ></Image>
                <Box className="exec-card-info">
                    <Typography
                        variant="h2"
                        sx={{
                            lineHeight: 1.1,
                            fontSize: { lg: '1.75rem', xs: '1.1rem' },
                        }}
                    >
                        {props.exec.name}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            marginBottom: 1,
                            fontSize: { lg: '1rem', xs: '0.85rem' },
                        }}
                    >
                        {props.exec.position}
                    </Typography>
                    <Hidden smDown>
                        <Paragraph
                            text={props.exec.description}
                            smallMargin
                            sx={{ fontSize: { xl: '1rem', xs: '0.75rem' }, color: (theme) => darkSwitchGrey(theme) }}
                        />
                    </Hidden>
                </Box>
            </Box>
            <Hidden smUp>
                <Paragraph
                    text={props.exec.description}
                    fontSize="0.75rem"
                    smallMargin
                    sx={{
                        paddingLeft: 1,
                        paddingBottom: 1,
                        color: (theme) => darkSwitchGrey(theme),
                    }}
                />
            </Hidden>
        </React.Fragment>
    );
};

export default ExecCard;
