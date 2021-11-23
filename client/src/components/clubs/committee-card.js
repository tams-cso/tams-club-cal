import React from 'react';
import { darkSwitchGrey } from '../../functions/util';
import { Committee } from '../../functions/entries';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Paragraph from '../shared/paragraph';

/**
 * Displays the information for a club's committee
 *
 * @param {object} props React props object
 * @param {Committee} props.committee The committee to display
 * @returns
 */
const CommitteeCard = (props) => {
    return (
        <Card
            elevation={3}
            sx={{
                margin: 2,
                marginTop: 0,
                padding: 2,
            }}
        >
            <Typography
                variant="h2"
                sx={{
                    fontSize: '1.75rem',
                    lineHeight: 1.1,
                    marginBottom: 1,
                }}
            >
                {props.committee.name}
            </Typography>
            <Paragraph text={props.committee.description} sx={{ color: (theme) => darkSwitchGrey(theme) }} />
            {props.committee.links.map((link) => (
                <Link
                    href={link}
                    key={link}
                    target="_blank"
                    underline="hover"
                    sx={{ display: 'block', width: 'max-content', fontSize: '0.85rem', color: 'primary.dark' }}
                >
                    {link}
                </Link>
            ))}
        </Card>
    );
};

export default CommitteeCard;
