import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getParams } from '../../util/miscUtil';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Hidden from '@mui/material/Hidden';
import PageWrapper from '../shared/page-wrapper';
import HomeDrawerList from './home-drawer-list';
import ActionBar from './action-bar';

// The width of the permanent drawer with external links
const drawerWidth = 280;

interface HomeBaseProps extends React.HTMLProps<HTMLDivElement> {
    /** Set to true to not show the drawer no matter what */
    noDrawer?: boolean;

    /** Set to true to not show the ActionBar */
    noActionBar?: boolean;

    /** Set to true to set height to 'unset' */
    unsetHeight?: boolean;

    /** Title to pass to PageWrapper */
    title?: string;
}

/**
 * Base for all home pages, contains an action bar and a drawer with external links
 * that both can be hidden manually.
 */
const HomeBase = (props: HomeBaseProps) => {
    return (
        <PageWrapper noBottom title={props.title}>
            <Hidden mdDown>
                {props.noDrawer ? null : (
                    <Drawer variant="permanent" sx={{ width: drawerWidth }}>
                        <Toolbar sx={{ width: drawerWidth, marginBottom: 0 }} />
                        <HomeDrawerList />
                    </Drawer>
                )}
            </Hidden>
            <Box
                display="flex"
                flexDirection="column"
                flexGrow={1}
                width={0}
                sx={{ height: props.unsetHeight ? 'unset' : 'max-content' }}
            >
                {props.noActionBar ? null : <ActionBar />}
                {props.children}
            </Box>
        </PageWrapper>
    );
};

export default HomeBase;
