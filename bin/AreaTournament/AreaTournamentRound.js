const Fight = require("../Fight/Fight");
const GuildEntity = require("../Entities/GuildEntity");
const conn = require("../../conf/mysql");

class AreaTournamentRound {

    /**
     * 
     * @param {number} round Round number
     * @param {Array<number>} selectedGuilds 
     * @param {number} idArea
     */
    constructor(round, selectedGuilds, idArea) {
        this.round = round;
        this.idArea = idArea;
        this.initialGuilds = selectedGuilds;
        this.guildsPlacements = [];
        this.winners = [];
    }

    async init() {
        await this.pairGuilds()
    }

    /**
     * Pair guilds
     */
    async pairGuilds() {
        //console.log(this.initialGuilds);
        this.shuffle(this.initialGuilds);
        //console.log(this.initialGuilds);        
        for (let i = 0; i < this.initialGuilds.length; i = i + 2) {
            let pair = [this.initialGuilds[i]];
            if (this.initialGuilds[i + 1]) {
                pair.push(this.initialGuilds[i + 1]);
            } else {
                pair.push(0);
            }
            this.guildsPlacements.push(pair);
            await conn.query("INSERT INTO conquesttournamentrounds VALUES (?, ?, ?, ?, 0)", [this.idArea, this.round, pair[0], pair[1] == 0 ? null : pair[1]]);
        }
    }

    /**
     * Do the fight for each guilds if a guild have no opponent the guild is automaticaly qualified
     */
    async doFights() {
        //console.log("Round : " + this.round)
        for (let guilds of this.guildsPlacements) {
            if (guilds[1] != 0) {
                let g1 = new GuildEntity(guilds[0]);
                let g2 = new GuildEntity(guilds[1]);

                await Promise.all([g1.loadGuild(), g2.loadGuild()]);

                let fight = new Fight([g1], [g2]);
                await fight.init();
                if (fight.summary.winner == 0) {
                    this.winners.push(guilds[0]);
                    await conn.query("UPDATE conquesttournamentrounds SET winner = 1 WHERE idRound = ? AND idGuild_1 = ?", [this.round, guilds[0]]);
                    //console.log(g1.name);
                } else {
                    this.winners.push(guilds[1]);
                    await conn.query("UPDATE conquesttournamentrounds SET winner = 2 WHERE idRound = ? AND idGuild_2 = ?", [this.round, guilds[1]]);
                    //console.log(g2.name);
                }

            } else {
                //let g0 = new GuildEntity(guilds[0]);
                //console.log(g0.name);
                this.winners.push(guilds[0]);
                await conn.query("UPDATE conquesttournamentrounds SET winner = 1 WHERE idRound = ? AND idGuild_1 = ?", [this.round, guilds[0]]);
            }
        }
        //console.log(this.round + " : ");
        //console.log(this.winners);
    }

    /**
     * 
     * @param {Array} arr 
     * Shuffle an array passed by ref
     */
    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }


}



module.exports = AreaTournamentRound;