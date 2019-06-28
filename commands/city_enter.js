const sqlite = require('sqlite');
sqlite.open('./database.sqlite');

module.exports = {
    name: 'enter',
    description: 'Enter city buildings.',
    execute(message, args) {
        if(!args[0]) return message.reply('please indicate what building you\'d like to go to!');

        sqlite.get('SELECT buildings FROM guilds WHERE id = ?', [message.guild.id])
        .then(b => {
            var buildings = JSON.parse(b.buildings);

            if(!buildings.includes(args[0])) return message.reply('you haven\'t built that yet, or you entered an incorrect ID. `city!tour`');

            if(args[0].toLowerCase() == 'tutorial') ctOS(message);
            
            if(args[0].toLowerCase() == 'resturaunt') resturaunt(message);

            if(args[0].toLowerCase() == 'gamecenter') gameCenter(message);
            
            if(args[0].toLowerCase() == 'park') park(message);

            if(args[0].toLowerCase() == 'rechall') handler(message);
        })
    }
}

function ctOS(message) {
    sqlite.get('SELECT * FROM guilds WHERE id = ?', [message.guild.id])
    .then(g => {
        const users = JSON.parse(g.users);
        var buildings = JSON.parse(g.buildings);

        message.channel.send('', {embed: {
            title: 'ctOS Database',
            description: 'The database seems to be unlocked, with a note saying "You\'re welcome. - The Fox" on the screen. Weird.',
            fields: [
                {
                    name: 'Registered Users',
                    value: users.length
                },
                {
                    name: 'Buildings',
                    value: buildings.length
                },
                {
                    name: 'City Creation Date',
                    value: (message.guild.me.joinedAt).toString()
                }
            ],
            image: {
                url: 'https://i.ytimg.com/vi/J1TU86aGrcg/hqdefault.jpg'
            }
        }})
    })
}

