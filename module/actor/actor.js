/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class TroikaActor extends Actor {
    prepareData() {
        super.prepareData();
    }

    /** @override */
    get template() {
        return "systems/troika/templates/actor/pc-sheet.html";
    }

    /** @override */
    static async create(data, options={}) {

        data.prototypeToken = data.prototypeToken || {};
        
        if ( data.type === "pc" ) {
            mergeObject(data.prototypeToken, {
                actorLink: true  // this will make the 'Link Actor Data' option for a token is checked by default. So changes to the token sheet will reflect to the actor sheet.
            }, {overwrite: false});            
        }

        return super.create(data, options);
    }

}