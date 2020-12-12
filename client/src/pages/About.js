import React from 'react';
import LinkBox from '../components/LinkBox';
import './About.scss';

class About extends React.Component {
    render() {
        return (
            <div className="About">
                <div className="about-header">TAMS Club Calendar</div>
                <div className="text-area">
                    Welcome to the TAMS Club Calendar! This is a simple web app that displays all the student
                    organization events at TAMS, along with a list of clubs and other resources. Our vision is a
                    community-maintained resource that’s avaliable to anyone and can be updated by anyone as well. This
                    project will use a MERN stack, hosted on a DigitalOcean Droplet.
                </div>
                <div className="link-container">
                    <LinkBox href="https://github.com/MichaelZhao21/tams-club-cal">Github Repository</LinkBox>
                    <LinkBox href="https://www.figma.com/file/yp3mDSciGjMZBZknjbog49/TAMS-Club-Calendar?node-id=0%3A1">
                        Figma - Design Mockup
                    </LinkBox>
                </div>
                <div className="text-area">
                    We would love to hear what you think and what ideas you would like to see! Here’s the form for any
                    bugs, comments, suggestions, and anything else you would like us to know!
                </div>
                <div className="about-header">Feedback</div>
                <form action="">
                    <input type="text" id="feedback" name="feedback" placeholder="Enter feedback here..." />
                    <br />
                    <input type="submit" value="Submit" onClick={() => {alert("Did you really think this would work right now?!?!")}} />
                </form>
            </div>
        );
    }
}

export default About;
