import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getClubList } from '../../src/api';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ClubCard from '../../src/components/clubs/club-card';
import ClubTable from '../../src/components/clubs/club-table';
import Loading from '../../src/components/shared/loading';
import AddButton from '../../src/components/shared/add-button';
import ViewSwitcher from '../../src/components/shared/view-switcher';
import SortSelect from '../../src/components/shared/sort-select';
import PageWrapper from '../../src/components/shared/page-wrapper';
import TitleMeta from '../../src/components/meta/title-meta';
import { getAccessLevel } from '../../src/util/miscUtil';
import { AccessLevelEnum } from '../../src/types/enums';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const clubRes = await getClubList();
    const level = await getAccessLevel(ctx);
    return {
        props: { clubList: clubRes.data, error: clubRes.status !== 200, level },
    };
};

/**
 * The ClubList component displays a list of cards, each of which
 * contains a summary of each club and links to that specific club.
 */
const ClubList = ({ clubList, error, level }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [clubCardList, setClubCardList] = useState(<Loading />);
    const [tableView, setTableView] = useState(false);
    const [sort, setSort] = useState('name');
    const [reverse, setReverse] = useState(false);

    // Update the club component list when the club list changes
    useEffect(() => {
        if (error) return;

        // Sort the list of clubs using a custom sorting method
        // We sort by advised first then sorting method (only name for now)
        const sortedList = clubList.sort((a, b) => {
            if (a.advised !== b.advised) return a.advised ? -1 : 1;
            return (reverse ? -1 : 1) * a[sort].localeCompare(b[sort]);
        });

        // Create a list of ClubCard components from the sorted list
        setClubCardList(
            <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                {sortedList.map((c) => (
                    <Grid item xs={12} sm={6} lg={4} key={c.name} sx={{ flexGrow: { lg: 1, xs: 0 } }}>
                        <ClubCard club={c} />
                    </Grid>
                ))}
            </Grid>
        );
    }, [clubList, reverse]);

    // Return error if bad
    if (error) {
        return (
            <PageWrapper>
                <Loading error>
                    Could not get club list. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <TitleMeta title="Clubs" path="/clubs" />
            <Container maxWidth={false} sx={{ maxWidth: 1280 }}>
                <Box
                    width="100%"
                    marginBottom={2}
                    display="flex"
                    alignItems="center"
                    height={48}
                    justifyContent="flex-end"
                >
                    <SortSelect
                        value={sort}
                        setValue={setSort}
                        reverse={reverse}
                        setReverse={setReverse}
                        options={['name']}
                    />
                    <ViewSwitcher tableView={tableView} setTableView={setTableView} />
                </Box>
                <AddButton color="primary" label="Club" path="/edit/clubs" hidden={level < AccessLevelEnum.CLUBS} />
                {tableView ? <ClubTable clubs={clubList} /> : clubCardList}
            </Container>
        </PageWrapper>
    );
};

export default ClubList;
