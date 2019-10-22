const SpotifyWebApi = require('spotify-web-api-node');
const stringSimilarity = require('string-similarity')
// const accessToken = 'BQCOAjvAcfOgeldZ1luxPe9Nwv7qMopKocJbKkWmTMeoTpPg3NifZa-KtKiHMBToxJnEj0JrXi31iwtCVEs'
// const refreshToken = 'AQBYnCTNy2rZST_3SjQ2Br9sKKpXzTneysJ-F-tQcOzDUGdbKegdsdoahgPUV14_88ui77i6InvkwVvhyAym64pDAb8lu9W52NbhIf4lR2kv6aP0e6w9giR6aBklng_l4EAU5Q'

const clientId = '692effc216d4477b9e9c57a042e1b998'
const clientSecret = '8f5e980807f343e2897d7dfa5c2feadd'
const redirectUri = 'http://localhost:8080/settings'

const state = 'some-state-of-my-choice'


// // Create the api object with the credentials
// const spotifyApi = new SpotifyWebApi({
//     clientId,
//     clientSecret,
//     refreshToken,
//     redirectUri: 'https://super-task-manager.herokuapp.com/callback'
// })

class SpotifyApi extends SpotifyWebApi {

    constructor() {

        super({
            clientId,
            clientSecret,
            redirectUri
        })
    }

    async setTokens({ refreshToken, accessToken, expires }) {

        this.setRefreshToken(refreshToken)
        const currentDate = new Date()
        const tokenData = { accessToken, expires }
        

        try {
            if (currentDate >= expires) {
                const accessTokenData = await this.refreshAccessToken()
                if ( accessTokenData.statusCode === 200 ) {
                    await this.setAccessToken(accessTokenData.body.access_token)
                    tokenData.accessToken = accessTokenData.body.access_token
                    tokenData.expires = accessTokenData.body.expires_in
                } else {
                    return Promise.reject({error: 'Refreshing access token', statusCode: accessTokenData.statusCode })
                }
            } else {
                await this.setAccessToken(accessToken)
            }

            return tokenData
        } catch (error) {
            console.log('Error setting new access token', e.message)
        }

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

    async getSavedTracks(limit, offset) {

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

    async getTrack(artist, track) {

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

    // async addTracksToFavorite() {
    //     try {
    //         await data = this.
    //     } catch (err) {
            
    //     }
    // }
}


module.exports = SpotifyApi