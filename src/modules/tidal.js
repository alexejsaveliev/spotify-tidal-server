const Tidal = require('tidal-api-wrapper')
const stringSimilarity = require('string-similarity')

class TidalApi extends Tidal {

    constructor(options = {}) {
        super(options)

        this.countryCode = 'TR'
        this.webToken = 'qe5mgUGPtIfbgN574ngS74Sd1OmKIfvcLx7e28Yk'
        this.params = `countryCode=${this.countryCode}`
        // this.userId = '124900815',
        // this.sessionId = 'b02382b7-b47b-4264-a967-12910892c351'

    }

    async addToFavorites(trackId) {
        const res = await this.api({
            method: 'POST',
            url: `/users/${this.userId}/favorites/tracks?trackId=${trackId}&${this.params}`,
            data: `trackIds=${trackId}`
        });

        return res
    }


    async findTrack(artistName, trackName) {

        const res = await this.api({
            method: 'GET',
            url: `/search?query=${encodeURIComponent(`${artistName} ${trackName}`)}&limit=7&offset=0&types=TRACKS&countryCode=${this.countryCode}`
        })

        // console.log(res);
        if (res.status !== 200) {
            console.log('Tidal api error. Searching track', `Error code ${res.status}, message: ${res.statusText}`);
            return undefined
        }

        const items = res.data.tracks.items

        if (items.length) {
            const matches = stringSimilarity.findBestMatch(`${artistName} ${trackName}`.toLowerCase(), items.map( (el) => {
                return `${el.artists[0].name.toLowerCase()} ${el.title.toLowerCase()} ${el.version || ''}`
            }))

            // console.log(matches);
            // console.log(items[1]);
            if (matches.bestMatch.rating >= .4) {
                return items[matches.bestMatchIndex]
            } else {
                console.log(matches.bestMatch.rating)
            }
        }
    }

    async deleteFavoriteTrack(trackId) {

        if (!this.userId || !this.sessionId) {
            throw new Error('You must call the login method first');
        }

        // console.log(this.params);

        const res = await this.api({
            method: 'DELETE',
            url: `/users/${this.userId}/favorites/tracks/${trackId}?${this.params}`
        })

        return res
    }

    async getFavoriteTracks(limit = this.limit, offset = 0) {


        if (!this.userId || !this.sessionId) {
            throw new Error('You must call the login method first');
        }

        const url = `/users/${this.userId}/favorites/tracks?limit=${limit}&offset=${offset}&${this.params}&order=DATE&orderDirection=ASC`
        // console.log(url)

        const res = await this.api({
            method: 'GET',
            url
        })

        if (res.status !== 200) {
            throw new Error(`Tidal api error. Getting favorite tracks. Error code: ${res.status}`)
        }

        const { items } = res.data;

        // const tracks = items.map(item => item.item);

        return items
    }

    async getFavoritePlaylists() {

        if (!this.userId || !this.sessionId) {
          throw new Error('You must call the login method first');
        }
    
        const res = await this.api({
          method: 'GET',
          url: `/users/${this.userId}/playlistsAndFavoritePlaylists?${this.params}`,
        });
    
        const { items } = res.data;
    
        return items;
      }

}


module.exports = TidalApi