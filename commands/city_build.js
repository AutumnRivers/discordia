const sqlite = require('sqlite');
sqlite.open('./database.sqlite');

module.exports = {
    name: 'build',
    description: 'This is where the magic happens!',
    execute(message, args) {
        if(!args || args == '') return message.reply('please enter a contract ID! (`city!contracts`)');

        sqlite.get('SELECT contracts FROM guilds WHERE id = ?', [message.guild.id])
        .then(city => {
            var contracts = JSON.parse(city.contracts);

            var contract = contracts.filter(c => (c.id === args[0]));

            if(!contract[0]) return message.reply("that contract doesn't exist, or you haven't unlocked it yet. View your current contracts with `city!contracts`");

            var contract = contract[0];

            message.channel.send('', {embed: {
                title: "Construction START!",
                description: "**<@" + message.author.id + ">** is now working on `" + contract.title + "`."
            }})
        })
    }
}