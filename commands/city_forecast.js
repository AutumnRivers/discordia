const sqlite = require('sqlite');
sqlite.open('./database.sqlite');

module.exports = {
    name: 'forecast',
    description: 'Views the weather of the city.',
    execute(message, args) {
        sqlite.get('SELECT * FROM guilds WHERE id = ?', [message.guild.id])
        .then(city => {
            if(city.weather === 'clear') {
                message.channel.send('', {embed: {
                    title: 'Weather Forecast for ' + message.guild.name,
                    fields: [
                        {
                            name: 'Forecast',
                            value: 'Clear'
                        },
                        {
                            name: 'Effects',
                            value: 'None'
                        }
                    ],
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/377284586326982666/594325589339537411/clear.png'
                    }
                }})
            } else if(city.weather === 'rain') {
                message.channel.send('', {embed: {
                    title: 'Weather Forecast for ' + message.guild.name,
                    fields: [
                        {
                            name: 'Forecast',
                            value: 'Rainy'
                        },
                        {
                            name: 'Effects',
                            value: 'Workers lose an extra 1 stamina with each build.'
                        }
                    ],
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/377284586326982666/594325590966927563/rain.png'
                    }
                }})
            } else if(city.weather === 'windy') {
                message.channel.send('', {embed: {
                    title: 'Weather Forecast for ' + message.guild.name,
                    fields: [
                        {
                            name: 'Forecast',
                            value: 'Windy'
                        },
                        {
                            name: 'Effects',
                            value: 'Workers are 0.5x faster when building.'
                        }
                    ],
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/377284586326982666/594325594909442048/wind.png'
                    }
                }})
            }
        })
    }
}