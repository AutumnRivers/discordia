module.exports = {
    name: 'info',
    description: 'Gives info about Discordia and what it\'s about',
    execute(message, args) {
        message.channel.send('', {embed: {
            title: 'Discordia v0.1',
            description: 'Discordia is a Discord bot that turns your guild into a city! Start off with nothing more than the community center and town hall, then grow to an advanced civilization! Chase other guilds up the Discordia Leaderboard and earn the title of "Golden City"! In addition, you can also unlock more features of the bot by working together.\n\nYou only have limited stamina, so use it wisely. You can upgrade it when you unlock the **Research Lab**. Good luck, and happy building!',
            color: '7506394'
        }});
    }
}