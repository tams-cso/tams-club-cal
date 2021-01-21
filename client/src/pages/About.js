import React from 'react';

import LinkBox from '../components/LinkBox';

import { postFeedback } from '../functions/api';

import './About.scss';

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = { feedbackValue: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ feedbackValue: event.target.value });
    }

    handleSubmit() {
        postFeedback(this.state.feedbackValue.trim()).then((status) => {
            if (status == 200) this.setState({ feedbackValue: '' });
            alert(status == 200 ? 'Thank you for your feedback!' : 'Submitting feedback failed :((');
        });
    }

    render() {
        return (
            <div className="about">
                <h1 className="about-header">TAMS Club Calendar</h1>
                <div className="about-info-p">
                    Welcome to the TAMS Club Calendar! This is a simple web app that displays all the student
                    organization events at TAMS, along with a list of clubs and other resources. Our vision is a
                    community-maintained resource that’s avaliable to anyone and can be updated by anyone as well.
                </div>
                <br />
                <div className="about-info-p">
                    We are an open-source project, meaning that anyone and everyone can help contribute to the
                    development of the website! Below is a link to the Github repository where this project is being
                    hosted. There is more information on that page on how to contribute and help code. If you can't code
                    and still want to help, there is a feedback form below where you can write whatever you would like!
                    The way programs like these get better is through independent user feedback. Thank you once again
                    for checking out tams.club, and we hope you enjoy the rest of your day! :D
                </div>
                <div className="about-link-container">
                    <LinkBox className="about-link-box" href="https://github.com/MichaelZhao21/tams-club-cal">
                        Github Repository
                    </LinkBox>
                </div>
                <h1 className="feedback-header">Feedback</h1>
                <div className="about-info-p">
                    We would love to hear what you think and what ideas you would like to see! Here’s the form for any
                    bugs, comments, suggestions, and anything else you would like us to know!
                </div>
                <textarea
                    id="feedback-form"
                    placeholder="Enter feedback here..."
                    value={this.state.feedbackValue}
                    onChange={this.handleChange}
                />
                <div className="center-div">
                    <input id="feedback-submit" type="submit" value="Submit" onClick={this.handleSubmit} />
                </div>
            </div>
        );
    }
}

export default About;
