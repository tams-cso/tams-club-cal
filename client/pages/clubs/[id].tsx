import React, { useEffect, useState } from 'react';
import type { Theme } from '@mui/material';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { getClub } from '../../src/api';
import { getAccessLevel, getParams } from '../../src/util/miscUtil';
import { darkSwitchGrey } from '../../src/util/cssUtil';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CustomImage from '../../src/components/shared/custom-image';
import Paragraph from '../../src/components/shared/paragraph';
import ExecCard from '../../src/components/clubs/exec-card';
import CommitteeCard from '../../src/components/clubs/committee-card';
import AddButton from '../../src/components/shared/add-button';
import PageWrapper from '../../src/components/shared/page-wrapper';
import Loading from '../../src/components/shared/loading';
import ResourceMeta from '../../src/components/meta/resource-meta';
import TitleMeta from '../../src/components/meta/title-meta';
import RobotBlockMeta from '../../src/components/meta/robot-block-meta';
import { AccessLevelEnum } from '../../src/types/enums';

// Style for "No resource" text
const emptyTextStyle: object = {
    textAlign: 'center',
    marginBottom: 12,
    color: (theme: Theme) => darkSwitchGrey(theme),
};

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const clubRes = await getClub(ctx.params.id as string);
    const level = await getAccessLevel(ctx);
    return {
        props: { club: clubRes.data, error: clubRes.status !== 200, level },
    };
};

/**
 * Displays a single club.
 */
const ClubDisplay = ({ club, error, level }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [links, setLinks] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    // When the club data is loaded, create the list of links
    useEffect(() => {
        // If the club is not loaded, do nothing.
        if (club === null) return;

        // Map the links in a club to a link object.
        setLinks(
            club.links.map((link) => (
                <Link
                    href={link}
                    variant="body1"
                    key={link}
                    target="_blank"
                    sx={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {link}
                </Link>
            ))
        );
    }, [club]);

    // If the user changes to the committees or execs tab,
    // update the state value to match.
    const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
        setTabValue(newValue);
    };

    // Return to the previous page, but preserve the view
    // that was paassed in the URL (ie. keep table view)
    const back = () => {
        const prevView = getParams('view');
        router.push(`/clubs${prevView ? `?view=${prevView}` : ''}`);
    };

    // Show error message if errored
    if (error) {
        return (
            <PageWrapper>
                <TitleMeta title="Clubs" path={'/clubs'} />
                <RobotBlockMeta />
                <Loading error sx={{ marginBottom: 4 }}>
                    Could not get club data. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <ResourceMeta
                resource="clubs"
                name={club.name}
                path={`/clubs/${club.id}`}
                description={club.description}
                imgSrc={club.coverImg}
            />
            <RobotBlockMeta />
            <Container sx={{ maxWidth: { xl: '50%', md: '75%', xs: '100%' } }}>
                <AddButton
                    color="secondary"
                    label="Club"
                    path={`/edit/clubs/${club.id}`}
                    edit
                    hidden={level < AccessLevelEnum.CLUBS}
                />
                <Card sx={{ marginBottom: 4 }}>
                    <CardMedia
                        sx={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                        }}
                    >
                        <CustomImage
                            src={club.coverImg}
                            default="/default-cover.webp"
                            sx={{ width: '100%', height: 'auto' }}
                        />
                    </CardMedia>
                    <CardContent sx={{ padding: 3 }}>
                        <Typography sx={{ color: club.advised ? 'primary.main' : 'secondary.main' }}>
                            {club.advised ? 'Advised' : 'Independent'}
                        </Typography>
                        <Typography variant="h1">{club.name}</Typography>
                        <Paragraph
                            text={club.description}
                            sx={{ marginTop: 2, color: (theme: Theme) => darkSwitchGrey(theme) }}
                        />
                        <Typography variant="h6">Links</Typography>
                        {links}
                        <Tabs
                            centered
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="secondary"
                            textColor="secondary"
                            aria-label="execs and committees tab"
                            sx={{ marginTop: 3 }}
                        >
                            <Tab label="Execs"></Tab>
                            <Tab label="Committees"></Tab>
                        </Tabs>
                        <Paper
                            elevation={0}
                            variant="outlined"
                            square
                            sx={{ paddingTop: 2, display: tabValue === 0 ? 'block' : 'none' }}
                        >
                            {club.execs.length === 0 ? (
                                <Typography sx={emptyTextStyle}>No execs...</Typography>
                            ) : (
                                club.execs.map((e) => <ExecCard exec={e} key={e.name}></ExecCard>)
                            )}
                        </Paper>
                        <Paper
                            elevation={0}
                            variant="outlined"
                            square
                            sx={{ paddingTop: 2, display: tabValue === 1 ? 'block' : 'none' }}
                        >
                            {club.committees.length === 0 ? (
                                <Typography sx={emptyTextStyle}>No committees...</Typography>
                            ) : (
                                club.committees.map((c) => <CommitteeCard committee={c} key={c.name}></CommitteeCard>)
                            )}
                        </Paper>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={back} sx={{ margin: 'auto' }}>
                            Back
                        </Button>
                    </CardActions>
                </Card>
            </Container>
        </PageWrapper>
    );
};

export default ClubDisplay;
