const Discord = require('discord.js')


module.exports = class DiscordBot {

    /**
     * For debugging
     */
    cm = (m, ...args) => {
        if ( this.config['DEBUG']){
            console.log(m, args)
        }
    }

    /**
     * Setup the commands and login, and execute stuff on ready
     */
    setup = () => {
        this.commands = [
            {
                'cmd': 'help',
                'description': "Prints this help",
                'func': this.printHelp,
                'vip': false
            },
            {
                'cmd': 'roll',
                'description': "Prints a random number between 0 and 100",
                'func': this.cmdRoll,
                'vip': false
            },
            {
                'cmd': 'play',
                'description': "!play warzone sends to telegram: Username wants to play: warzone",
                'func': this.cmdPlay,
                'vip': true
            },
            {
                'cmd': 'plus',
                'description': "!plus n -> n any number means: looking for +3 etc",
                'func': this.cmdPlus,
                'vip': true
            },
        ]

        this.bot.login(this.config["DISCORD"]['SECRET_TOKEN'])
        this.bot.on('ready', () => {
            this.bot.user.setActivity("with depression", {
                type: "STREAMING",
            })
            this.loadAllMembers()
        })
        
    }

    /**
    * Ad a telegram instance to the bot
    */
    registerTelegram = (telegramBotInstance = null) => {
            this.cm("registering telegram bot instance")
            if ( telegramBotInstance !== null) {
                this.telegramBot = telegramBotInstance
            }
    }

    /**
     * Constructor 
     */
    constructor(config){
        this.config = config
        this.bot = new Discord.Client()
        this.setup();
        // Checking when people join or leave voice channels
        this.registerVoiceStatusChanges()
        // check for streams
        this.registerStreamStatusChanges()
        this.vips = []
        this.trackedIds = []
        this.gameIds=[]
    }

    /**
     * Configure an array of uids and it checks if the id is present in them
     * REturns true | false
     */
    _checkIfImportantUser = (id) => {
        return this.vips.some(uId => uId === id) === true
    }

    _checkIfTrackedUserId = (id) => {
        return this.trackedIds.some(uId => uId === id) || this._checkIfImportantUser(id)
    }

    _checkIfGameIdInIgnored = (id) => {
        return this.gameIds.some(uId => uId === id)
    }

    /**
     * Sends Message to Telegram group chat
     */
    sendTelegram = (message) => {
        this.telegramBot.sendMessage(message)
    }

    /**
     * Rolls a number between 1 and 100
     */
    cmdRoll = (args, message) => {
        let n = Math.round(Math.random() * 100)
        let m = "Number is: " + n
        message.reply(m)
    }

    /**
     * Announces to Telegram to play a game
     */
    cmdPlay = (args, message) => {
        let m = `${message.author.username} wants to play: ${args.join(",")}`
        this.cm(m)
        this.sendTelegram(m)
    }


    /**
     * Looking for more players
     */
    cmdPlus = (args, message) => {
        let m = `${message.author.username} looking for: +${args[0]}`
        this.cm(m)
        this.sendTelegram(m)
    }

    /**
     * Prints help
     */
    printHelp = (args, message) => {
        let helpText = "The following commands can be used: \n"
        this.commands.forEach(c => {

            let ml = ''
            // check if user is VIP
            if ( c.vip ){
                if ( this._checkIfImportantUser(message.author.id) ){
                    ml = `- (VIP only) ${this.config["DISCORD"]['COMMAND_PREFIX']}${c.cmd}: ${c.description} \n`
                }
            } else {
                ml = `- ${this.config["DISCORD"]['COMMAND_PREFIX']}${c.cmd}: ${c.description} \n`
            }
            
            helpText += ml
        })
        message.reply(helpText)
    }

    /**
     * Function to load all members of the guild
     * Used for debugging, like getting IDS of everyone
     */
    loadAllMembers = () => {
        // get all the ids etc for each member, offline or not.
        // let guild = this.bot.guilds.cache.find(g => g.id === "327040166353174528")
        // console.log("Got guild", guild)
        // guild.members.cache.forEach(m => {
        //     console.log(`User: ${m.user.username} ID: ${m.user.id}`)
        // })
    }

    /**
     * Check if someone started or stopped playing a game
     */
    registerStreamStatusChanges = () => {        
        this.bot.on('presenceUpdate', (oldPresence, newPresence) => {
            
            if ( newPresence.user.bot) {
                return
            } 
            
            if ( oldPresence !== undefined && newPresence !== undefined && oldPresence !== null && newPresence !== null){
                if ( oldPresence.activities.length === 0 && newPresence.activities.length > 0 ){
                    // user started something
                    let user = newPresence.user
                    console.log(newPresence.activities)
                    if (!this._checkIfTrackedUserId(user.id)){
                        return;
                    }
                    let username = user.username
                    let currentActivity = newPresence.activities[0]
                    if (this._checkIfGameIdInIgnored(currentActivity.applicationID)) return;

                    if ( currentActivity.type === "PLAYING"){
                        let game = currentActivity.name
        
                        let msg = `${username} is playing ${game}`
                        this.sendTelegram(msg)
                    }
                }
                else if ( oldPresence.activities.length > 0 && newPresence.activities.length === 0){
                    // user stopped 
                    let user = oldPresence.user
                    if (!this._checkIfTrackedUserId(user.id)){
                        return;
                    }
                    let username = user.username
                    let currentActivity = oldPresence.activities[0]
                    if (this._checkIfGameIdInIgnored(currentActivity.applicationID)) return;
                    if ( currentActivity.type === "PLAYING"){
                        let game = currentActivity.name
        
                        let msg = `${username} stopped playing ${game}`
                        this.sendTelegram(msg)
                    }
                }
                
            }
        });
    }

    /**
     * Listen to voice chanell changes of users
     */
    registerVoiceStatusChanges = () => {
        this.bot.on('voiceStateUpdate', (oldMember, newMember) => {
            if ( newMember.bot ){
                return;
            }
            let newUserChannel = newMember.channel
            let oldUserChannel = oldMember.channel
        
            //console.log(newUserChannel,oldUserChannel )
        
            if(oldUserChannel === null && newUserChannel !== null) {
        
            // User Joins a voice channel
            let msg = `${newMember.member.user.username} joined ${newUserChannel.name}`
            this.cm(msg)
            this.sendTelegram(msg)
        
            } else if(oldUserChannel !== null && newUserChannel !== null){
                
                if ( oldUserChannel.id === newUserChannel.id ){
                    // user propably just muted/unmuted => ignore
                    this.cm("user unmuted/muted")
                    console.log(newMember.member.user.presence.activities)
                } else {
                    // User moves to a new channel
                    let msg = `${newMember.member.user.username} moved to ${newUserChannel.name}`
                    //send_telegram_msg(msg)
                    this.cm(msg)
                    this.sendTelegram(msg)
                }
            
            }
            else if(newUserChannel === null && oldUserChannel !== null){
                // User leaves a voice channel
                // User moves to a new channel
                let msg = `${newMember.member.user.username} left voice`
                //send_telegram_msg(msg)
                this.cm(msg)
                this.sendTelegram(msg)
            }
        })
    }

    /***
     * Registeres all the commands 
     */
    registerCommands = () => {
        this.bot.on('message', message => {
            if (!message.content.startsWith(this.config["DISCORD"]['COMMAND_PREFIX']) || message.author.bot) return;
            const args = message.content.slice(this.config["DISCORD"]['COMMAND_PREFIX'].length).split(' ');
            const command = args.shift().toLowerCase();
            
            let selectedCommand = this.commands.find(c => c.cmd === command)

            // make sure user is allowed to execute command
            if (selectedCommand.vip){
                // can only be executed by a VIP member!
                if ( this._checkIfImportantUser(message.author.id) ){
                    if (selectedCommand !== null){
                        selectedCommand.func(args, message)
                    }
                }                
                else{
                    message.reply("Who are you?")
                }
            }
            else {
                if (selectedCommand !== null){
                    selectedCommand.func(args, message)
                }
                else{
                    return
                }
            }
        });
    }
}
