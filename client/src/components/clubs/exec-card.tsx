import React from 'react';
import type { Theme } from '@mui/material';
import { darkSwitchGrey } from '../../util/cssUtil';

import Box from '@mui/material/Box';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';
import CustomImage from '../shared/custom-image';
import Paragraph from '../shared/paragraph';

interface ExecCardProps {
    /** The exec to display */
    exec: Exec;
}

/**
 * Displays the information for an exec of a club
 * using nested Box components.
 */
const ExecCard = (props: ExecCardProps) => {
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
                <CustomImage
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
                ></CustomImage>
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
                        color: (theme: Theme) => darkSwitchGrey(theme),
                    }}
                />
            </Hidden>
        </React.Fragment>
    );
};

export default ExecCard;
