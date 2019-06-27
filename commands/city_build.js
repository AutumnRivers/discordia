const sqlite = require('sqlite');
sqlite.open('./database.sqlite');

module.exports = {
    name: 'build',
    description: 'This is where the magic happens!',
    execute(message, args) {
        if(!args || args == '') return message.reply('please enter a contract ID! (`city!contracts`)');

        sqlite.get('SELECT * FROM guilds WHERE id = ?', [message.guild.id])
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
					.then(cuGuild => {
						var users = JSON.parse(cuGuild.users);
						var cuUser = users.filter(u => (u.id === message.author.id));

						if(Number(cuUser[0].stamina) === 0) return message.reply('you cannot work, your stamina is at zero! Replinish by sleeping, by chatting, or by visiting the resturaunt.');

						cuUser.sectionAssigned = 1;
						console.log(cuUser);
						var userString = JSON.stringify(cuUser);
						sqlite.run('INSERT INTO projects (guildId, details, workers, sections) VALUES (?, ?, ?, ?)', [message.guild.id, contractString, userString, contract.sections]);

						message.channel.send('', {embed: {
							title: "Construction START!",
							description: "**<@" + message.author.id + ">** is now working on `" + contract.title + "`."
						}});

						var cuUser = cuUser[0];

						var speed = Number(cuUser.speed);
						var time = Number(contract.sectionTimes);

						setTimeout(function() {
							var stamina = Number(cuUser.stamina);
							stamina -= 1;
							cuUser.stamina = stamina;
							var sections = contract.sections;
							sections -= 1;
							message.channel.send('<@' + message.author.id + '>', {embed: {
								title: "Construction BREAK!",
								description: "**" + message.author.username + "** has finished their section on `" + contract.title + "`, and is now at " + cuUser.stamina + " stamina.",
								color: 490927
							}});
							var users = JSON.parse(city.users);
							var index;
							for(x = 0; x < users.length; x++) {
								if(users[x].id !== cuUser.id) return;
								index = x;
							}

							users[index] = cuUser;
							var usersString = JSON.stringify(users);
							
							sqlite.run('UPDATE guilds SET users = ? WHERE id = ?', [usersString, message.guild.id]);

							sqlite.get('SELECT * FROM projects WHERE guildId = ?', [message.guild.id])
							.then(project => {
								var workers = JSON.parse(project.workers);
								workers.splice(0, 1);
								var workerString = JSON.stringify(workers);
								sqlite.run('UPDATE projects SET sections = ?, workers = ? WHERE guildId = ?', [sections, workerString, message.guild.id]);
							})
						}, time / speed);
					});
				} else {
					const contractDetails = JSON.parse(guild.details);
					const workers = JSON.parse(guild.workers);
					var userIsWorking = workers.filter(w => (w.id === message.author.id));
					if(contractDetails.id !== args[0]) return message.reply('You may only work on the current project, `' + contractDetails.title + '`.');
					if(userIsWorking[0]) return message.reply('You are already working on the project!');

					sqlite.get('SELECT * FROM guilds WHERE id = ?', [message.guild.id])
					.then(cuGuild => {
						var users = JSON.parse(cuGuild.users);
						var workers = JSON.parse(guild.workers);
						var contractDetails = JSON.parse(guild.details);
						var cuUser = users.filter(u => (u.id === message.author.id));

						if(Number(cuUser[0].stamina) === 0) return message.reply('you cannot work, your stamina is at zero! Replinish by sleeping, by chatting, or by visiting the resturaunt.');

						var assignedSection;
						var guildSections = Number(guild.sections);

						for(var sa = 1; sa < guildSections + 1; sa++) {
							console.log(sa);
							var userAssigned = workers.filter(w => {w.sectionAssigned === sa});
							if(userAssigned[0]) return;
							assignedSection = sa;
							break; //Stop the loop, we only need the earliest section available
						}

						if(!assignedSection) return message.reply('the workforce is full right now! Please check back later, or wait for the next contract.');

						cuUser[0].sectionAssigned = assignedSection;

						workers.push(cuUser[0]);

						const workerString = JSON.stringify(workers);
						sqlite.run('UPDATE projects SET workers = ? WHERE guildId = ?', [workerString, message.guild.id]);

						message.channel.send('', {embed: {
							title: "Construction CONTINUE!",
							description: "**<@" + message.author.id + ">** is now working on `" + contract.title + "`."
						}});

						var cuUser = cuUser[0];

						var speed = Number(cuUser.speed);
						var time = Number(contract.sectionTimes);

						setTimeout(function() {
							var stamina = Number(cuUser.stamina);
							stamina -= 1;
							cuUser.stamina = stamina;

							sqlite.get('SELECT * FROM projects WHERE guildId = ?', [message.guild.id])
							.then(project => {
								var sections = project.sections;
								sections -= 1;
								
								message.channel.send('<@' + message.author.id + '>', {embed: {
									title: "Construction BREAK!",
									description: "**" + message.author.username + "** has finished their section on `" + contract.title + "`, and is now at " + stamina + " stamina.",
									color: 490927
								}});
								var users = JSON.parse(city.users);
								var index;
								for(x = 0; x < users.length; x++) {
									if(users[x].id !== cuUser.id) return;
									index = x;
									break;
								}

								users[index] = cuUser;
								var usersString = JSON.stringify(users);
								
								sqlite.run('UPDATE guilds SET users = ? WHERE id = ?', [usersString, message.guild.id]);

								var workers = JSON.parse(project.workers);
								var workerIndex;
								for(y = 0; y < workers.length; y++) {
									if(workers[y].id !== cuUser.id) return;
									workerIndex = y;
									break;
								}
								console.log(workerIndex);
								workers.splice(workerIndex, 1);
								var workerString = JSON.stringify(workers);
								sqlite.run('UPDATE projects SET sections = ?, workers = ? WHERE guildId = ?', [sections, workerString, message.guild.id]);

								console.log(sections);

								if(sections === 0) {
									var buildings = JSON.parse(cuGuild.buildings);
									var details = JSON.parse(guild.details);
									buildings.push(details.id);
									var buildingString = JSON.stringify(buildings);
									sqlite.run('DELETE FROM projects WHERE guildId = ?', [message.guild.id]);
									sqlite.run('UPDATE guilds SET buildings = ? WHERE id = ?', [buildingString, message.guild.id]);
	
									message.channel.send('', {embed: {
										title: "Construction COMPLETE!",
										description: "**Congratulations!**\n\n`" + contract.title + "` has been finished and is now available in your city!",
										color: 503575
									}});
								}

							});
						}, time / speed);
					});
				}
			});
        });
    }
}
