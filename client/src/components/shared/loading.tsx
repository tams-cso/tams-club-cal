import React from 'react';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

interface LoadingProps extends React.HTMLProps<HTMLDivElement> {
    /** If true, shows error message -> passed in as children to the component */
    error?: boolean;

    /** No elevation on loading card if true */
    flat?: boolean;

    /** Format the Container component */
    sx?: object;
}

/**
 * Loading screen for all data, as well as an error message display
 * if the error field is defined.
 */
const Loading = (props: LoadingProps) => {
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
