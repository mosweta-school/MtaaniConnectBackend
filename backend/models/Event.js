// Defines how your data looks.
// Event.js → event schema (title, location, date, userId)
const eventSchema = {
    id: Number,
    title: String,
    location:{
        name: String,
        latitude: Number,
        longitude: Number
    },
    date: String,
    userId: String,
    timeOfEvent: String,
    organizer: String, //User Id of the organizer
    category: String,
    maxAttendees: Number,   
    attendees: [String] //Array of User Ids of attendees
}

export default eventSchema; 

