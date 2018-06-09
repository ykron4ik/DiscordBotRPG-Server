const fs = require("fs");
const util = require("util");

class Translator {
    
    static getString(lang, type, name,  args) {
        if (!this.translations[lang]) {
            lang = "en";
        }


        if (this.translations[lang][type] && this.translations[lang][type][name]) {
           
            args = Array.isArray(args) ? args : [];
            args.unshift(this.translations[lang][type][name]);
            return util.format.apply(util, args);
        }

        return lang + " | " + type + " | " + name;

    }

    static isLangExist(lang) {
        return this.translations[lang] ? true : false
    }

    static getAvailableLanguages(lang) {
        let tr = "";
        let count = 0;
        for (let i in this.translations) {
            count++;
            tr += this.getString(lang, "languages", i) + " (" + i + ")" + (count == this.nbOfTranslations ? "" : ", ");
        }
        return tr;
    }

    static load(callback) {
        var self = this;
        fs.readdir(__dirname + "/locale", (err, filenames) => {
            if (!err) {
                for (let i of filenames) {
                    self.translations[i.split(".")[0]] = JSON.parse(fs.readFileSync(__dirname + "/locale/" + i));
                    self.nbOfTranslations++;
                }
                callback ? callback() : null;
            }
        })  
    }

    static loadSync() {
        var filenames = fs.readdirSync(__dirname + "/locale");
        for (let i of filenames) {
            this.translations[i.split(".")[0]] = JSON.parse(fs.readFileSync(__dirname + "/locale/" + i));
            this.nbOfTranslations++;
        }
    }
}

Translator.translations = {};
Translator.nbOfTranslations = 0;
Translator.loadSync();


module.exports = Translator;