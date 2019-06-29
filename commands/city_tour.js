const sqlite = require('sqlite');
sqlite.open('./database.sqlite');
const fs = require('fs');
const contractFiles = fs.readdirSync('./contracts').filter(file => file.endsWith('.json'));

module.exports = {
    name: 'tour',
    description: 'Tour your city, see what there is to see!',
    execute(message, args) {
        sqlite.get('SELECT * FROM guilds WHERE id = ?', [message.guild.id])
        .then(g => {
            var buildings = JSON.parse(g.buildings);
            var embedDesc = '';

            for(const file of contractFiles) {
                const contract = require(`../contracts/${file}`);
                if(buildings.includes(contract.id)) embedDesc += '\n\n' + contract.tourDesc;
            }

            message.channel.send('', {embed: {
                title: message.guild.name + ' Grand Tour!',
                description: embedDesc
            }});
        });
    }
}

function calculateBots(guild) {
    var bots = 0;

    guild.members.forEach(m => {
        if(m.user.bot) bots++;
    });

    return guild.members.size - bots;
}