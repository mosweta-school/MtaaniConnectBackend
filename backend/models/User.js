// Defines how your data looks.
// User.js → user schema (name, email, password, role)
const userData = {
    id: String,
    name: String,
    email: String,
    password: String,
    role: String,
    events: Array,
    currentLocation: String,
}

export default userData;