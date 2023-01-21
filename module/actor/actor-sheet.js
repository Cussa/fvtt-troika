
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

        this._prepareCharacterItems(data);

        //console.log(data);

        return data;
    }

    _prepareCharacterItems(sheetData){

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
            }
            else if(i.type === 'spell'){
                spells.push(i);

                if(i.system.canAttack === true){
                    attacks.push(i);
                }
            }
            else if(i.type === 'gear'){
                inventory.push(i);

                if(i.system.type === 'attack' && i.system.equipped == true){
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

            for(var i = 0; i < inventory.length; i++){
                if(inventory[i].system.sortOrder === -1){
                    let maxSort = Math.max.apply(Math, inventory.map(function(o){ return o.system.sortOrder; }))
                    
                    if(maxSort < 1){
                        maxSort = 0;
                    }

                    inventory[i].system.sortOrder = maxSort + 1;

                    this.actor.updateEmbeddedDocuments("Item", [inventory[i]]);
                }
            }
        
            inventory.sort(function(a, b){ return a.system.sortOrder - b.system.sortOrder;});

            let actualPos = 1;
            for(var i = 0; i < inventory.length; i++){
                inventory[i].system.inventoryPosition = actualPos;
                actualPos = actualPos + parseInt(inventory[i].system.inventorySlots);
            }

            console.log(inventory);  
        }

        const skillsAndSpells = skills.concat(spells);

        // I think that everyone should have an unarmed attack, right?
        // Add sort of a transitory unarmed strike here, maybe come up with a better way to handle it later.
        attacks.push({name: "Unarmed", system:{type:"attack", attack:{dr1: 1, dr2: 1, dr3: 1, dr4: 2, dr5: 2, dr6: 3, dr7: 4}}});

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

    html.find('.item-inventory-up').click(ev => {
        const el = $(ev.currentTarget).parents(".item");
        const item = this.actor.items.get(el.data('item-id'));
        const actorData = this.actor;
        this._shiftItemSortUp(actorData, item);
    });

    html.find('.item-inventory-down').click(ev => {
        const el = $(ev.currentTarget).parents(".item");
        const item = this.actor.items.get(el.data('item-id'));
        const actorData = this.actor;
        this._shiftItemSortDown(actorData, item);
    });
  }

  async _shiftItemSortUp(actorData, item){
    
        let currentPosition = item.system.sortOrder;

        // if already at top, don't want to move it
        if(currentPosition == 1){return;}

        for(var i = 0; i < actorData.inventory.length; i++){
            if(actorData.inventory[i].system.sortOrder === currentPosition - 1 && actorData.inventory[i]._id != item._id){
                
                let prevItem = this.actor.items.get(actorData.inventory[i]._id);

                prevItem.system.sortOrder = currentPosition;

                await this.actor.updateEmbeddedDocuments("Item", [prevItem]);
            }
        }

        item.system.sortOrder = currentPosition - 1;

        await this.actor.updateEmbeddedDocuments("Item", [item]);

        this.actor.sheet.render();
  }

  async _shiftItemSortDown(actorData, item){
    let maxSort = Math.max.apply(Math, actorData.inventory.map(function(o){ return o.system.sortOrder; }))
    let currentPosition = item.system.sortOrder;

    // if already at bottom, don't want to move it
    if(currentPosition == maxSort){return;}

    for(var i = 0; i < actorData.inventory.length; i++){
        if(actorData.inventory[i].system.sortOrder === currentPosition + 1 && actorData.inventory[i]._id != item._id){
            
            let prevItem = this.actor.items.get(actorData.inventory[i]._id);

            prevItem.system.sortOrder = currentPosition;

            await this.actor.updateEmbeddedDocuments("Item", [prevItem]);
        }
    }

    item.system.sortOrder = currentPosition + 1;

    await this.actor.updateEmbeddedDocuments("Item", [item]);

    this.actor.sheet.render();
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
}