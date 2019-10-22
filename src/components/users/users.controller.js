const User = require('./users.service');

const authenticate = async (req, res, next) => {
    try {
        const user = await User.authenticateUser(req.body)
        if (user) {
            res.send(user)
        } else {
            res.status(400).json({ message: 'Username or password is incorrect' })
        }
    } catch (err) {
        next(err)
    }
   
}

const register = async (req, res, next) => {
    try {
        await User.createUser(req.body)
        res.status(201).json({})
    } catch (error) {
        next(error)
    }    
}

const getSettings = async (req, res, next) => {

    try {
        // console.log(req.User.settings);
        // await User.createUser(req.body)
        res.json(req.User.settings)
    } catch (error) {
        next(error)
    }    
}

const setSettings = async (req, res, next) => {
    const updates = req.body

    try {
        req.User.settings.general = updates
        // await User.updateSettings(req.user.sub, updates)
        await req.User.save()
        res.send()
    } catch (error) {
        next(error)
    }    
}

module.exports = {
    authenticate,
    register,
    getSettings,
    setSettings
}
