import React from 'react';
import NavLink from '../shared/navlink';
import { darkSwitchGrey } from '../../functions/util';
import { Volunteering } from '../../functions/entries';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FilterList from './filter-list';

/**
 * A card displaying the image and basic info for a club
 *
 * @param {object} props React props object
 * @param {Volunteering} props.volunteering Volunteering object
 */
const VolunteeringCard = (props) => {
    return (
        <Card sx={{ margin: 'auto' }}>
            <CardActionArea sx={{ display: 'block' }}>
                <NavLink
                    to={`/volunteering?id=${props.volunteering.id}`}
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
                </NavLink>
            </CardActionArea>
        </Card>
    );
};

export default VolunteeringCard;
