const sqlite = require('sqlite');
sqlite.open('./database.sqlite');
const fs = require('fs');
const contractFiles = fs.readdirSync('./contracts').filter(file => file.endsWith('.json'));

module.exports = {
    name: 'build',
    description: 'This is where the magic happens!',
    execute(message, args, bot) {
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
							var sections = Number(contract.sections);
							sections -= 1;
							
							var users = JSON.parse(city.users);
							var index;
							for(x = 0; x < users.length; x++) {
								if(users[x].id == cuUser.id) index = x;
							}

							users[index] = cuUser;
							var usersString = JSON.stringify(users);
							
							sqlite.run('UPDATE guilds SET users = ? WHERE id = ?', [usersString, message.guild.id]);

							sqlite.get('SELECT * FROM projects WHERE guildId = ?', [message.guild.id])
							.then(project => {
								var workers = JSON.parse(project.workers);
								workers.splice(0, 1);
								var workerString = JSON.stringify(workers);
								console.log(sections);
								console.log(workerString);
								sqlite.run('UPDATE projects SET sections = ?, workers = ? WHERE guildId = ?', [sections, workerString, message.guild.id]);

								message.channel.send('<@' + message.author.id + '>', {embed: {
									title: "Construction BREAK!",
									description: "**" + message.author.username + "** has finished their section on `" + contract.title + "`, and is now at " + cuUser.stamina + " stamina.",
									color: 490927
								}});
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
					sqlite.get('SELECT * FROM projects WHERE guildId = ?', [message.guild.id])
					.then(guild => {
						var users = JSON.parse(cuGuild.users);
						var workers = JSON.parse(guild.workers);
						var contractDetails = JSON.parse(guild.details);
						var cuUser = users.filter(u => (u.id === message.author.id));

						if(Number(cuUser[0].stamina) === 0) return message.reply('you cannot work, your stamina is at zero! Replinish by sleeping, by chatting, or by visiting the resturaunt.');

						var assignedSection;
						var guildSections = Number(guild.sections);

						for(var sa = 1; sa < guildSections + 1; sa++) {

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
						var time = Number(contractDetails.sectionTimes);

						setTimeout(function() {
							var stamina = Number(cuUser.stamina);
							stamina -= 1;
							cuUser.stamina = stamina;

							sqlite.get('SELECT * FROM projects WHERE guildId = ?', [message.guild.id])
							.then(project => {
								var sections = Number(project.sections);
								sections -= 1;
								
								message.channel.send('<@' + message.author.id + '>', {embed: {
									title: "Construction BREAK!",
									description: "**" + message.author.username + "** has finished their section on `" + contract.title + "`, and is now at " + stamina + " stamina.",
									color: 490927
								}});
								var users = JSON.parse(city.users);
								var index;
								for(x = 0; x < users.length; x++) {
									if(users[x].id == message.author.id) index = x;
								}

								users[index] = cuUser;
								var usersString = JSON.stringify(users);
								
								sqlite.run('UPDATE guilds SET users = ? WHERE id = ?', [usersString, message.guild.id]);

								var workers = JSON.parse(project.workers);
								var workerIndex;
								for(y = 0; y < workers.length; y++) {
									if(workers[y].id !== message.author.id) return;
									workerIndex = y;
									break;
								}

								console.log(sections);

								workers.splice(workerIndex, 1);
								var workerString = JSON.stringify(workers);
								sqlite.run('UPDATE projects SET sections = ?, workers = ? WHERE guildId = ?', [sections, workerString, message.guild.id]);

								if(sections === 0) {
									var buildings = JSON.parse(city.buildings);
									var details = JSON.parse(guild.details);
									buildings.push(details.id);
									var buildingString = JSON.stringify(buildings);
									sqlite.run('DELETE FROM projects WHERE guildId = ?', [message.guild.id]);
									sqlite.run('UPDATE guilds SET buildings = ?, contracts = ? WHERE id = ?', [buildingString, '[]', message.guild.id]);

									sqlite.get('SELECT * FROM guilds WHERE id = ?', [message.guild.id])
									.then(g => {
										var contracts = JSON.parse(g.contracts);
										var buildingNum = Number(buildings.length);
										var contractIndex;

										for(var c = 0; c > contracts.length; c++) {
											if(contracts[c].id == details.id || contracts[c].buildingsRequired != (buildingNum - 1)) return;
											contractIndex = c;
										}

										findContracts(buildings, contract).then(remainingContracts => {

											var contractsString = JSON.stringify(remainingContracts);

											console.log(contractsString);
			
											message.channel.send('', {embed: {
												title: "Construction COMPLETE!",
												description: "**Congratulations!**\n\n`" + contract.title + "` has been finished and is now available in your city!",
												color: 503575
											}});

											setTimeout(() => {
												sqlite.run('UPDATE guilds SET contracts = $c WHERE id = $i', [$c=contractsString, $i=message.guild.id])
												.then(data => {
													
												})
												.catch(err => {
													if(err) console.error(err);
												});
											}, 1000);
										})
									})
								}
							});
						}, time / speed);
					});
				})
				};
			});
        });
    }
}

async function findContracts(buildings, contract) {
	var rContracts = [];

	const forPromise = new Promise((resolve, reject) => {
		for(const file of contractFiles) {
			const contract = require(`../contracts/${file}`);
			const buildingNum = buildings.length;
			const buildingReq = Number(contract.buildingsRequired);
			if(buildingReq == buildingNum) rContracts.push(contract);
		}

		resolve(rContracts);
	});
	
	const contracts = await forPromise;

	if(!contracts[0]) return [];

	return contracts;
}

async function findRemaining(guild) {
	var contracts = JSON.parse(guild.contracts);

	const remPromise = new Promise((resolve, reject) => {
		var contractIndex;

		

		resolve(contractIndex);
	});

	const result = await remPromise;

	return result;
}