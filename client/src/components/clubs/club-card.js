import React from 'react';
import { darkSwitchGrey } from '../../functions/util';
import { Club } from '../../functions/entries';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import NavLink from '../shared/navlink';
import Image from '../shared/image';

/**
 * A card displaying the image and basic info for a club
 * Utilizes the MUI Card component, with the CardActionArea
 * wrapped in a NavLink to the club's page.
 *
 * @param {object} props React props object
 * @param {Club} props.club Club object
 */
const ClubCard = (props) => {
    return (
        <Card sx={{ margin: 'auto' }}>
            <CardActionArea sx={{ display: 'block' }}>
                <NavLink
                    to={`/clubs?id=${props.club.id}`}
                    sx={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                    <CardMedia>
                        <Image src={props.club.coverImgThumbnail} default="/default-cover.webp" sx={{ top: 0 }} />
                    </CardMedia>
                    <CardContent
                        sx={{
                            height: 250,
                            padding: 2,
                            paddingTop: 1.5,
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{ color: props.club.advised ? 'primary.main' : 'secondary.main' }}
                        >
                            {props.club.advised ? 'Advised' : 'Independent'}
                        </Typography>
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                overflow: 'hidden',
                                display: '-webkit-box !important',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                            }}
                        >
                            {props.club.name}
                        </Typography>
                        <Typography
                            sx={{
                                flexShrink: 1,
                                height: 'initial',
                                marginTop: 2,
                                overflow: 'hidden',
                                display: '-webkit-box !important',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 5,
                                color: (theme) => darkSwitchGrey(theme),
                            }}
                        >
                            {props.club.description}
                        </Typography>
                    </CardContent>
                </NavLink>
            </CardActionArea>
        </Card>
    );
};

export default ClubCard;
