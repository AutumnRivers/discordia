const sqlite = require('sqlite');
sqlite.open('database.sqlite');

module.exports = {
    name: 'me',
    description: 'Gives info about whoever called the command',
    execute(message, args) {
        if(message.content.toLowerCase().startsWith(prefix + 'me')) {
            sqlite.get(`SELECT users FROM guilds WHERE id = ${message.guild.id}`)
            .then(guildUsers => {
                var users = JSON.parse(guildUsers.users);

                var user = users.find(o => o.id === message.author.id);

                if(!user) return message.reply('You have not been registered in the database yet, please stay patient!');

                var records = user.records;

                if(!user.records[0]) var records = 'There are no records to display yet...';

                message.channel.send('', {embed: {
                    title: `${message.author.username}'s Profile`,
                    description: `**STAMINA**\nLv. ${user.maxStamina - 4}\n\n**SPEED**\n${user.speed}x\n\n**RECORDS**\n${records}`,
                    color: '7506394',
                    thumbnail: {
                        url: message.author.avatarURL
                    }
                }});
            });
        }
    }
}