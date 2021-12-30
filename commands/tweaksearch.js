const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tweaksearch")
    .setDescription("Search for a jailbreak tweak using the Parcility API.")
    .addStringOption((option) =>
      option.setName("query").setDescription("Name of tweak").setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("page").setDescription("Page number")
    ),
  async execute(interaction) {
    const query = interaction.options.getString("query");
    const page = interaction.options.getNumber("page") || 1;
    async function getData() {
      const data = await fetch(`https://api.parcility.co/db/search?q=${query}`);
      return data.json();
    }
    var data = await getData();
    if (data.status === false)
      return interaction.reply(
        "Error in finding tweak. Are you sure you spelled it correctly?"
      );
    var items = data.data.length;
    var currentPage = data.data[page - 1];
    if (page <= 0) return interaction.reply("Invalid page number.");
    if (page > items) return interaction.reply("Could not find that page!");
    if (String(currentPage.Icon).includes("file:")) {
      var icon = currentPage.repo.icon;
    } else {
      var icon = currentPage.Icon;
    }

    const embed = new MessageEmbed()
      .setColor("#0064FF")
      .setTitle(`Tweak Search for ${query} | Page ${page}`)
      .setThumbnail(icon)
      .addFields(
        {
          name: "Name",
          value: currentPage.Name,
        },
        {
          name: "Author",
          value: currentPage.Author,
        },
        {
          name: "Repo",
          value: currentPage.repo.url,
        }
      )
      .setFooter(`Page ${page}/${items}\nPowered by Parcility`);

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(currentPage.repo.url)
        .setLabel("Repo")
        .setStyle("LINK")
    );

    interaction.reply({ embeds: [embed], components: [buttons] });
  },
};
