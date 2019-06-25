module.exports = {
    name: 'help',
    description: 'The help message for Discordia',
    execute(message, args) {
        message.channel.send('', {embed: {
            title: 'Discordia Help',
            color: '7506394',
            fields:[
                {
                    name: 'General Commands',
                    value: '`me`, `info`, `server`'
                },
                {
                    name: 'City Commands',
                    value: '`build <contract ID>`, `tour`, `leaderboards`, `status`, `enter <building>`, `forecast`, `contracts`\n\nView more city commands with `<prefix>city'
                },
                {
                    name: 'Misc. Commands',
                    value: '`git`, `hackweek`'
                }
            ],
            thumbmnail: {
                url: 'https://cdn.discordapp.com/avatars/592864045934051358/ec3e776c4feedce8afee97a888253002.png?size=1024'
            }
        }});
    }
}