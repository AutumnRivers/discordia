const sqlite = require('sqlite');
sqlite.open('./database.sqlite');

module.exports = {
    name: 'tour',
    description: 'Tour your city, see what there is to see!',
    execute(message, args) {
        sqlite.get('SELECT * FROM guilds WHERE id = ?', [message.guild.id])
        .then(g => {
            var buildings = JSON.parse(g.buildings);
            //FIXME: Note to self, optimize this. But since this is temporary, leave it as is.. but do fix it before you submit it to Hack Week. Please. I'm begging you.
            //IDEA! Add a "tourDesc" to each JSON then read each one and check if they're included in the buildings array? Could work!
            var embedDesc = 'There are ' + calculateBots(message.guild) + ' houses surrounding the city.';

            if(buildings.includes('tutorial')) embedDesc += '\n\nA giant tower with the letters "ctOS" sit in the center of the city. (`city!enter tutorial`)';

            if(buildings.includes('resturaunt')) embedDesc += '\n\nResturaunts run along the streets, emitting an exotic aroma. (`city!enter resturaunt`)';

            if(buildings.includes('gamecenter')) embedDesc += '\n\nA game center sits near the ctOS tower. (`city!enter gamecenter`)';

            if(buildings.includes('park')) embedDesc += '\n\nA nice and peaceful park sits near the entrance of the city. (`city!enter park`)';

            if(buildings.includes('rechall')) embedDesc += '\n\nA recreation hall is located near the game center. Fun! (`city!enter rechall`)';

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