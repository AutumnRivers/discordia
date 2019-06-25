module.exports = {
    name: 'git',
    description: 'Allows you to view the GitHub Repo.',
    execute(message, args) {
        message.channel.send('', {embed: {
            title: 'Discordia is open source!',
            description: "The world is expanding. More programs are coming. That's scary. But it's not so scary when that project is open sourced. That's why I made Discordia open sourced! (That, and all my projects are open source anyway, and it's one of the requirements for hack week... yeah.) Anyway, [check it](https://www.github.com/SmartieCodes/discordia)!",
            color: '7506394'
        }});
    }
}