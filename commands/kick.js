const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Message } = require("discord.js");
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member.")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to kick").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the kick")
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason") || "N/A";
    const member =
      interaction.guild.members.cache.get(target.id) ||
      (await interaction.guild.members.fetch(target.id).catch((err) => {}));
    const memberRoles = interaction.member.roles.cache.map((r) => r.id);
    if (!memberRoles.some((v) => config.allowRoles.includes(v)))
      return interaction.reply(
        "You do not have permission to execute this command!"
      );

    const embed = new MessageEmbed()
      .setColor("#ff8000")
      .setTitle(`Kicked ${target.username}`)
      .addFields(
        { name: "Username", value: target.tag },
        { name: "ID", value: target.id },
        { name: "Reason", value: reason },
        {
          name: "Responsible Moderator",
          value: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
        },
        {
          name: "Time",
          value: `<t:${Math.floor(Date.now() / 1000)}:f>\n<t:${Math.floor(
            Date.now() / 1000
          )}:R>`,
        }
      );

    interaction.guild.channels.cache
      .get(config.channels.logs)
      .send({ embeds: [embed] });

    await interaction.reply({
      content: `**Kicked ${target.username}**\nReason: ${reason}`,
    });

    await member.send(
      `You were kicked from ${config.server_name}!\nReason: ${reason}`
    );

    await member.kick(reason);
  },
};
