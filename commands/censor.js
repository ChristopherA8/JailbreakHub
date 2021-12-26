const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs')
const censored = require('../censored.json')
const config = require('../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('censor')
		.setDescription('Configure censored words')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a censored word')
				.addStringOption(option => option.setName('word').setDescription('The word to censor').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a censored word')
				.addStringOption(option => option.setName('word').setDescription('The word to remove').setRequired(true))
		),
	async execute(interaction) {
		const censorWord = interaction.options.getString('word');
		const memberRoles = interaction.member.roles.cache.map(r => r.id)
        if (!memberRoles.some(v => config.allowRoles.includes(v))) return interaction.reply('You do not have permission to execute this command!');

		if (interaction.options.getSubcommand() === "add") {
			for (i in censored) {
				if (censored[i] === censorWord) return interaction.reply('That word is already censored!')
			}
			fs.readFile('censored.json', function readFile(err, data) {
				if (err) return console.log(`ERROR: ${err}`)
				var obj = JSON.parse(data)
				obj.push(censorWord)
				json = JSON.stringify(obj)
				fs.writeFileSync('censored.json', json)
			})
			return interaction.reply(`Censored the word "${censorWord}"!`)

		} else if (interaction.options.getSubcommand() === "remove") {
			for (i in censored) {
				if (censored[i] === censorWord) {
					fs.readFile('censored.json', function readFile(err, data) {
						if (err) return console.log(`ERROR: ${err}`)
						var obj = JSON.parse(data)
						obj.splice(i)
						json = JSON.stringify(obj)
						fs.writeFileSync('censored.json', json)
					})
					return interaction.reply(`Removed censor for the word "${censorWord}"!`)
				}
			}
			return interaction.reply('That word is not censored!')

		} else return interaction.reply("Invalid option.")
	},
};
