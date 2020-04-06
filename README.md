# Short

- Connects to Discord Server and gives VIPs special permissions
- "Tracks" specific users activities
- Notifies Telegram Group chat when a user joins or leaves a voice channel
- Notifies Telegram Group chat when a user starts or stops a game
- Can ignore certain games

## Discord Commands:

`!help`
Shows help

`!play warzone`
Sends out a message to telegram group chat:
"USERNAME" wants to play warzone

`!plus 3`
Sends out a message to telegram group chat:
"USERNAME" looking for 3 more player

`!roll`
Rolls a random number between 1 and 100

## Telegram Commands

`!help`
Shows help

`!roll`
Rolls a random number between 1 and 100

# Full Story:

https://medium.com/@the_real_bpr/discordjs-bot-with-telegram-bot-via-node-in-docker-compose-4f43056266ba

# Architecture

- Run the final thing in docker (because docker period)
- Use Node and run JS
- A simple dev environment and a separate production environment
- Easily extend the functionality (add new JS stuff)
- Debug things

## Docker

- Use the default .env file to handle DEBUG=True/False
  and make sure that the secret sauce is not in git

## Discord

- Differentiate between users & their permissions
- Track certain games
- Have an easy command management

## Telegram

- Receive updates from Discord
- Have some commands for users, like a random number between 1 and 100

# Using

- https://github.com/yagop/node-telegram-bot-api
- https://discord.js.org/#/

```
"discord.js": "^12.1.1",
node-telegram-bot-api": "^0.40.0"
```
