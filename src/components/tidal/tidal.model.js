const mongoose = require('mongoose')

const tidalTrackSchema = new mongoose.Schema({
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
    fullTitle: {
        type: String,
        required: true,
        lowercase: true, 
        trim: true
    },
    artist: {
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
    spotifyRefId: {
        type: String
    },
    added_at: {
        type: Date
    }
})

tidalTrackSchema.virtual('spotifyTracks', {
    ref: 'SpotifyTrack',
    localField: 'id',
    foreignField: 'tidalRefId'
})

// tidalTrackSchema.statics.findByName( async function(trackName) {
    
// })

tidalTrackSchema.index({ fullTitle: 'text' })

const TidalTrack = mongoose.model('TidalTrack', tidalTrackSchema)

module.exports = TidalTrack