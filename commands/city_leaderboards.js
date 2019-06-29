const sqlite = require('sqlite');
sqlite.open('./database.sqlite');

module.exports = {
    name: 'leaderboards',
    description: 'Views the global leaderboards.',
    execute(message, args) {
        message.channel.send('', {embed: {
            title: 'Discordia Global Leaderboards',
            description: 'Loading...'
        }}).then(msg => {

            sqlite.all('SELECT * FROM guilds')
            .then(r => {
                var points;
                var cityArray = [];

                r.forEach(c => {
                    points = 0;
                    var buildings = JSON.parse(c.buildings);
                    var users = JSON.parse(c.users);

                    points += buildings.length + users.length;
                    c.points = points;
                    cityArray.push(c);
                });
                cityArray.sort(compare);

                var embedDesc = '';

                for(x = 0; x < cityArray.length; x++) {
                    embedDesc += `\n${x + 1}. **${cityArray[x].title}** (${cityArray[x].id}) - ${cityArray[x].points} points`;
                }

                msg.edit('', {embed: {
                    title: 'Discordia Global Leaderboards',
                    description: embedDesc,
                    thumbnail: {
                        url: message.guild.me.user.avatarURL
                    }
                }});
            })

        });
    }
}

function compare( a, b ) {
    if ( a.points > b.points ){
        return -1;
    }
    if ( a.points < b.points ){
        return 1;
    }
    return 0;
}