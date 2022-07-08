import React from 'react';
import type { Theme } from '@mui/material';
import { darkSwitchGrey } from '../../util/cssUtil';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Paragraph from '../shared/paragraph';

interface CommitteeCardProps {
    /** The committee to display */
    committee: Committee;
}

/**
 * Displays the information for a club's committee
 */
const CommitteeCard = (props: CommitteeCardProps) => {
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
            <Typography variant="h3" sx={{ fontWeight: 300 }}>
                {props.committee.heads.length > 0 ? `Heads: ${props.committee.heads.join(', ')}` : null}
            </Typography>
            <Paragraph
                text={props.committee.description}
                sx={{ color: (theme: Theme) => darkSwitchGrey(theme), marginTop: 2 }}
            />
            {props.committee.links.map((link) => (
                <Link
                    href={link}
                    key={link}
                    target="_blank"
                    underline="hover"
                    sx={{ display: 'block', width: 'max-content', fontSize: '0.85rem', color: 'primary' }}
                >
                    {link}
                </Link>
            ))}
        </Card>
    );
};

export default CommitteeCard;
