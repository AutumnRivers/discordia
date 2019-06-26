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

            var contractArray = contracts.filter(c => (c.id === args[0]));

            if(!contractArray[0]) return message.reply("that contract doesn't exist, or you haven't unlocked it yet. View your current contracts with `city!contracts`");

            var contract = contractArray[0];

	    sqlite.get('SELECT * FROM projects WHERE guildId = ?', [message.guild.id])
	    .then(guild => {
		if(!guild) {
			const contractString = JSON.stringify(contractArray[0]);
			sqlite.get('SELECT users FROM guilds WHERE id = ?', [message.guild.id])
			.then(guild => {
				var users = JSON.parse(guild.users);
				var cuUser = users.filter(u => (u.id === message.author.id));
				console.log(cuUser);
				var userString = JSON.stringify(cuUser);
				sqlite.run('INSERT INTO projects (guildId, details, workers) VALUES (?, ?, ?)', [message.guild.id, contractString, userString]);

				message.channel.send('', {embed: {
					title: "Construction START!",
					description: "**<@" + message.author.id + ">** is now working on `" + contract.title + "`."
				}})
			});
		} else {
			const contractDetails = JSON.parse(guild.details);
			const workers = JSON.parse(guild.workers);
			var userIsWorking = workers.filter(w => (w.id === message.author.id));
			if(contractDetails.id !== args) return message.reply('You may only work on the current project, `' + contractDetails.title + '`.');
			if(userIsWorking) return message.reply('You are already working on the project!');

			sqlite.get('SELECT users FROM guilds WHERE id = ?', [message.guild.id])
			.then(guild => {
				var users = JSON.parse(guild.users);
				var cuUser = users.filter(u => (u.id === message.author.id));
				var userString = JSON.parse(cuUser[0]);

				workers.push(userString);
				const workerString = JSON.stringify(workers);
				sqlite.run('UPDATE projects SET workers = ? WHERE guildId = ?', [workerString, message.guild.id]);
			});
		}
	    });
        });
    }
}
