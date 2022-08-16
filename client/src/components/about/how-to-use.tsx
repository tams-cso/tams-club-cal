import React from 'react';
import Typography from '@mui/material/Typography';
import Paragraph from '../shared/paragraph';
import { darkSwitch } from '../../util/cssUtil';

import data from '../../data.json';

const HowToUse = () => {
    return (
        <React.Fragment>
            {data.howToUse.map((entry, i) => (
                <React.Fragment key={i}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: (theme) => (i % 2 === 0 ? theme.palette.primary.main : theme.palette.secondary.main),
                            fontSize: '1.75rem',
                            marginBottom: '0.5rem',
                            marginTop: '1.5rem',
                        }}
                    >
                        {entry.section}
                    </Typography>
                    <Paragraph text={entry.text} fontSize="1.125rem" sx={{ color: (theme) => darkSwitch(theme, theme.palette.grey[800], theme.palette.grey[400]) }} />
                </React.Fragment>
            ))}
        </React.Fragment>
    );
};

export default HowToUse;
