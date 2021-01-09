export const getSavedEventList = (store) => store.data.eventList;

export const getSavedVolunteeringList = (store) => store.data.volunteeringList;

export const getPopupOpen = (store) => store.popup.open;

export const getPopupEdit = (store) => store.popup.edit;

export const getPopupId = (store) => store.popup.id;

export const getPopupVolunteering = (store) => {
    if (store.data.volunteeringList === null) return null;
    return store.data.volunteeringList.find((v) => v._id === store.popup.id);
};
