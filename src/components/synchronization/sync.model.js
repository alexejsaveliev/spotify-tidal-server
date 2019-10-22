const mongoose = require('mongoose')

const syncSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    enable: {
        type: Boolean
    },
    settings: {
        sourcePlaylist: {
            title: String,
            id: String
        },
        destinationPlaylist: {
            title: String,
            id: String
        },
        schedule: {
            startDate: Date,
            time: Date,
            frequency: {
                type: String,
                default: 'Day'
            }
        }
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    }
})


const SyncSettings = mongoose.model('SyncSettings', syncSchema)

module.exports = SyncSettings