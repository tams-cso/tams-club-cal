import React, { useEffect, useState } from 'react';
import { darkSwitch } from '../../util/cssUtil';
import type { Theme } from '@mui/material';
import { styled } from '@mui/system';

import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../shared/Link';
import StyledSpan from '../shared/styled-span';
import { useRouter } from 'next/router';

// Styled Components for formatting the SVG
const StyledRect = styled('rect')``;
const StyledPath = styled('path')``;
const StyledPolygon = styled('polygon')``;
const StyledLine = styled('line')``;

// Round paths in svg
const roundStyles = {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

// Create styles for the different strokes in the svg
const svgStyles = {
    a: {
        fill: '#7cc466',
        stroke: '#231f20',
        ...roundStyles,
    },
    b: {
        fill: '#a2d395',
        stroke: '#231f20',
        ...roundStyles,
    },
    c: {
        fill: '#c6e3be',
        stroke: '#231f20',
        ...roundStyles,
    },
    d: {
        fill: 'none',
        strokeWidth: '1.5px',
        stroke: '#231f20',
        ...roundStyles,
    },
};

// Color functions for title/staging text
const titleColor = (theme: Theme) => darkSwitch(theme, theme.palette.common.black, theme.palette.primary.main);
const stagingColor = (theme: Theme) => darkSwitch(theme, theme.palette.error.light, theme.palette.error.main);

interface AppIconProps {
    /** Won't display logo text if true */
    noText?: boolean;

    /** Style the Link component */
    sx?: object;
}

/**
 * Displays the app icon and text
 *
 * @param {object} props React props object
 * @param {boolean} props.noText Won't display logo text if true
 * @param {object} [props.sx] Style the AppIcon component
 */
function AppIcon(props: AppIconProps) {
    const [prod, setProd] = useState(false);

    useEffect(() => {
        setProd(window.location.origin === 'https://tams.club');
    }, []);

    return (
        <Link href="/" sx={{ textDecoration: 'none', ...props.sx }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <SvgIcon viewBox="0 0 39.53 29.56" titleAccess="app-icon" fontSize="large" sx={{ fontSize: '3rem' }}>
                    <StyledRect sx={svgStyles.a} x="3.14" y="0.5" width="25.92" height="25.92" />
                    <StyledPolygon sx={svgStyles.b} points="0.5 3.14 3.14 0.5 3.14 26.42 0.5 29.06 0.5 3.14" />
                    <StyledPolygon sx={svgStyles.c} points="26.42 29.06 29.06 26.42 3.14 26.42 0.5 29.06 26.42 29.06" />
                    <StyledPath sx={svgStyles.b} d="M29.08.5c0,12.52,10,21.89,10,21.89H13.11S3.15,13,3.15.5Z" />
                    <StyledPolygon
                        sx={{ fill: '#fff' }}
                        points="9.78 8.46 26.41 8.44 27.46 11.23 28.93 14.24 30.06 16.16 30.37 17.65 29.06 18.71 24.57 18.85 17.69 18.71 14.98 17.77 13.15 15.44 10.35 10.56 9.78 8.46"
                    />
                    <StyledPolygon
                        sx={{ fill: '#fdc179' }}
                        points="9.78 8.46 26.41 8.44 25.6 5.71 23.92 4.25 18.62 4.01 11.92 4.12 9.7 5.46 9.41 7.79 9.78 8.46"
                    />
                    <StyledPath
                        sx={svgStyles.d}
                        d="M29.37,15c.64,1.13,3.12,3.81-2.87,3.81H18.84c-3.65,0-4.15-1.35-5.39-3l0,0A25.58,25.58,0,0,1,9.59,8.46v0S7.89,4,13.24,4h7.4c3.16,0,4.9.58,5.37,2.79C26.53,9.86,28.73,13.91,29.37,15Z"
                    />
                    <StyledLine sx={svgStyles.d} x1="26.41" y1="8.44" x2="9.58" y2="8.44" />
                    <StyledLine sx={svgStyles.d} x1="12.16" y1="13.34" x2="28.44" y2="13.34" />
                    <StyledPath sx={svgStyles.d} d="M14.29,8.46c0,3.09,3.1,7.66,5.35,10.39" />
                    <StyledPath sx={svgStyles.d} d="M22.28,8.58c.78,4.28,5.31,10.2,5.31,10.2" />
                    <StyledPath sx={svgStyles.d} d="M18.38,8.46c0,3.09,2.89,7.51,5.13,10.25" />
                </SvgIcon>
                {props.noText ? null : (
                    <Typography
                        variant="h5"
                        sx={{
                            marginLeft: '1rem',
                            color: titleColor,
                        }}
                    >
                        TAMS Club Calendar
                        {prod ? null : <StyledSpan sx={{ color: stagingColor }}>{'  '}[STAGING]</StyledSpan>}
                    </Typography>
                )}
            </Box>
        </Link>
    );
}

export default AppIcon;
