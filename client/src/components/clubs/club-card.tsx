import React from 'react';
import { darkSwitchGrey } from '../../util/cssUtil';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '../shared/Link';
import CustomImage from '../shared/custom-image';

interface ClubCardProps {
    /** The club object to display */
    club: Club;
}

/**
 * A card displaying the image and basic info for a club
 * Utilizes the MUI Card component, with the CardActionArea
 * wrapped in a NavLink to the club's page.
 */
const ClubCard = (props: ClubCardProps) => {
    return (
        <Card sx={{ margin: 'auto' }}>
            <CardActionArea sx={{ display: 'block' }}>
                <Link
                    href={`/clubs/${props.club.id}`}
                    sx={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                    <CardMedia>
                        <CustomImage src={props.club.coverImgThumbnail} default="/default-cover.webp" sx={{ top: 0 }} />
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
                </Link>
            </CardActionArea>
        </Card>
    );
};

export default ClubCard;
