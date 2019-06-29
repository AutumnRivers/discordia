module.exports = {
    name: 'city',
    description: 'The city help message for Discordia',
    execute(message, args) {
        message.channel.send('', {embed: {
            title: 'Discordia City Help',
            color: '7506394',
            fields:[
                {
                    name: 'Building',
                    value: '`city!build <contract ID>` allows you to get started on building a building, assuming it\'s available in your contracts.'
                },
                {
                    name: 'Touring',
                    value: '`city!tour` allows you to look around your city, see what has been built, and the overall mood of it.'
                },
                {
                    name: 'Leaderboards',
                    value: '`city!leaderboards` Your city isn\'t the only one to exist! You are facing against others. Are you on top?'
                },
                {
                    name: 'Status',
                    value: '`city!status` This shows the status of current construction projects. Workers can use this while working!'
                },
                {
                    name: 'Entering Buildings',
                    value: 'Entering a building allows you to use its commands. For example, `city!enter Rec Hall` will let you use the fun commands!'
                },
                {
                    name: 'Weather Forecast',
                    value: 'Your city has got a climate. Pay attention to your weather. Sometimes, it *is* dangerous outside...'
                },
                {
                    name: 'Viewing Contracts',
                    value: '`city!contracts` will list all your city\'s current contracts. One day, you won\'t have any! Imagine that... :relieved:'
                }
            ],
            thumbmnail: {
                url: 'https://cdn.discordapp.com/avatars/592864045934051358/ec3e776c4feedce8afee97a888253002.png?size=1024'
            }
        }});
    }
}