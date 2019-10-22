const SpotifyWebApi = require('spotify-web-api-node')
const stringSimilarity = require('string-similarity')
// const accessToken = 'BQCOAjvAcfOgeldZ1luxPe9Nwv7qMopKocJbKkWmTMeoTpPg3NifZa-KtKiHMBToxJnEj0JrXi31iwtCVEs'
const scopes = ['user-read-private', 'user-read-email', 'user-library-modify', 'user-library-read']
const client_id = '692effc216d4477b9e9c57a042e1b998'
const client_secret = '8f5e980807f343e2897d7dfa5c2feadd'
const redirect_uri = 'http://localhost:8080/settings'

const scopes = ['user-read-private', 'user-read-email', 'user-library-modify', 'user-library-read']
const state = 'some-state-of-my-choice'


// Create the api object with the credentials
const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    refreshToken,
    redirectUri: 'https://super-task-manager.herokuapp.com/callback'
})

const spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri
});

async function setNewAccessToken() {

    try {
        const accessTokenData = await this.refreshAccessToken()

        if (accessTokenData.statusCode === 200) {
            // console.log(accessTokenData.body.access_token);
            this.setAccessToken(accessTokenData.body.access_token)
            return accessTokenData.body.access_token
        } else {
            console.log('Error setting new access token', accessTokenData.statusCode);
        }
    } catch (e) {
        console.log('Error setting new access token', e.message)
        throw new Error(e)
    }

}

async function setRefreshToken() {
    spotifyApi.setRefreshToken(data.body['refresh_token'])
}

async function getSavedTracks(limit, offset) {

    try {
        // await this.setNewAccessToken()

        return this.getMySavedTracks({
            limit,
            offset
        })
    } catch (e) {
        throw new Error(e)
    }
}

async function getTrack(artist, track) {

    try {
        const data = await this.searchTracks(`track:${track} artist:${artist}`)
        if (data.statusCode === 200) {
            if (!data.body.tracks.items.length) {
                console.log('Not found in spotify', artist, track);
                return undefined
            }
            const matches = stringSimilarity.findBestMatch(`${track} ${artist}`, data.body.tracks.items.map(el => el.name.toLowerCase() + " " + el.artists[0].name.toLowerCase()))
            if (matches.bestMatch.rating >= .4) {
                return data.body.tracks.items[matches.bestMatchIndex]
            }

        } else {
            throw new Error(data);
        }
    } catch (err) {
        throw new Error(err);
    }

}

const generateRandomString = function (length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const auth = (authorizationCode, ) => {

    spotifyApi.authorizationCodeGrant(authorizationCode)
        .then(async (data) => {
            const access_token = data.body['access_token']
            const refresh_token = data.body['refresh_token']

            req.User.settings.spotify.refreshToken = refresh_token
            req.User.settings.spotify.token = access_token
            await req.User.save()
            // console.log(access_token);
            res.redirect(`/settings`)
        }, function (err) {
            console.log(err);
            res.send({ error: 'Something went wrong when retrieving the access token!' })
        });
}

module.exports = Spotify