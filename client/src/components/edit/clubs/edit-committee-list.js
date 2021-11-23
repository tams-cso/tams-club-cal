import React, { useEffect, useState } from 'react';

import List from '@mui/material/List';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import EditCommitttee from './edit-committee';
import { Committee } from '../../../functions/entries';

const useStyles = makeStyles({
    addButton: {
        display: 'block',
        margin: '6px auto 24px',
    },
});

/**
 * Displays the list of link inputs
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {Function} props.register React hook form register function
 * @param {Function} props.setValue React hook form set value function
 * @param {object} props.errors React hook form error state
 * @param {Committee[]} props.committeeList List of links or empty array. The component will not render if null
 */
const EditCommitteeList = (props) => {
    const [listItems, setListItems] = useState([]);
    const [addedList, setAddedList] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        if (!props.committeeList) return;
        setListItems(
            [...props.committeeList, ...addedList].map((c, i) => (
                <EditCommitttee
                    control={props.control}
                    register={props.register}
                    setValue={props.setValue}
                    errors={props.errors}
                    index={i}
                    key={i}
                    committee={c}
                />
            ))
        );
    }, [props, addedList]);

    const addItem = () => {
        setAddedList([...addedList, new Committee()]);
    };

    return (
        <React.Fragment>
            <List>{listItems}</List>
            <Button color="secondary" onClick={addItem} className={classes.addButton}>
                Add Committee
            </Button>
        </React.Fragment>
    );
};

export default EditCommitteeList;
