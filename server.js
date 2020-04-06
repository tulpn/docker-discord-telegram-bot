const config = require("./config.json")

config['TELEGRAM']['SECRET_TOKEN']=process.env.TELEGRAM_TOKEN
config['DISCORD']['SECRET_TOKEN']=process.env.DISCORD_TOKEN

if ( process.env.DEBUG === 'true'){
    config['DEBUG'] = true
}

const helper = require('./helper')
let vips = helper.loadVIPs()
let trackedIds = helper.loadTrackedIds()
let gameIds = helper.loadGameIds()

const telegramBot = require("./bots/telegram")
const discordBot = require("./bots/discord")

const tB = new telegramBot(config);
tB.registerCommands()

const dB = new discordBot(config);
dB.vips = vips;
dB.trackedIds = trackedIds;
dB.gameIds=gameIds;
dB.registerTelegram(tB)
dB.registerCommands()

