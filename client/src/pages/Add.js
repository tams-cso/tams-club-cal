import React from 'react';
import { postEvent } from '../functions/api';
import { Event } from '../functions/entries';
import './Add.scss';

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            clubName: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            link: '',
            description: '',
            addedBy: '',
        };
    }

    handleInputChange(event) {}

    add() {
        postEvent(
            new Event(
                'Event',
                'New Committee GA',
                'HOPE',
                '11/09/20',
                '11/09/20',
                '19:00',
                '20:00',
                'https://unt.zoom.us/j/96695787300',
                'Heyo HOPEfuls! Are you looking...',
                'Michael Zhao'
            )
        );
    }

    render() {
        return (
            <div className="Add">
                {/* Temporary button to test backend */}
                <button onClick={this.add}>Add Event (New Committee GA by HOPE)</button>
            </div>
        );
    }
}

export default Add;
