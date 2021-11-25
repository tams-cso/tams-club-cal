import React, { useEffect, useState } from 'react';

import List from '@mui/material/List';
import Button from '@mui/material/Button';
import LinkInput from './link-input';

/**
 * Displays the list of link inputs, as well as allows for more to be added.
 * 
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

    // On mount or when an item is added, update the list of components
    useEffect(() => {
        // If the links are null, do nothing
        if (!props.links) return;

        // Concatenate the list of links with the list of added links
        // and map them to LinkInput components
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

    // Add a new link input to the list
    const addItem = () => {
        setAddedList([...addedList, '']);
    };

    return (
        <React.Fragment>
            <List>{listItems}</List>
            <Button
                color={props.addColor || 'primary'}
                onClick={addItem}
                sx={{ margin: '6px auto 24px', display: 'block' }}
            >
                {`Add ${props.label}`}
            </Button>
        </React.Fragment>
    );
};

export default LinkInputList;
