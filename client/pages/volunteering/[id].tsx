import React from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { getVolunteering } from '../../src/api';
import { getAccessLevel, getParams } from '../../src/util/miscUtil';
import { darkSwitchGrey } from '../../src/util/cssUtil';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Hidden from '@mui/material/Hidden';
import Loading from '../../src/components/shared/loading';
import FilterList from '../../src/components/volunteering/filter-list';
import Paragraph from '../../src/components/shared/paragraph';
import AddButton from '../../src/components/shared/add-button';
import PageWrapper from '../../src/components/shared/page-wrapper';
import ResourceMeta from '../../src/components/meta/resource-meta';
import TitleMeta from '../../src/components/meta/title-meta';
import RobotBlockMeta from '../../src/components/meta/robot-block-meta';
import { AccessLevelEnum } from '../../src/types/enums';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const volRes = await getVolunteering(ctx.params.id as string);
    const level = await getAccessLevel(ctx);
    return {
        props: { volunteering: volRes.data, error: volRes.status !== 200, level },
    };
};

/**
 * Displays a single volunteering opportunity.
 * This component takes in the event ID as a parameter.
 */
const VolunteeringDisplay = ({
    volunteering,
    error,
    level,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    // Return to the previous page, but preserve the view
    // that was paassed in the URL (ie. keep table view)
    const back = () => {
        const prevView = getParams('view');
        router.push(`/volunteering${prevView ? `?view=${prevView}` : ''}`);
    };

    // Show error message if errored
    if (error) {
        return (
            <PageWrapper>
                <TitleMeta title="Volunteering" path={'/volunteering'} />
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
                resource="volunteering"
                name={volunteering.name}
                path={`/volunteering/${volunteering.id}`}
                description={volunteering.description}
            />
            <Container sx={{ maxWidth: { xl: '50%', md: '75%', xs: '100%' } }}>
                <AddButton
                    color="secondary"
                    label="Volunteering"
                    path={`/edit/volunteering/${volunteering.id}`}
                    edit
                    hidden={level < AccessLevelEnum.CLUBS}
                />
                <Card>
                    <CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { lg: 'row', xs: 'column' },
                            }}
                        >
                            <Box
                                sx={{
                                    flexBasis: 'calc(50% - 24px)',
                                    flexShrink: 0,
                                    flexGrow: 1,
                                    paddingRight: 3,
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontSize: '1.1rem',
                                        color: volunteering.filters.open ? 'primary.main' : 'error.main',
                                    }}
                                >
                                    {volunteering.filters.open ? 'Open' : 'Closed'}
                                </Typography>
                                <Typography variant="h2">{volunteering.name}</Typography>
                                <Typography variant="subtitle1" sx={{ color: (theme) => darkSwitchGrey(theme) }}>
                                    {volunteering.club}
                                </Typography>
                                <Paragraph text={volunteering.description} />
                            </Box>
                            <Hidden mdDown>
                                <Divider orientation="vertical" flexItem />
                            </Hidden>
                            <FilterList
                                filters={volunteering.filters}
                                sx={{
                                    flexBasis: '50%',
                                    flexShrink: 0,
                                    flexGrow: 1,
                                }}
                            />
                        </Box>
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

export default VolunteeringDisplay;
