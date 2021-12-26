const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check')
		.setDescription('Check if you have the allowed role for this bot.'),
	async execute(interaction) {
        const memberRoles = interaction.member.roles.cache.map(r => r.id)
        if (memberRoles.some(v => config.allowRoles.includes(v))) {
            return interaction.reply('You are allowed to moderate using this bot!');
        } else {
		    return interaction.reply('You are not allowed to moderate using this bot.');
        }
	},
};