/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class TroikaItem extends Item {
    prepareData() {
        super.prepareData();
    }

    prepareDerivedData(){
        
        const item = this;
        
        item.system.displayName = item.name;
        item.system.attackTooltip = "";

        if(item.type === 'gear'){

            if(item.system.requiresTwoHands === true){
                item.system.displayName += "*";
                item.system.attackTooltip += "This item requires two hands to wield.\n"
            }

            if(item.system.armourIgnored > 0){
                item.system.displayName += "#";
                item.system.attackTooltip += `This item bypasses ${item.system.armourIgnored} point(s) of armour.`
            }

            //console.log(item);
        }
    }
}