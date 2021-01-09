export const getSavedEventList = (store) => store.data.eventList;

export const getSavedVolunteeringList = (store) => store.data.volunteeringList;

export const getSavedClubList = (store) => store.data.clubList;

export const getPopupOpen = (store) => store.popup.open;

export const getPopupEdit = (store) => store.popup.edit;

export const getPopupId = (store) => store.popup.id;

export const getPopupEvent = (store) => {
    if (store.data.eventList === null) return null;
    return store.data.eventList.find((e) => e._id === store.popup.id);
};

export const getPopupVolunteering = (store) => {
    if (store.data.volunteeringList === null) return null;
    return store.data.volunteeringList.find((v) => v._id === store.popup.id);
};

export const getPopupClub = (store) => {
    if (store.data.clubList === null) return null;
    return store.data.clubList.find((c) => c._id === store.popup.id);
};
