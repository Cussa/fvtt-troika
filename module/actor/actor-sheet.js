import { simpleDiceRoll, dx6Roll, d36Roll, showSkillTestDialog, rollSkillTestUnder, rollSkillTestOver, showDamageRollDialog, rollDamageForItem} from "../other/roll.js"

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class TroikaActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
        classes: ["troika", "sheet", "actor"],
        template: "systems/troika/templates/actor/pc-sheet.html",
        width: 700,
        height: 800,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
        });
    }

    /** @override */
    get template() {
        return "systems/troika/templates/actor/pc-sheet.html";
    }


    /** @override */
    async getData() {
        const data = super.getData();

        data.enrichedSpecial = await TextEditor.enrichHTML(this.object.system.special, {async: true});
        data.enrichedNotes = await TextEditor.enrichHTML(this.object.system.notes, {async: true});

        this._prepareCharacterItems(data);
        
        return data;
    }

    async _prepareCharacterItems(sheetData){

        const actorData = sheetData.actor;
        const skills = [];
        const spells = [];
        const inventory = [];
        const attacks = [];        

        for (let i of sheetData.items) {            
            
            if (i.type === 'skill') {                
                skills.push(i);

                if(i.system.canAttack === true){
                    attacks.push(i);
                }

                i.system.total = parseInt(actorData.system.skill.value) + parseInt(i.system.rank) + parseInt(i.system.modifier);
            }
            else if(i.type === 'spell'){
                spells.push(i);

                if(i.system.canAttack === true){
                    attacks.push(i);
                }

                i.system.total = parseInt(actorData.system.skill.value) + parseInt(i.system.rank) + parseInt(i.system.modifier);
            }
            else if(i.type === 'gear'){
                inventory.push(i);
                
                if(i.system.canAttack === true && i.system.equipped == true){
                    attacks.push(i);
                }
            }
        }

        skills.sort(function(a, b){
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if( x < y ) { return -1; }
            if( x > y ) { return 1; }
            return 0;
        });

        spells.sort(function(a, b){
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if( x < y ) { return -1; }
            if( x > y ) { return 1; }
            return 0;
        });

        if(inventory.length > 0){

            inventory.sort(function(a, b){ return a.sort - b.sort;});

            let actualPos = 1;
            for(var i = 0; i < inventory.length; i++){
                inventory[i].system.inventoryPosition = actualPos;

                inventory[i].system.inventoryPositionDisplay = actualPos.toString();

                let endingVal = actualPos + parseInt(inventory[i].system.inventorySlots) - 1;

                if(parseInt(inventory[i].system.inventorySlots) > 1){
                    inventory[i].system.inventoryPositionDisplay += "-" + endingVal.toString();
                }

                actualPos = actualPos + parseInt(inventory[i].system.inventorySlots);                
                
            }

            console.log(inventory);  
        }

        const skillsAndSpells = skills.concat(spells);

        // I think that everyone should have an unarmed attack, right?
        // Add sort of a transitory unarmed strike here, maybe come up with a better way to handle it later.
        //attacks.push({name: "Unarmed", system:{type:"attack", displayName:"Unarmed", attack:{dr1: 1, dr2: 1, dr3: 1, dr4: 2, dr5: 2, dr6: 3, dr7: 4}}});

        attacks.sort(function(a, b){
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if( x < y ) { return -1; }
            if( x > y ) { return 1; }
            return 0;
        });

        actorData.attacks = attacks;
        actorData.inventory = inventory;
        actorData.advancedSkills = skills;
        actorData.spells = spells;
        actorData.advancedSkillsAndSpells = skillsAndSpells;

        let maxInventory = 0;

        if(inventory.length > 0){
            maxInventory = inventory[inventory.length - 1].system.inventoryPosition + (parseInt(inventory[inventory.length - 1].system.inventorySlots) - 1);
        }        

        actorData.maxInventory = maxInventory;

        actorData.inconvenientWeight = false;
        actorData.overburdened = false;

        if(maxInventory >= 18){
            actorData.inconvenientWeight = true;
            actorData.overburdened = true;
        }
        else if(maxInventory > 12){
            actorData.inconvenientWeight = true;
            actorData.overburdened = false;
        }
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        html.find('.item-create').click(this._onItemCreate.bind(this));

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            //const el = ev.currentTarget;
            const el = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(el.data('item-id'));
            item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
        //const el = ev.currentTarget;
        const el = $(ev.currentTarget).parents(".item");
        let options = {};
        this.actor.deleteEmbeddedDocuments("Item", [el.data('item-id')], options);
    });

    html.find('.item-improve-checkbox').click(ev => {
        
        const el = $(ev.currentTarget).parents(".item");
        const item = this.actor.items.get(el.data('item-id'));
        let value = ev.target.checked;

        item.system.improvement = value;

        this.actor.updateEmbeddedDocuments("Item", [item]);
    });

    html.find('.rollable-skill-test').click(ev => {
        
        const el = $(ev.currentTarget);
        
        let rankTotal = el.data('roll-total');
        
        let rollLabel = el.data('roll-label');

        if(ev && ev.shiftKey){
            rollSkillTestUnder(this.actor, rankTotal, rollLabel);
        }
        else if(ev && ev.ctrlKey){
            rollSkillTestOver(this.actor, rankTotal, rollLabel);
        }
        else{
            showSkillTestDialog(this.actor, rankTotal, rollLabel);
        }        

    });

    html.find('.rollable-attack-damage').click(ev => {

        const el = $(ev.currentTarget).parents(".item");
        const item = this.actor.items.get(el.data('item-id'));
        
        if(ev && (ev.shiftKey || ev.ctrlKey)){
            // just go right to damage roll without dialog
            rollDamageForItem(this.actor, item, 0, false);
        }
        else{                     
            showDamageRollDialog(this.actor, item);
        }                
        
    });
  }

  _onItemCreate(event) {

    event.preventDefault();

    const header = event.currentTarget;

    // Get the type of item to create.
    const type = header.dataset.type;

    // Initialize a default name.
    const name = `New ${type.capitalize()}`;

    // Prepare the item object.
    const itemData = {
        name: name,
        type: type,
        system: {}
    };

    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  _getHeaderButtons(){
    let buttons = super._getHeaderButtons();

    buttons = [{
        label: 'd3',
        class: "d3-roll",
        icon: "fas fa-dice",
        onclick: (ev) => simpleDiceRoll(this.actor, 'd3', 'd3')
      }].concat(buttons);
    
      buttons = [{
        label: 'd6',
        class: "d6-roll",
        icon: "fas fa-dice",
        onclick: (ev) => simpleDiceRoll(this.actor, 'd6', 'd6')
      }].concat(buttons);

      buttons = [{
        label: '2d6',
        class: "2d6-roll",
        icon: "fas fa-dice",
        onclick: (ev) => simpleDiceRoll(this.actor, '2d6', '2d6')
      }].concat(buttons);

      buttons = [{
        label: 'd36',
        class: "d36-roll",
        icon: "fas fa-dice",
        onclick: (ev) => d36Roll(this.actor)
      }].concat(buttons);

      buttons = [{
        label: 'd66',
        class: "d66-roll",
        icon: "fas fa-dice",
        onclick: (ev) => dx6Roll(this.actor, 2)
      }].concat(buttons);

    return buttons;
  }

}