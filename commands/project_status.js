const sqlite = require('sqlite');
sqlite.open('./database.sqlite');

module.exports = {
    name: 'status',
    description: 'Shows status of the current project.',
    execute(message, args) {
        sqlite.get('SELECT * FROM projects WHERE guildId = ?', [message.guild.id])
        .then(project => {
            if(!project) return message.channel.send('', {embed: {
                title: "Projects for " + message.guild.name,
                description: "There is no current project running! Why not start one? :thinking: `city!contracts`"
            }});

            const contract = JSON.parse(project.details);
            const workers = JSON.parse(project.workers);
            var workerNum;

            if(!workers[0]) {
                workerNum = 'There are no workers on duty! Help your city out with `city!build ' + contract.id + '`!'
            } else {
                workerNum = 'There are currently ' + workers.length + ' workers on duty.'
            }

            message.channel.send('', {embed: {
                title: 'Projects for ' + message.guild.name,
                fields:[
                    {
                        name: 'Current Project',
                        value: contract.title
                    },
                    {
                        name: 'Workers',
                        value: workerNum
                    },
                    {
                        name: 'Sections Left',
                        value: project.sections
                    }
                ]
            }});
        })
    }
}