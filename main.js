const Globals = require("./bin/Globals.js");
const Translator = require("./bin/Translator/Translator");
const Discord = require("discord.js");
const Key = require("./conf/botkey.js");
const FightManager = require("./bin/FightManager");
const crypto = require("crypto");
const AreasManager = require("./bin/Areas/AreasManager.js");
const conf = require("./conf/conf");
const DatabaseInitializer = require("./bin/DatabaseInitializer");
const ModuleHandler = require("./bin/Modules/ModuleHandler");
const User = require("./bin/User");
const LootSystem = require("./bin/LootSystem");
const DBL = require("dblapi.js");
const WorldBossSpawner = require("./bin/WorldBosses/WorldBossSpawner");
const options = {
    webhookPort: 5000,
    webhookAuth: conf.webhookkey
};
const dbl = new DBL(conf.discordbotskey, options);
dbl.webhook.on('ready', hook => {
    console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

if (conf.env === "prod") {

    dbl.webhook.on('vote', vote => {
        if (User.exist(vote.user)) {
            let user = new User(vote.user);
            user.loadUser();
            let ls = new LootSystem();
            ls.giveToPlayer(user.character, 41, 1, vote.isWeekend ? 2 : 1);
            let lang = user.getLang();
            let msg = Translator.getString(lang, "vote_daily", "you_voted");
            if (vote.isWeekend) {
                msg += Translator.getString(lang, "vote_daily", "vote_week_end");
            } else {
                msg += Translator.getString(lang, "vote_daily", "vote_no_week_end");
            }
            user.tell(msg);
        }

    });
}


let syncStartWith = Date.now();
let totalGameStartTime = Date.now();

process.on('unhandledRejection', up => {
    throw up
});

console.log("Initializing Database ...");
DatabaseInitializer.initialize();
console.log("Database initialized, took : " + ((Date.now() - syncStartWith) / 1000) + " seconds");



//console.log(Globals);

//let moduleHandler = new ModuleHandler();

syncStartWith = Date.now();
console.log("Loading Areas...");
Globals.areasManager = new AreasManager();
console.log("Areas loaded, took : " + ((Date.now() - syncStartWith) / 1000) + " seconds");


syncStartWith = Date.now();
console.log("Loading Fight Manager...");
Globals.fightManager = new FightManager();
console.log("Fight Manager loaded, took : " + ((Date.now() - syncStartWith) / 1000) + " seconds");

let wbs = new WorldBossSpawner();
wbs.startUp();


var connectedUsers = {};
var connectedGuilds = {};

Globals.connectedUsers = connectedUsers;
Globals.connectedGuilds = connectedGuilds;


console.log("Game World loaded, took : " + ((Date.now() - totalGameStartTime) / 1000) + " seconds");


// Load api after all 
const mHandler = new ModuleHandler();