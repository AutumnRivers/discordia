const sqlite = require('sqlite');
sqlite.open('./database.sqlite');
const fs = require('fs');
const contractFiles = fs.readdirSync('./contracts').filter(file => file.endsWith('.json'));

module.exports = {
    name: 'contracts',
    description: 'Views the contracts for the city.',
    execute(message, args) {
        sqlite.get('SELECT contracts, buildings FROM guilds WHERE id = ?', [message.guild.id])
        .then(city => {
            var contracts = JSON.parse(city.contracts);
            var embedDesc = '';

            contracts.forEach(contract => {
                embedDesc += '\n\n**' + contract.title + '** (ID: `' + contract.id + '`)\n```\n' + contract.description + '\n```'
            });

            if(!contracts[0]) embedDesc = 'Hooray, you have no contracts! Take a well-deserved break. :)';

            message.channel.send('', {embed: {
                title: `Contracts for ${message.guild.name}`,
                description: embedDesc,
                color: '7506394'
            }});
        });
    }
}