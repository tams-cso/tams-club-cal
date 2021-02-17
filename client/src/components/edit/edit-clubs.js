import React from 'react';
import { getClub, postClub } from '../../functions/api';
import { Club, Committee, Exec } from '../../functions/entries';
import { compressUploadedImage, getParams, imgUrl, isActive } from '../../functions/util';
import ActionButton from '../shared/action-button';
import Loading from '../shared/loading';
import SubmitGroup from '../shared/submit-group';
import CommitteeEdit from './committee-edit';
import './edit-clubs.scss';
import ExecEdit from './exec-edit';
import ImageUpload from './image-upload';

class EditClubs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            club: null,
            new: false,
            name: '',
            advised: false,
            fb: '',
            website: '',
            coverImg: '',
            description: '',
            execs: null,
            committees: null,
            compressed: null,
            execBlobs: null,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleProfPicUpload = this.handleProfPicUpload.bind(this);
        this.handleExecChange = this.handleExecChange.bind(this);
        this.handleCommitteeChange = this.handleCommitteeChange.bind(this);
    }

    changeAdvised = () => {
        this.setState({ advised: !this.state.advised });
    };

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    };

    handleImageUpload = async (event) => {
        const compressed = await compressUploadedImage(event.target.files[0], 1728);
        const url = URL.createObjectURL(compressed);
        this.setState({ compressed, coverImg: url });
    };

    handleProfPicUpload = async (event) => {
        const compressed = await compressUploadedImage(event.target.files[0], 256);
        const url = URL.createObjectURL(compressed);
        const count = Number(event.target.name.substring(21));
        var execs = this.state.execs;
        var execBlobs = this.state.execBlobs;
        execs[count] = { ...this.state.execs[count], img: url };
        execBlobs[count] = compressed;
        this.setState({ execs, execBlobs });
    };

    handleExecChange = (event) => {
        const target = event.target;
        const count = Number(target.attributes.num.nodeValue);
        var execs = this.state.execs;
        execs[count] = { ...this.state.execs[count], [target.name]: target.value };
        this.setState({ execs });
    };

    handleCommitteeChange = (event) => {
        const target = event.target;
        const count = Number(target.attributes.num.nodeValue);
        var committees = this.state.committees;
        committees[count] = { ...this.state.committees[count], [target.name]: target.value };
        this.setState({ committees });
    };

    handleExecDelete = (num) => {
        var execs = this.state.execs;
        var execBlobs = this.state.execBlobs;
        if (confirm(`Are you sure you want to delete Exec #${num + 1}?`)) {
            execs.splice(num, 1);
            execBlobs.splice(num, 1);
            this.setState({ execs, execBlobs });
        }
    };

    addExec = () => {
        var execs = this.state.execs;
        var execBlobs = this.state.execBlobs;
        execs.push(new Exec());
        execBlobs.push(null);
        this.setState({ execs, execBlobs });
    };

    handleCommitteeDelete = (num) => {
        var committees = this.state.committees;
        if (confirm(`Are you sure you want to delete Committee #${num + 1}?`)) {
            committees.splice(num, 1);
            this.setState({ committees });
        }
    };

    addCommittee = () => {
        var committees = this.state.committees;
        committees.push(new Committee());
        this.setState({ committees });
    };

    submit = async () => {
        var invalid = this.testValid();

        // If there are invalid items
        if (invalid.length !== 0) {
            var invalidMessage = '';
            invalid.forEach((i) => (invalidMessage += `${i} cannot be empty!\n`));
            alert(invalidMessage);
            return;
        }

        var coverThumb = null;
        if (this.state.compressed) coverThumb = await compressUploadedImage(this.state.compressed, 432);

        var fullClub = new Club(
            this.state.name,
            this.state.advised,
            this.state.fb,
            this.state.website,
            this.state.club.coverImgThumbnail,
            this.state.club.coverImg,
            this.state.description,
            this.state.execs,
            this.state.committees,
            { img: this.state.compressed, thumb: coverThumb },
            this.state.execBlobs
        );

        // POST Club
        var res;
        if (this.state.new) {
            res = await postClub(fullClub);
        } else {
            // TODO: This is so we can delete the old exec images, but we should filter out only the image urls
            fullClub.oldExecs = this.state.club.execs;
            fullClub.oldCommittees = this.state.club.committees;
            res = await postClub(fullClub, this.state.club.objId);
        }

        // Get response and send to user
        if (res.status === 200) {
            alert(`Successfully ${this.state.new ? 'added' : 'edited'} club!`);
            this.props.parentHistory.push(`/clubs${window.location.search}`);
        } else alert(`${this.state.new ? 'Adding' : 'Editing'} club failed :(`);
    };

    testValid = () => {
        var invalid = [];
        if (this.state.name === '') invalid.push('Club Name');
        for (var i = 0; i < this.state.execs.length; i++) {
            if (this.state.execs[i].name === '') invalid.push(`Exec ${i + 1}'s Name`);
            if (this.state.execs[i].position === '') invalid.push(`Exec ${i + 1}'s Position`);
        }
        for (var i = 0; i < this.state.committees.length; i++) {
            if (this.state.committees[i].name === '') invalid.push(`Committee ${i + 1}'s Name`);
        }
        return invalid;
    };

    resetState = (club, isNew = false) => {
        this.setState({
            club,
            new: isNew,
            name: club.name,
            advised: club.advised,
            fb: club.fb,
            website: club.website,
            coverImg: club.coverImg,
            description: club.description,
            execs: [...club.execs],
            committees: [...club.committees],
            editedBy: '',
            execBlobs: Array(club.execs.length),
            compressed: null,
        });
    };

    async componentDidMount() {
        // Get id from url params
        const id = getParams('id');

        // Empty form if new
        if (id === null) {
            this.resetState(new Club(), true);
            return;
        }

        // Fill form with event
        const res = await getClub(id);

        if (res.status === 200) this.resetState(res.data);
        else {
            alert(`Could not get event with the requested ID '${id}'. Redirecting to 'new event' page`);
            window.location.href = `${window.location.origin}/edit/events`;
        }
    }

    render() {
        // Return loading if event not got
        if (this.state.club === null && !this.state.new) return <Loading></Loading>;

        var execEditList = [];
        for (var i = 0; i < this.state.execs.length; i++) {
            execEditList.push(
                <ExecEdit
                    num={i}
                    key={i}
                    exec={this.state.execs[i]}
                    onImgChange={this.handleProfPicUpload}
                    onChange={this.handleExecChange}
                    onDelete={this.handleExecDelete.bind(this, i)}
                ></ExecEdit>
            );
        }

        var committeeEditList = [];
        for (var i = 0; i < this.state.committees.length; i++) {
            committeeEditList.push(
                <CommitteeEdit
                    num={i}
                    key={i}
                    committee={this.state.committees[i]}
                    onChange={this.handleCommitteeChange}
                    onDelete={this.handleCommitteeDelete.bind(this, i)}
                ></CommitteeEdit>
            );
        }

        return (
            <div className="edit-clubs">
                <div className="edit-clubs-image-container">
                    <img className="edit-clubs-image" src={imgUrl(this.state.coverImg)} alt="cover image"></img>
                    <ImageUpload
                        name="coverImage"
                        className="edit-clubs-cover-photo-upload"
                        onChange={this.handleImageUpload}
                    ></ImageUpload>
                </div>
                <div className="edit-clubs-edit-bottom">
                    <div className="edit-clubs-name-advised-div">
                        <input
                            name="name"
                            className="line-in edit-clubs-name-input"
                            type="text"
                            placeholder="Club name..."
                            value={this.state.name}
                            onChange={this.handleInputChange}
                        ></input>
                        <ActionButton
                            className={isActive('edit-clubs-advised edit-clubs-advised-edit', this.state.advised)}
                            onClick={this.changeAdvised}
                        >
                            {this.state.advised ? 'Advised' : 'Independent'}
                        </ActionButton>
                    </div>
                    <label htmlFor="description">Description</label>
                    <br />
                    <textarea
                        name="description"
                        className="edit-clubs-description-input"
                        type="text"
                        placeholder="Enter a description for your club"
                        value={this.state.description}
                        onChange={this.handleInputChange}
                    ></textarea>
                    <label htmlFor="fb" className="edit-clubs-link-label">
                        Facebook
                    </label>
                    <input
                        name="fb"
                        className="line-in edit-clubs-link-input"
                        type="text"
                        placeholder="Facebook link"
                        value={this.state.fb}
                        onChange={this.handleInputChange}
                    ></input>
                    <br />
                    <label htmlFor="website" className="edit-clubs-link-label">
                        Website
                    </label>
                    <input
                        name="website"
                        className="line-in edit-clubs-link-input"
                        type="text"
                        placeholder="Facebook link"
                        value={this.state.website}
                        onChange={this.handleInputChange}
                    ></input>
                    <p className="edit-clubs-card-edit-heading">Execs</p>
                    <div className="edit-clubs-card-edit-list">{execEditList}</div>
                    <div className="edit-clubs-add-container">
                        <ActionButton className="edit-clubs-add" onClick={this.addExec}>
                            Add Exec
                        </ActionButton>
                    </div>
                    <p className="edit-clubs-card-edit-heading">Committees</p>
                    <div className="edit-clubs-card-edit-list">{committeeEditList}</div>
                    <div className="edit-clubs-add-container">
                        <ActionButton className="edit-clubs-add" onClick={this.addCommittee}>
                            Add Committee
                        </ActionButton>
                    </div>
                    <SubmitGroup submit={this.submit}></SubmitGroup>
                </div>
            </div>
        );
    }
}

export default EditClubs;
