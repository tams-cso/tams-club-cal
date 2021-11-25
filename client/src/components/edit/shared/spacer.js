import React from 'react';

import Box from '@mui/material/Box';

/**
 * Provides horizontal spacing on large screen sizes and vertical spacing on small screen sizes.
 */
const Spacer = () => {
    return <Box sx={{ width: { lg: 20, xs: 0 }, height: { lg: 0, xs: 16 } }} />;
};

export default Spacer;
