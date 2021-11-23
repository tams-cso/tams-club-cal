import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';

import List from '@mui/material/List';
import Button from '@mui/material/Button';
import LinkInput from './link-input';

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
 * @param {string} props.name Name of the list
 * @param {string} props.label String name of the label
 * @param {string[]} props.links List of links or empty array. The component will not render if null
 * @param {string} [props.addColor] Color of the add button (default will be primary)
 */
const LinkInputList = (props) => {
    const [listItems, setListItems] = useState([]);
    const [addedList, setAddedList] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        if (!props.links) return;
        setListItems(
            [...props.links, ...addedList].map((link, i) => (
                <LinkInput
                    control={props.control}
                    register={props.register}
                    name={props.name}
                    index={i}
                    key={i}
                    setValue={props.setValue}
                    link={link}
                    label={props.label}
                />
            ))
        );
    }, [props, addedList]);

    const addItem = () => {
        setAddedList([...addedList, '']);
    };

    return (
        <React.Fragment>
            <List>{listItems}</List>
            <Button color={props.addColor || 'primary'} onClick={addItem} className={classes.addButton}>
                {`Add ${props.label}`}
            </Button>
        </React.Fragment>
    );
};

export default LinkInputList;
