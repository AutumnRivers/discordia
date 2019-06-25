module.exports = {
    name: 'server',
    description: 'Views info about the server.',
    execute(message, args) {
        message.channel.send('', {embed: {
            title: message.guild.name,
            color: '7506394',
            fields:[
                {
                    name: 'Guild Size',
                    value: message.guild.members.size + ' members'
                },
                {
                    name: 'Humans',
                    value: calculateBots(message.guild) + ' human(s)'
                },
                {
                    name: 'Boost Level',
                    value: 'Level ' + message.guild.premiumSubscriptionCount
                },
                {
                    name: 'Server ID',
                    value: message.guild.id
                },
                {
                    name: 'Owner',
                    value: `<@${message.guild.owner.id}>`
                }
            ],
            thumbnail: {
                url: message.guild.iconURL
            }
        }});
    }
}

function calculateBots(guild) {
    var bots = 0;

    guild.members.forEach(m => {
        if(m.user.bot) bots++;
    });

    return guild.members.size - bots;
}