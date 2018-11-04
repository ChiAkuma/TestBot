const config = require("./config.json");

const Discord = require("discord.js");
const client = new Discord.Client();

const fs = require("fs-extra");
const request = require('request');


client.on("ready", (ready) => {
    console.log("BOT READY!");
});

//BOT JOINED A SERVER ------------------------------------------------------------------------------------------------------
client.on("guildCreate", (guild) => {
    console.log("Joined a new guild: " + guild.name);

    fs.mkdirSync("./ServerConfig/" + guild.id);
    fs.writeFileSync("./ServerConfig/" + guild.id + "/config.json", "{\n\"prefix\": \"-\"\n}");

    guild.members.get(client.user.id).setNickname("Test Bot");
    client.user.setActivity("-help");
});

//Bot Removed From SERVER ---------------------------------------------------------------------------------------------------
client.on("guildDelete", (guild) => {
    console.log("Left a guild: " + guild.name);
    fs.removeSync("./ServerConfig/" + guild.id);
});

//Commands ------------------------------------------------------------------------------------------------------------------
client.on("message", (message) => {

    if (message.author.bot) return;

    try {
        var contents = fs.readFileSync("./ServerConfig/" + message.guild.id + "/config.json");
        var jsonContent = JSON.parse(contents);

        client.user.setActivity(jsonContent.prefix + "help");

        if (!message.content.startsWith(jsonContent.prefix)) return;
        message.content = message.content.split(jsonContent.prefix)[1];

        //Help-------------------------------------------------------------
        if (message.content.startsWith("help")) {
            message.channel.send("| Es gibt 4 Commands:\n|\n| ping                            = " + config.commands.ping + "\n| downloadConfig      = " + config.commands.downloadConfig + "\n| uploadConfig            = " + config.commands.uploadConfig + "\n|resetConfig = " + config.commands.resetConfig + "\n|\n| Diese Nachricht wird in 30 Sekunden gelöscht!").then((message) => {
                message.delete(30000);
            });
            message.delete(30000);
        }

        //ResetConfig -----------------------------------------------------
        if (message.content.startsWith("resetConfig")) {

            message.channel.send("Config wird resettet...").then((message) => {
                fs.writeFileSync("./ServerConfig/" + message.guild.id + "/config.json", "{\n\"prefix\": \"-\"\n}");

                var cc = fs.readFileSync("./ServerConfig/" + message.guild.id + "/config.json");
                var jj = JSON.parse(cc);
                cc = "";
                jj = "";

                message.delete(10000);
            });
            message.delete(10000);
        }

        //DownloadConfig---------------------------------------------------
        if (message.content.startsWith("downloadConfig")) {

            message.channel.send("Hier kannst du die Config für den Bot herunterladen.\nDer Download bleibt 30 Sekunden!",
                {
                    files: ["./ServerConfig/" + message.guild.id + "/config.json"]
                }).then((message) => {
                    message.delete(30000);
                });
            message.delete(30000);
        }

        //UploadConfig ----------------------------------------------------
        if (message.content.startsWith("uploadConfig")) {

            request.get(message.attachments.array()[0].url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var file = body;
                    // Continue with your processing here.
                    fs.writeFileSync("./ServerConfig/" + message.guild.id + "/config.json", file);

                    var cc = fs.readFileSync("./ServerConfig/" + message.guild.id + "/config.json");
                    var jj = JSON.parse(cc);
                    cc = "";
                    jj = "";

                    client.user.setActivity(jj2.prefix + "help");
                }
            });

            message.channel.send("Danke für den Upload. Die Einstellungen werden aktulisiert...\nDiese Nachricht vernichtet sich in 10 Sekunden!").then((message) => {
                message.delete(10000);
            });
            message.delete(10000);
        }

    } catch (err) {

        message.channel.send("Irgendwas ist mit der Config schief gelaufen...\nConfig wird resettet...\nNachricht wird gelöscht...").then((message) => {
            console.log(err);

            fs.writeFileSync("./ServerConfig/" + message.guild.id + "/config.json", "{\n\"prefix\": \"-\"\n}");

            var cc = fs.readFileSync("./ServerConfig/" + message.guild.id + "/config.json");
            var jj = JSON.parse(cc);

            client.user.setActivity(jj1.prefix + "help");
            cc = "";
            jj = "";

            message.delete(10000);
 
        });
    }

    //Ping -------------------------------------------------------------
    if (message.content.startsWith("ping")) {
        message.channel.send("Pong!");
    }
});

//Bot login und alles startet...---------------------------------------------------------------------------------------------
client.login(config.token);