import React from 'react';
import Typography from '@mui/material/Typography';
import Paragraph from '../shared/paragraph';
import { darkSwitchGrey } from '../../util/cssUtil';

import data from '../../data.json';

const HowToUse = () => {
    return (
        <React.Fragment>
            {data.howToUse.map((entry) => (
                <React.Fragment>
                    <Typography
                        variant="h3"
                        sx={{
                            color: (theme) => theme.palette.primary.main,
                            fontSize: '1.5rem',
                            marginBottom: '0.5rem',
                        }}
                    >
                        {entry.section}
                    </Typography>
                    <Paragraph text={entry.text} sx={{ color: (theme) => darkSwitchGrey(theme) }} />
                </React.Fragment>
            ))}
        </React.Fragment>
    );
};

export default HowToUse;
