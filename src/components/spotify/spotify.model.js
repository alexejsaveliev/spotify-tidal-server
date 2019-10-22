const mongoose = require('mongoose')

const spotifySchema = new mongoose.Schema({
        id: {
            type: String,
            required: true,
            unique: true
        },
        processed: {
            type: Boolean,
            default: false
        },
        deleted: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            required: true,
            lowercase: true, 
            trim: true
        },
        artists: [{
            name: {
                type: String,
                required: true,
                lowercase: true, 
                trim: true
            },
            id: {
                type: String,
                required: true
            }
        }],
        album: {
            name: {
                type: String,
                required: true,
                lowercase: true, 
                trim: true
            },
            id: {
                type: String,
                required: true
            }
        },
        tidalRefId: {
            type: String
        },
        added_at: {
            type: Date
        },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        }
})

spotifySchema.virtual('tidalTrack', {
    ref: 'TidalTrack',
    localField: 'id',
    foreignField: 'spotifyRefId'
})

const SpotifyTrack = mongoose.model('SpotifyTrack', spotifySchema)


module.exports = SpotifyTrack