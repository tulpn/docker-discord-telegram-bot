const TelegramBot = require('node-telegram-bot-api');

module.exports = class Telegram {

   setup = () => {
    this.commands = [
        {
            'cmd': 'roll',
            'description': "Prints a random number between 0 and 100",
            'func': this.cmdRoll
        },
        {
            'cmd': 'help',
            'description': "Prints this help",
            'func': this.printHelp
        },
    ]
   }

    constructor(config){
        this.config = config
        this.bot = new TelegramBot(this.config["TELEGRAM"]['SECRET_TOKEN'], {polling: true});
        this.setup();
        
    }

    /**
     * Use this for the message handling, it will always have the correct channel id
     */
    sendMessage = message => {
        let channelId = this.config["TELEGRAM"]['PROD_CHANNEL_ID']
        if ( this.config['DEBUG']){
            channelId = this.config['TELEGRAM']['DEBUG_CHANNEL_ID']
        }
        this.bot.sendMessage(channelId,message, {parse_mode: "HTML"});
    }

    /**
     * Rolls a number between 1 and 100
     */
    cmdRoll = (args = null) => {
        let n = Math.round(Math.random() * 100)
        this.sendMessage("Number is: " + n)
    }

    /**
     * Prints help
     */
    printHelp = () => {
        let title = "🆘<b>The following commands can be used:</b>🆘 \n"
        let helpText = ''
        this.commands.forEach(c => {
            let ml = `${this.config["TELEGRAM"]['COMMAND_PREFIX']}${c.cmd}: ${c.description} \n`
            helpText += ml
        })
        this.sendMessage(`${title}<code>${helpText}</code>`)
    }

    /***
     * Registeres all the commands 
     */
    registerCommands = () => {
        this.bot.on('message', (message) => {
            if ( message['entities'] !== undefined){
                // this has entities! not a normal text message
                if ( message['entities'][0]['type'] === "bot_command"){
                    // lets parse the text
                    let messageContent = message['text']
                    const args = messageContent.slice(this.config["TELEGRAM"]['COMMAND_PREFIX'].length).split(' ');
                    const command = args.shift().toLowerCase();
                    let selectedCommand = this.commands.find(c => c.cmd === command)
                    if (selectedCommand !== null){
                        selectedCommand.func(args)
                    }
                    else{
                        return
                    }
                }
            }
            return 
        })
    }
}