function resturaunt(message) {
    sqlite.get('SELECT * FROM guilds WHERE id = ?', [message.guild.id])
    .then(g => {
        const msg = message.channel.send('', {embed: {
            title: "Teruteru's World-Class Resturaunt",
            description: "Teruteru: Ah, welcome to my resturaunt! What shall I get you today?",
            image: {
                url: 'https://vignette.wikia.nocookie.net/danganronpa/images/c/cc/Teruteru_Hanamura_Halfbody_Sprite_%2815%29.png/revision/latest?cb=20170817120829'
            },
            fields: [
                {
                    name: '1. Citranium (Cost: 30 Minutes)',
                    value: 'Restores 2 Stamina.'
                },
                {
                    name: '2. Meat On The Bone (Cost: 5 Stamina & 20 Minutes)',
                    value: 'Increases max stamina by 1.'
                },
                {
                    name: '3. Wumpus Cake (Free!)',
                    value: "Doesn't do anything, it's just tasty."
                },
                {
                    name: '4. Alligatorade (Cost: 3 Stamina & 10 Minutes)',
                    value: 'Increases speed by 0.2'
                }
            ]
        }})

        function collectOrder(message) {
            const filter = m => m.author == message.author; // Only look for messages by the author

            message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                var users = JSON.parse(g.users);
                const cuUser = users.filter(u => (u.id === message.author.id));
                if(collected.first().content === '1') {
                    if(Number(cuUser[0].stamina) >= (Number(cuUser[0].maxStamina) - 1)) return message.channel.send('', {embed: {
                        title: 'Transaction failed.',
                        description: "Teruteru: A-Aren't you already hyper enough? (Max stamina reached.)",
                        image: {
                            url: 'https://vignette.wikia.nocookie.net/danganronpa/images/c/cf/Teruteru_Hanamura_Halfbody_Sprite_%284%29.png/revision/latest?cb=20170817120820'
                        }
                    }})
                    message.channel.send('', {embed: {
                        title: 'You ordered Citranium!',
                        description: 'Teruteru: Consider it done! Just give me half an hour, this stuff is not easy to find.',
                        image: {
                            url: 'https://vignette.wikia.nocookie.net/danganronpa/images/f/f6/Teruteru_Hanamura_Halfbody_Sprite_%2812%29.png/revision/latest?cb=20170817120826'
                        }
                    }})

                    setTimeout(() => {
                        message.channel.send('<@' + message.author.id + '>', {embed: {
                            title: 'Your Citranium is ready!',
                            description: "Teruteru: Nothing to it! Just had to pry it from a few sentry turrets.\n\n(2 Stamina restored.)",
                            image: {
                                url: 'https://vignette.wikia.nocookie.net/danganronpa/images/c/cc/Teruteru_Hanamura_Halfbody_Sprite_%2815%29.png/revision/latest?cb=20170817120829'
                            }
                        }});

                        var stamina = Number(cuUser[0].stamina);
                        stamina += 2;
                        cuUser[0].stamina = stamina;

                        var index;
                        for(x = 0; x < users.length; x++) {
                            if(users[x].id !== cuUser.id) return;
                            index = x;
                            break;
                        }

                        users[index] = cuUser[0];
                        var usersString = JSON.stringify(users);
                        
                        sqlite.run('UPDATE guilds SET users = ? WHERE id = ?', [usersString, message.guild.id]);
                    }, 1800000);
                } else if(collected.first().content === '2') {
                    if(Number(cuUser[0].stamina) < 5) return message.channel.send('', {embed: {
                        title: 'Transaction failed.',
                        description: "Teruteru: You don't have enough stamina for that yet!",
                        image: {
                            url: 'https://vignette.wikia.nocookie.net/danganronpa/images/a/ae/Teruteru_Hanamura_Halfbody_Sprite_%2810%29.png/revision/latest?cb=20170817120825'
                        }
                    }});
                    if(Number(cuUser[0].maxStamina) >= 17) return message.channel.send('', {embed: {
                        title: 'Transaction failed.',
                        description: "Teruteru: I think that's enough for now.\n\n(Max stamina threshold reached.)",
                        image: {
                            url: 'https://vignette.wikia.nocookie.net/danganronpa/images/b/b5/Teruteru_Hanamura_Halfbody_Sprite_%2813%29.png/revision/latest?cb=20170817120827'
                        }
                    }})
                    message.channel.send('', {embed: {
                        title: 'You ordered Meat on The Bone!',
                        description: "Teruteru: Ah yes, a wise choice indeed. Though something about it brings back bad memories...",
                        image: {
                            url: 'https://vignette.wikia.nocookie.net/danganronpa/images/b/b5/Teruteru_Hanamura_Halfbody_Sprite_%2813%29.png/revision/latest?cb=20170817120827'
                        }
                    }})

                    setTimeout(() => {
                        message.channel.send('<@' + message.author.id + '>', {embed: {
                            title: 'Your Meat on the Bone is ready!',
                            description: "Teruteru: I've made this more times than I can count, no sweat!\n\n(Max stamina increased by 1)",
                            image: {
                                url: 'https://vignette.wikia.nocookie.net/danganronpa/images/c/cc/Teruteru_Hanamura_Halfbody_Sprite_%2815%29.png/revision/latest?cb=20170817120829'
                            }
                        }});

                        var maxStamina = Number(cuUser[0].maxStamina);
                        maxStamina += 1;
                        var stamina = Number(cuUser[0].stamina);
                        stamina -= 5;
                        cuUser[0].maxStamina = maxStamina;
                        cuUser[0].stamina = stamina;

                        var index;
                        for(x = 0; x < users.length; x++) {
                            if(users[x].id !== cuUser.id) return;
                            index = x;
                            break;
                        }

                        users[index] = cuUser[0];
                        var usersString = JSON.stringify(users);
                        
                        sqlite.run('UPDATE guilds SET users = ? WHERE id = ?', [usersString, message.guild.id]);
                    }, 1200000);
                } else if(collected.first().content === '3') {
                    message.channel.send('', {embed: {
                        title: 'You ordered the Wumpus Cake!',
                        description: "Teruteru: Good taste, good taste! You should come by more often!\n\n(You feel a bit more relaxed now.)",
                        image: {
                            url: 'https://vignette.wikia.nocookie.net/danganronpa/images/e/e6/Teruteru_Hanamura_Halfbody_Sprite_%288%29.png/revision/latest?cb=20170817120823'
                        }
                    }})
                } else if(collected.first().content === '4') {
                    if(Number(cuUser[0].stamina) < 3) return message.channel.send('', {embed: {
                        title: 'Transaction failed.',
                        description: "Teruteru: You don't have enough stamina for that yet!",
                        image: {
                            url: 'https://vignette.wikia.nocookie.net/danganronpa/images/a/ae/Teruteru_Hanamura_Halfbody_Sprite_%2810%29.png/revision/latest?cb=20170817120825'
                        }
                    }});
                    if(Number(cuUser[0].speed) > 2.9) return message.channel.send('', {embed: {
                        title: 'Transaction failed.',
                        description: "Teruteru: You should slow down first.\n\n(Maximum speed threshold reached.)"
                    }});
                    if(cuUser[0])
                    message.channel.send('', {embed: {
                        title: 'You ordered Alligatorade!',
                        description: 'Teruteru: Rumor has it they put actual alligators in these...',
                        image: {
                            url: 'https://vignette.wikia.nocookie.net/danganronpa/images/3/3f/Teruteru_Hanamura_Halfbody_Sprite_%2821%29.png/revision/latest?cb=20170817120912'
                        }
                    }});

                    setTimeout(() => {
                        message.channel.send('', {embed: {
                            title: 'You ordered Alligatorade!',
                            description: 'Teruteru: I hope that rumor is not true...\n\n(Speed increased by 0.2!)',
                            image: {
                                url: 'https://vignette.wikia.nocookie.net/danganronpa/images/3/3f/Teruteru_Hanamura_Halfbody_Sprite_%2821%29.png/revision/latest?cb=20170817120912'
                            }
                        }});
                        var speed = Number(cuUser[0].speed);
                        speed += 0.2;
                        var stamina = Number(cuUser[0].stamina);
                        stamina -= 3;
                        cuUser[0].speed = speed;
                        cuUser[0].stamina = stamina;

                        var index;
                        for(x = 0; x < users.length; x++) {
                            if(users[x].id !== cuUser.id) return;
                            index = x;
                            break;
                        }

                        users[index] = cuUser[0];
                        var usersString = JSON.stringify(users);
                        
                        sqlite.run('UPDATE guilds SET users = ? WHERE id = ?', [usersString, message.guild.id]);
                    }, 600000);
                } else if(collected.first().content === 'cancel') {
                    message.reply('you cancelled your order.');
                } else {
                    message.channel.send('', {embed: {
                        title: 'Invalid Response',
                        description: "Teruteru: I'm pretty sure we don't sell that here... (Type `cancel` if you would like to exit)",
                        image: {
                            url: 'https://vignette.wikia.nocookie.net/danganronpa/images/f/f7/Teruteru_Hanamura_Halfbody_Sprite_%2822%29.png/revision/latest?cb=20170817120916'
                        }
                    }})

                    collectOrder(message);
                }
            })
        }

        collectOrder(message);
    })
}

