import mongoose from 'mongoose';

const externalLinksSchema = new mongoose.Schema(
    {
        examCalendar: String,
        academicsGuide: String,
        clubLeaderResources: String,
        tamsWiki: String,
        addCalendar: String,
        addStagingCalendar: String,
    },
    { collection: 'external-links' }
);

const ExternalLinks = mongoose.model('External Links', externalLinksSchema);

export default ExternalLinks;
