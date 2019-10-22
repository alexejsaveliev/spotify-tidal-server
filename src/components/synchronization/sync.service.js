const db = require('../../_helpers/db')
const SyncSettings = db.SyncSettings

module.exports = {
    saveSettings,
    getSettingsList
}

async function saveSettings(id, userId, data) {
    if (!data) {
        return
    }

    let setting

    data.userId = userId

    try {
        if (id) { //it existing settings, we should update it
            setting = await SyncSettings.findByIdAndUpdate(id, data)
        } else {
            setting = await new SyncSettings(data)
        }

        return await setting.save()
    } catch (error) {

    }

}

function getSetting(id, userId) {

}

async function getSettingsList(userId) {
    try {
        const settings = await SyncSettings.find({ userId })
        return settings
    } catch (error) {
        return error
    }
}

function deleteSetting(id, userId) {

}