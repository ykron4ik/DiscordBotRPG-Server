﻿'use strict';
const conn = require("../../conf/mysql.js");
const StatsItems = require("../Stats/StatsItems.js");
const Globals = require("../Globals.js");
const Translator = require("../Translator/Translator.js");


class Item {

    constructor(id) {
        this.id = id;
        this.idBaseItem = 0;
        this.image = "";
        this.rarity = "";
        this.rarityColor = "";
        this.idRarity = 0;
        this.level = 0;
        this.type = 0;
        this.typeName = "";
        this.sousType = 0;
        this.sousTypeName = "";
        this.equipable = true;
        this.stats = new StatsItems(id);
        this.number = 1;
        this.isFavorite = false;

        // Functions0
        this.loadItem();

    }


    loadItem() {
        /*SELECT DISTINCT nomItem, descItem, itemsbase.idType, nomType, nomRarity, couleurRarity, level FROM items INNER JOIN itemsbase ON itemsbase.idBaseItem = items.idBaseItem INNER JOIN itemstypes ON itemsbase.idType = itemstypes.idType INNER JOIN itemsrarities ON itemsbase.idRarity = itemsrarities.idRarity WHERE items.idItem = 1;*/
        let res = conn.query("SELECT DISTINCT itemsbase.idBaseItem, imageItem, itemsbase.idType, nomType, nomRarity, itemsbase.idRarity, couleurRarity, level, equipable, favorite, itemsbase.idSousType, nomSousType FROM items INNER JOIN itemsbase ON itemsbase.idBaseItem = items.idBaseItem INNER JOIN itemstypes ON itemsbase.idType = itemstypes.idType INNER JOIN itemsrarities ON itemsbase.idRarity = itemsrarities.idRarity INNER JOIN itemssoustypes ON itemssoustypes.idSousType = itemsbase.idSousType WHERE items.idItem = "+this.id+";")[0];
        this.idBaseItem = res["idBaseItem"];
        this.level = res["level"];
        this.image = res["imageItem"];

        this.rarity = res["nomRarity"];
        this.rarityColor = res["couleurRarity"];
        this.idRarity = res["idRarity"];

        this.type = res["idType"];
        this.typeName = res["nomType"];

        this.sousType = res["idSousType"];
        this.sousTypeName = res["nomSousType"];

        this.equipable = res["equipable"];
        this.isFavorite = res["favorite"];
    }

    deleteItem() {
        this.stats.deleteStats();
        conn.query("DELETE FROM items WHERE idItem = " + this.id + ";");
    }

    getPower() {
        let statsPossible = Object.keys(Globals.statsIds);
        let power = 0;
        for (let i of statsPossible) {
            let statPower = 0;
            if (i != "armor") {
                statPower = this.stats[i] / (Globals.maxLevel * 2);
            } else {
                statPower = this.stats[i] / Math.ceil((8 * (Math.pow(Globals.maxLevel, 2)) / 7) / 4.5);
            }
            power += statPower;
        }
        return Math.round(power / 5 * 100);
    }

    setFavorite(value) {
        value = value != false && value != true ? false : value;
        this.isFavorite = value;
        conn.query("UPDATE items SET favorite = ? WHERE idItem = ?", [this.isFavorite, this.id]);
    }

    getEquipTypeID() {
        return this.type;
    }

    isEquipable() {
        return this.equipable;
    }

    toStr(lang) {
        let numberStr = this.number > 1 ? " [x" + this.number + "]" : "";
        return this.getName(lang) + (this.isFavorite == true ? " ★" : "") + numberStr + " - " + Translator.getString(lang, "item_types", this.typeName) + " (" + Translator.getString(lang, "item_sous_types", this.sousTypeName) + ")" + " - " + this.level + " - " + Translator.getString(lang, "rarities", this.rarity) + " - " + this.getPower() + "%";
    }

    getCost(number) {
        return Math.round((this.level * (1 + this.idRarity * 2)) * (number <= this.number ? number : this.number));
    }

    getName(lang="en") {
        return Translator.getString(lang, "itemsNames", this.idBaseItem);
    }

    getDesc(lang="en") {
        let desc = Translator.getString(lang, "itemsDesc", this.idBaseItem, [], true);
        return desc != null ? desc : Translator.getString(lang, "inventory_equipment", "no_desc");
    }
    
    static getName(lang="en", idBase) {
        return Translator.getString(lang, "itemsNames", idBase);
    }

    static getDesc(lang="en", idBase) {
        let desc = Translator.getString(lang, "itemsDesc", idBase, [], true);
        return desc != null ? desc : Translator.getString(lang, "inventory_equipment", "no_desc");
    }


    /* 
     * API CALLS HERE
     */

    toApi() {
        let toApiObject = {
            name: this.name,
            desc: this.desc,
            rarity: this.rarity,
            rarityColor: this.rarityColor,
            level: this.level,        
            typeName: this.typeName,
            equipable: this.equipable === 1 ? true : false,
            number: this.number,
            price: this.getCost(),
            image: Globals.addr + "images/items/" + this.image + ".png",
        };
        if (this.equipable == true)
            toApiObject.stats = this.stats.toApi();

        return toApiObject;
    }

    toApiLight() {
        let toApiObject = {
            name: this.name,
            desc: this.desc,
            rarity: this.rarity,
            rarityColor: this.rarityColor,
            level: this.level,
            typeName: this.typeName,
            equipable: this.equipable === 1 ? true : false,
            number: this.number,
            image: Globals.addr + "images/items/" + this.image + ".png",
        };
        return toApiObject;
    }

    static getType(idItem) {
        let res = conn.query("SELECT itemstypes.nomType FROM items INNER JOIN itemsbase ON itemsbase.idBaseItem = items.idBaseItem INNER JOIN itemstypes ON itemstypes.idType = itemsbase.idType WHERE items.idItem = ?", [idItem]);
        if(res[0]) {
            return res[0].nomType;
        }
        return "unknown";
    }

}

Item.newItem = (idBase, type) => {
    switch(type) {
        case "consumable":
            return new Consumable(idBase);
        default:
            return new Item(idBase);
    }
};

module.exports = Item;

const Consumable = require("./Consumable");