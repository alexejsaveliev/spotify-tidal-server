const config = require('../../config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../../_helpers/db')
const User = db.Users

module.exports = {
    authenticateUser,
    createUser,
    // updateSettings
}

async function authenticateUser({username, password}) {
    const user = await User.findOne({ username })

    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({sub: user.id}, config.secret)
        const {hash, ...userWithoutHash} = user.toObject()
        return {
            ...userWithoutHash,
            token
        }
    }
}

async function createUser(userParams) {
    
    if (await User.findOne({username: userParams.username})) {
        throw `Username ${userParams.username} is already taken`
    }

    const user = new User(userParams)
    if (userParams.password) {
        user.hash = bcrypt.hashSync(userParams.password, 10)
    }
   
    await user.save()

}

// async function updateSettings(id, updates) {
//    try {
//         console.log(updates);
//         // const user = await User.findByIdAndUpdate(id, { settings: updates })
//         user.set('settings.general', updates)
//         await user.save()
//    } catch (error) {
//        console.log(error);
//    }
// }