function gameCenter(message) {
    message.channel.send('', {embed: {
        title: 'Discord Game Center',
        description: '???: Oh, you made this? Hold on, let me finish up this game first.\n\n(It doesn\'t seem like you\'ll be able to use the Game Center anytime soon...)',
        image: {
            url: 'https://vignette.wikia.nocookie.net/danganronpa/images/1/16/Chiaki_Nanami_Halfbody_Sprite_%283%29.png/revision/latest?cb=20170818170152'
        }
    }});
}

function park(message) {
    const events = ['mahiru', 'dog', 'wumpus', 'marcus'];
    var event = events[Math.floor(Math.random()*events.length)];

    if(event === 'mahiru') {
        message.channel.send('', {embed: {
            title: 'City Park',
            description: 'You go to the park and meet a red-haired girl, who suddenly takes your picture with a smile!',
            image: {
                url: 'https://vignette.wikia.nocookie.net/danganronpa/images/d/d5/Mahiru_Koizumi_Halfbody_Sprite_%282%29.png/revision/latest?cb=20170819091752'
            }
        }})
    } else if(event === 'dog') {
        message.channel.send('', {embed :{
            title: 'City Park',
            description: 'You go to the park and see a dog running around!',
            image: {
                url: 'https://media.giphy.com/media/3oKIPBfuK97oOqvx6w/giphy.gif'
            }
        }})
    } else if(event === 'wumpus') {
        message.channel.send('', {embed: {
            title: 'City Park',
            description: 'As you\'re walking through the park, you nearly get run over by a speeding Wumpus!',
            image: {
                url: 'https://cdn.discordapp.com/attachments/377282421504344065/594013215164203018/hack_wump.png'
            }
        }})
    } else {
        message.channel.send('', {embed: {
            title: 'City Park',
            description: 'While walking through the park, you see a man start running atop buildings around the park. He doesn\'t seem to be slowing down.',
            image: {
                url: 'https://vignette.wikia.nocookie.net/watchdogscombined/images/e/eb/Marcus_Holloway_running.jpg/revision/latest?cb=20160611203441'
            }
        }})
    }
}

function handler(message) {
    message.reply("that feature isn't available yet!");
}