const SyncSettings = require('./sync.service')

module.exports = {
    saveSettings,
    getSettings
}

async function saveSettings(req, res, err) {
    try {
        const setting = await SyncSettings.saveSettings(req.User.id, req.body)
        if (setting) {
            res.json(setting)
        } else {
            res.status(400).send()
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

async function getSettings(req, res, err) {
    try {
        const settingsList = await SyncSettings.getSettingsList(req.User.id)

        if (settingsList.length) {
            res.json(settingsList)
        } else {
            res.status(404).send()
        }
        
    } catch (error) {
        res.status(500).json({ error })
    }
}