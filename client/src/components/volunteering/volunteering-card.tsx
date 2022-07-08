import React from 'react';
import { darkSwitchGrey } from '../../util/cssUtil';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FilterList from './filter-list';
import Link from '../shared/Link';

interface VolunteeringCardProps {
    /** Volunteering object */
    volunteering: Volunteering;
}

/**
 * A card displaying the image and basic info for a club
 */
const VolunteeringCard = (props: VolunteeringCardProps) => {
    return (
        <Card sx={{ margin: 'auto' }}>
            <CardActionArea sx={{ display: 'block' }}>
                <Link
                    href={`/volunteering/${props.volunteering.id}`}
                    sx={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                    <CardContent
                        sx={{
                            height: 350,
                            padding: 2,
                            paddingTop: 1.5,
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontSize: '1.1rem',
                                color: props.volunteering.filters.open ? 'primary.main' : 'error.main',
                            }}
                        >
                            {props.volunteering.filters.open ? 'Open' : 'Closed'}
                        </Typography>
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                overflow: 'hidden',
                                display: '-webkit-box !important',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                fontSize: '1.5rem',
                            }}
                        >
                            {props.volunteering.name}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: (theme) => darkSwitchGrey(theme),
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {props.volunteering.club}
                        </Typography>
                        <Typography
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {props.volunteering.description.replace(/\n/g, ' | ')}
                        </Typography>
                        <FilterList filters={props.volunteering.filters} />
                    </CardContent>
                </Link>
            </CardActionArea>
        </Card>
    );
};

export default VolunteeringCard;
