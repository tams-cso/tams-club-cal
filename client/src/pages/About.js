import React from 'react';
import { postFeedback } from '../functions/api';
import logo from '../files/logo-banner.png';
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

    async handleSubmit() {
        const res = await postFeedback(this.state.feedbackValue.trim());
        if (res.status == 200) {
            this.setState({ feedbackValue: '' });
            alert('Thank you for your feedback!');
        }
        else alert('Could not submit feedback :(');
    }

    render() {
        return (
            <div className="about">
                <img className="about-header" alt="TAMS Club Calendar" src={logo}></img>
                <div className="about-info-p">
                    Welcome to the TAMS Club Calendar! This is a simple web app that displays all the student
                    organization events at TAMS, along with a list of clubs and other resources. Our vision is a
                    community-maintained resource that’s avaliable to anyone and can be updated by anyone as well.
                </div>
                <div className="about-info-p">
                    We are an open-source project, meaning that anyone and everyone can help contribute to the
                    development of the website! You can go to the&nbsp;
                    <b>
                        <a href="https://github.com/MichaelZhao21/tams-club-cal">Github repository</a>
                    </b>
                    &nbsp;where this project is being hosted. There is more information on that page on how to
                    contribute and help code. If you can't code and still want to help, there is a feedback form below
                    where you can write whatever you would like! The way programs like these get better, after all, is
                    through independent user feedback. Thank you once again for checking out tams.club, and we hope you
                    enjoy the rest of your day! :D
                </div>
                <h1 className="feedback-header">Feedback</h1>
                <div className="about-info-p">
                    We would love to hear what you think and what ideas you would like to see! Here’s the form for any
                    bugs, comments, suggestions, and anything else you would like us to know!
                </div>
                <div className="center-div">
                    <textarea
                        id="feedback-form"
                        placeholder="Enter feedback here..."
                        value={this.state.feedbackValue}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="center-button">
                    <input id="feedback-submit" type="submit" value="Submit" onClick={this.handleSubmit} />
                </div>
            </div>
        );
    }
}

export default About;
