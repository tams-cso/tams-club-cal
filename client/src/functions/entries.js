function Event(type, name, clubName, startDate, endDate, startTime, endTime, link, description, addedBy) {
    this.type = type;
    this.name = name;
    this.clubName = clubName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.link = link;
    this.description = description;
    this.addedBy = addedBy;
}

export { Event };