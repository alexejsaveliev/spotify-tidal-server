const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    fullName: {type: String, required: true},
    settings: {
        spotify: {
            accessToken: {type: String},
            refreshToken: {type: String},
            expires: Date
        },
        tidal: {
            username: String,
            password: String
        },
        general: {
            syncInterval: Number,
            syncOn: Boolean
        }
    },
    // lastName: {type: String, required: true},
    hash: {type: String, required: true}
}, {timestamps: true})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User