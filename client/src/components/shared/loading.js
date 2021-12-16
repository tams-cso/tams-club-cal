import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

/**
 * Loading screen for all data, as well as an error message display
 * if the error field is defined.
 *
 * @param {object} props React props object
 * @param {boolean} props.error If true, shows error message
 * @param {string} props.children The error message
 * @param {boolean} [props.flat] True for no elevation
 * @param {object} [props.sx] Format the container element
 */
const Loading = (props) => {
    return (
        <Container sx={props.sx}>
            <Card
                elevation={props.flat ? 0 : 2}
                sx={{
                    margin: { lg: '0 20%', xs: 0 },
                    padding: 3,
                }}
            >
                {props.error ? (
                    <React.Fragment>
                        <Typography variant="h1" sx={{ textAlign: 'center' }}>
                            ERROR :(
                        </Typography>
                        <Typography sx={{ textAlign: 'center' }}>{props.children}</Typography>
                    </React.Fragment>
                ) : (
                    <Typography variant="h1" sx={{ textAlign: 'center' }}>
                        Loading...
                    </Typography>
                )}
            </Card>
        </Container>
    );
};

export default Loading;
