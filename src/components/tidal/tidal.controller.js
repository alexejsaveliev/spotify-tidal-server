const TidalApi = require('../../modules/tidal')
const config = require('../../config.json')
const jwt = require('jsonwebtoken')
const { Tidal: TidalDb } = require('../../_helpers/db')

const tidal = new TidalApi()

module.exports = {
    login,
    getTracks,
    getUserPlaylists
}

async function login(req, res, err) {
    const { username, password } = req.body
    try {
        const userParams = await tidal.login(username, password)

        req.User.settings.tidal.username = username
        req.User.settings.tidal.password = jwt.sign({ password }, config.secret)
        await req.User.save()

        res.json(userParams)
    } catch (error) {
        res.status(error.response.status).json({ error: error.response.data })
    }
}

async function getTracks(req, res, err) {
    const filter = req.query.filter || ''
    const sort = req.query.sort || {}
    const perPage = parseInt(req.query.limit) || 30
    const offset = parseInt(req.query.offset) || 0

    try {
        const tracks = await TidalDb.find({
            name: {
                '$regex': filter,
                '$options': 'i'
            }
        }).limit(perPage).skip(offset).sort(sort)
        // console.log(tracks);
        res.send(tracks)
    } catch (error) {
        res.status(500).send({ error })
    }
}

async function getUserPlaylists(req, res, err) {
    try {
        const onlyUserPlaylists = req.query.createdByUser === 'true' || false
        const decodedPsswdObjct = jwt.decode(req.User.settings.tidal.password, config.secret)
        const password = decodedPsswdObjct.password
        const login = req.User.settings.tidal.username
        await tidal.login(login, password)
        const playlists = await tidal.getFavoritePlaylists()
        // console.log(playlists);
        if (playlists.length) {
            // console.log(onlyUserPlaylists);
            if (onlyUserPlaylists) {
                res.json(playlists.filter((el) => {
                    return el.type === 'USER_CREATED'
                }))
            } else {
                res.json(playlists)
            }
        } else {
            res.status(404).send()
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
}