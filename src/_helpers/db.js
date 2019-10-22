// const mongoose = require('mongoose')

// const connectionURL = 'mongodb://127.0.0.1:27017/spotify-tidal-sync'

// mongoose.connect(connectionURL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// })

const config = require('../config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { 
    useCreateIndex: true, 
    useNewUrlParser: true,
    useFindAndModify: false
 });
mongoose.Promise = global.Promise;

module.exports = {
    Spotify: require('../components/spotify/spotify.model'),
    Tidal: require('../components/tidal/tidal.model'),
    Users: require('../components/users/users.model'),
    SyncSettings: require('../components/synchronization/sync.model')
};




