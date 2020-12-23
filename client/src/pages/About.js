import React from 'react';
import LinkBox from '../components/LinkBox';
import './About.scss';

class About extends React.Component {
    render() {
        return (
            <div className="About">
                <h1 className="about-header">TAMS Club Calendar</h1>
                <div className="info-p">
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
                <h1 className="feedback-header">Feedback</h1>
                <div className="info-p">
                    We would love to hear what you think and what ideas you would like to see! Here’s the form for any
                    bugs, comments, suggestions, and anything else you would like us to know!
                </div>
                <form>
                    <textarea id="feedback-form" name="feedback" placeholder="Enter feedback here..." />
                    <div className="center-div">
                        <input
                            id="feedback-submit"
                            type="submit"
                            value="Submit"
                            onClick={() => {
                                this.props.history.push('/about-callback');
                            }}
                        />
                    </div>
                </form>
            </div>
        );
    }
}

export default About;
