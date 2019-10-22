const express = require('express');
const cors = require('cors')
const router = express.Router();
const {authenticate, register, getSettings, setSettings } = require('../components/users/users.controller')
const spotify = require('../components/spotify/spotify.controller')
const tidal = require('../components/tidal/tidal.controller')
const syncSettings = require('../components/synchronization/sync.controller')

// user routes
router.post('/users/login', authenticate);
router.post('/users/registration', register);
router.post('/users/settings', setSettings);
router.get('/users/settings', getSettings);

//spotify
// var corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
router.get('/spotify/getTracks', spotify.getTracks)
router.get('/spotify/login', spotify.login)
router.get('/spotify/auth', spotify.auth)
router.get('/spotify/getUserPlaylists', spotify.getFavoritePlaylist)

//Tidal
router.post('/tidal/login', tidal.login)
router.get('/tidal/getTracks', tidal.getTracks)
router.get('/tidal/getUserPlaylists', tidal.getUserPlaylists)

//Synchronization settings 
router.post('/scheduling/saveSettings', syncSettings.saveSettings)
router.get('/scheduling/getSettingsList', syncSettings.getSettings)

module.exports = router