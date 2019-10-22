const { Spotify } = require('../../_helpers/db')
const querystring = require('querystring')
const SpotifyWebApi = require('../../modules/spotify')

const stateKey = 'spotify_auth_state'
const redirect_uri = 'http://localhost:8080/settings'

const spotifyApi = new SpotifyWebApi({
    redirectUri: redirect_uri
});

const getTracks = async (req, res, err) => {

    const filter = req.query.filter || ''
    const sort = req.query.sort || {}
    const perPage = parseInt(req.query.limit) || 30
    const offset = parseInt(req.query.offset) || 0

    try {
        const tracks = await Spotify.find({
            name: {
                '$regex': filter,
                '$options': 'i'
            }
        }).limit(perPage).skip(offset).sort(sort)

        res.send(tracks)
    } catch (error) {
        // console.log(error);
        res.status(500).send({ error })
    }
}

const getFavoritePlaylist = async (req, res, err) => {

    try {
        await setUserToken(req.User)

        spotifyApi.getUserPlaylists({limit: 20})
            .then(function (data) {
                // console.log('Retrieved playlists', data.body);
                res.json(data.body.items)
            }, function (err) {
                res.status(400).json({ error: err.message })
            });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error })
    }
}



const login = async (req, res, err) => {
    try {
        const scopes = ['user-read-private', 'user-read-email', 'user-library-modify', 'user-library-read', 'playlist-modify-private', 'playlist-read-private']
        var authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, true);
        // console.log(authorizeURL)
        res.send(authorizeURL);
    } catch (error) {
        console.log(error);
    }

}

const auth = async (req, res, err) => {

    var authorizationCode = req.query.code;

    spotifyApi.authorizationCodeGrant(authorizationCode)
        .then(async (data) => {

            const currentDate = new Date()
            const access_token = data.body['access_token']
            const refresh_token = data.body['refresh_token']
            const expires = data.body['expires_in']

            req.User.settings.spotify.refreshToken = refresh_token
            req.User.settings.spotify.accessToken = access_token

            req.User.settings.spotify.expires = currentDate.setSeconds(currentDate.getSeconds() + expires)
            await req.User.save()
            // console.log(access_token);
            res.redirect(`/settings`)
        }, function (err) {
            console.log(err);
            res.send({ error: 'Something went wrong when retrieving the access token!' })
        });
}

const setUserToken = async (user) => {

    try {
        const currentDate = new Date()
        const tokenData = await spotifyApi.setTokens(user.settings.spotify)
        if (user.settings.spotify.accessToken !== tokenData.accessToken) {
            console.log(tokenData.accessToken);
            user.settings.spotify.accessToken = tokenData.accessToken
            user.settings.spotify.expires = currentDate.setSeconds(currentDate.getSeconds() + tokenData.expires)

            await user.save()
        }
    } catch (error) {
        console.log(error);
        return Promise.reject(error.message)
    }
}

module.exports = {
    getTracks,
    login,
    auth,
    getFavoritePlaylist
}