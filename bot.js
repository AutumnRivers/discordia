const Discord = require('discord.js');
const bot = new Discord.Client();
const ytdl = require('ytdl-core');
const fs = require('fs');
const youtube = require('youtube-search');
const sqlite = require('sqlite');
const config = require('./config.json');

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

class Person {
    constructor(id, stamina, speed, records) {
        this.id = id;
        this.stamina = stamina;
        this.speed = speed;
        this.records = records;
    }
}

function updatePerson(updatedStamina, updatedSpeed, id, member, records, cuUsers) {
    var stamina;
    var speed;

    if(member.premiumSince) {
        stamina = updatedStamina + 5;
        speed = updatedSpeed + 2;
    } else {
        stamina = updatedStamina;
        speed = updatedSpeed;
    }

    if(!records) records = [];

    var p = new Person(id, stamina, speed, records);

    if(!cuUsers) {
        var pString = JSON.stringify([p]);

        sqlite.run('UPDATE guilds SET users = ? WHERE id = ?', [pString, member.guild.id]);
    } else {
        cuUsers.push(p);

        var cString = JSON.stringify(cuUsers);

        sqlite.run('UPDATE guilds SET users = ? WHERE id = ?', [cString, member.guild.id]);
    }
}

sqlite.open('./database.sqlite');

bot.login(config.token);

bot.on('ready', () => {
    console.log('Connected to Discord!');
    bot.user.setActivity(bot.guilds.size + ' cities grow! | city!help', { type: 'WATCHING' });
});

bot.on('disconnect', () => {
    console.log('Disconnected from Discord.');
});

bot.on('guildCreate', guild => {
    sqlite.get('SELECT * FROM guilds WHERE id = ?', [guild.id])
    .then(guildInfo => {
        if(!guildInfo) {
            sqlite.run('INSERT INTO guilds (id, level, title, buildings, prefix, users, queue) VALUES (?, ?, ?, ?, ?, ?, ?)', [guild.id, 0, guild.name, undefined, undefined, '[]', undefined])
            .then(() => {
                console.log('Registered ' + guild.name + ' to the database.');
            });
        };
    });
});

bot.on('message', message => {
    if(message.author.bot) return;
    
    sqlite.get(`SELECT prefix FROM guilds WHERE id = ${message.guild.id}`)
    .then(guildPrefix => {
        if(!guildPrefix.prefix) prefix = config.defaultPrefix;
        if(guildPrefix.prefix) prefix = guildPrefix.prefix;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        
        if(!message.content.startsWith(prefix)) return;

        sqlite.get(`SELECT users FROM guilds WHERE id = ${message.guild.id}`)
        .then(users => {
            if(!users.users) {
                updatePerson(5, 1, message.author.id, message.member);
            } else {
                var usersObject = JSON.parse(users.users);

                var currentUser = usersObject.find(o => o.id === message.author.id);

                if(!currentUser) {
                    updatePerson(5, 1, message.author.id, message.member, usersObject);
                }
            }
        });

        if (!bot.commands.has(command)) return;

        try {
            bot.commands.get(command).execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }

    });
});
