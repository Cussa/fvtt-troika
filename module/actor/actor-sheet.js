import { itemEnricher } from "../enricher/item.mjs";
import { simpleDiceRoll, dx6Roll, d36Roll, showSkillTestDialog, rollSkillTestUnder, rollSkillTestOver, showDamageRollDialog, rollDamageForItem, create_roll } from "../other/roll.js"

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
      height: 750,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
    });
  }

  /** @override */
  get template() {
    if (this.actor.type === 'npc')
      return "systems/troika/templates/actor/npc-sheet.html";

    if (this.actor.type == "background")
      return "systems/troika/templates/actor/background-sheet.hbs";

    // note the 'npc-complex' type uses regular PC sheet
    return "systems/troika/templates/actor/pc-sheet.html";
  }


  /** @override */
  async getData() {
    const data = super.getData();

    data.enrichedSpecial = await TextEditor.enrichHTML(this.object.system.special, { async: true });
    data.enrichedNotes = await TextEditor.enrichHTML(this.object.system.notes, { async: true });

    this._prepareCharacterItems(data);

    return data;
  }

  async _prepareCharacterItems(sheetData) {

    const actorData = sheetData.actor;
    const skills = [];
    const spells = [];
    const inventory = [];
    const weightlessInventory = [];
    const nonweightlessInventory = [];
    const attacks = [];

    for (let i of sheetData.items) {
      itemEnricher(i);
      if (i.type === 'skill') {
        skills.push(i);

        if (i.system.canAttack === true) {
          attacks.push(i);
        }

        i.system.total = parseInt(actorData.system.skill.value) + parseInt(i.system.rank) + parseInt(i.system.modifier);
      }
      else if (i.type === 'spell') {
        spells.push(i);

        if (i.system.canAttack === true) {
          attacks.push(i);
        }

        i.system.total = parseInt(actorData.system.skill.value) + parseInt(i.system.rank) + parseInt(i.system.modifier);
      }
      else if (i.type === 'gear') {

        // all inventory
        inventory.push(i);

        // try to divide up things that have weight and matter, and those that don't
        if (i.system.inventorySlots < 1) {
          weightlessInventory.push(i);
        }
        else {
          nonweightlessInventory.push(i);
        }

        if (i.system.canAttack === true && i.system.equipped == true) {
          attacks.push(i);
        }
      }
    }

    skills.sort(function (a, b) {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });

    spells.sort(function (a, b) {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });

    if (inventory.length > 0) {

      inventory.sort(function (a, b) { return a.sort - b.sort; });

      let actualPos = 1;
      for (var i = 0; i < inventory.length; i++) {
        inventory[i].system.inventoryPosition = actualPos;

        inventory[i].system.inventoryPositionDisplay = actualPos.toString();

        let endingVal = actualPos + parseInt(inventory[i].system.inventorySlots) - 1;

        if (parseInt(inventory[i].system.inventorySlots) > 1) {
          inventory[i].system.inventoryPositionDisplay += "-" + endingVal.toString();
        }

        actualPos = actualPos + parseInt(inventory[i].system.inventorySlots);

      }

    }

    const skillsAndSpells = skills.concat(spells);

    // I think that everyone should have an unarmed attack, right?
    // Add sort of a transitory unarmed strike here, maybe come up with a better way to handle it later.
    //attacks.push({name: "Unarmed", system:{type:"attack", displayName:"Unarmed", attack:{dr1: 1, dr2: 1, dr3: 1, dr4: 2, dr5: 2, dr6: 3, dr7: 4}}});

    attacks.sort(function (a, b) {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });

    actorData.attacks = attacks;
    actorData.inventory = inventory;
    actorData.weightlessInventory = weightlessInventory;
    actorData.nonweightlessInventory = nonweightlessInventory;
    actorData.advancedSkills = skills;
    actorData.spells = spells;
    actorData.advancedSkillsAndSpells = skillsAndSpells;

    let maxInventory = 0;

    if (inventory.length > 0) {
      maxInventory = inventory[inventory.length - 1].system.inventoryPosition + (parseInt(inventory[inventory.length - 1].system.inventorySlots) - 1);
    }

    actorData.maxInventory = maxInventory;

    actorData.inconvenientWeight = false;
    actorData.overburdened = false;

    if (maxInventory >= 18) {
      actorData.inconvenientWeight = true;
      actorData.overburdened = true;
    }
    else if (maxInventory > 12) {
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
    html.find('.source-edit').click(this._updateSource.bind(this));

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

    // let user check off an 'improve' checkbox right from the sheet
    html.find('.item-improve-checkbox').click(ev => {

      const el = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(el.data('item-id'));
      let value = ev.target.checked;

      item.update({ ["system.improvement"]: value });

    });

    html.find('.rollable-skill-test').click(ev => {

      const el = $(ev.currentTarget);

      let rankTotal = el.data('roll-total');

      let rollLabel = el.data('roll-label');

      if (ev && ev.shiftKey) {
        rollSkillTestUnder(this.actor, rankTotal, rollLabel);
      }
      else if (ev && ev.ctrlKey) {
        rollSkillTestOver(this.actor, rankTotal, rollLabel);
      }
      else {
        showSkillTestDialog(this.actor, rankTotal, rollLabel);
      }

    });

    html.find('.rollable-attack-damage').click(ev => {

      const el = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(el.data('item-id'));

      if (ev && (ev.shiftKey || ev.ctrlKey)) {
        // just go right to damage roll without dialog
        rollDamageForItem(this.actor, item, 0, false);
      }
      else {
        showDamageRollDialog(this.actor, item);
      }

    });

    html.find('.item-quantity-up').click(ev => {

      const el = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(el.data('item-id'));
      let change = parseInt(item.system.quantity) + 1;
      this._editItemQuantity(item, change);
    });

    html.find('.item-quantity-down').click(ev => {
      const el = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(el.data('item-id'));
      let change = parseInt(item.system.quantity) - 1;
      this._editItemQuantity(item, change);
    });

    html.find('.rollable-mien').click(ev => {
      this._randomlyDetermineMien();
    });
  }

  async _randomlyDetermineMien() {

    let size = Object.keys(this.actor.system.mienOptions).length;

    let mienOptions = [];

    if (size > 0) {

      for (let i = 0; i < size; i++) {

        let mien = this.actor.system.mienOptions[i];

        if (mien.description !== null && mien.description.trim() !== '') {
          mienOptions.push(mien.description);
        }
      }

      let formula = '1d' + size.toString();
      const roll = await new Roll(formula, {}).roll({ async: true });
      let dieResult = roll.terms[0].results[0].result;
      let newMien = mienOptions[dieResult];

      let updatedData = duplicate(this.actor.system);
      updatedData.mien = newMien;
      this.actor.update({ 'data': updatedData });
    }

  }

  async _editItemQuantity(item, newQuantity) {
    await item.update({ ["system.quantity"]: newQuantity });
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

  _getHeaderButtons() {
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

  _updateSource(event) {
    event.preventDefault();

    let source = this.actor.system.attribution?.source || "";
    let link = this.actor.system.attribution?.link || "";
    let content = `
    <div>
      <span class="bolded-label right-margin-5pct grid-item-stretch-height-to-fit no-underline">Source:</span>
      <input name="source" type="text" value="${source}" />
      <span class="bolded-label right-margin-5pct grid-item-stretch-height-to-fit no-underline">Link:</span>
      <input name="link" type="text" value="${link}" />
    </div>`;

    Dialog.prompt({
      title: "Update Source",
      content,
      label: "Save",
      callback: async (html) => {
        let newSource = html.find(`[name="source"]`).val();
        let newLink = html.find(`[name="link"]`).val();
        await this.actor.update({
          "system.attribution.source": newSource,
          "system.attribution.link": newLink,
        });
      },
      rejectClose: false
    });
  }

  async _onDropActor(event, data) {
    if (!this.actor.isOwner) return false;

    if (this.actor.type != "pc")
      return false;

    const background = await fromUuid(data.uuid);
    if (background.type != "background")
      return false;

    if (this.actor.system.background) {
      const confirmation = await Dialog.confirm({
        content: "This PC already have a background. Do you want to continue? If yes, it will clear all the information from the PC. This is a destructive operation and there is no return."
      });
      if (!confirmation)
        return;

      let deleteItems = this.actor.items.map((i) => i.id);
      this.actor.deleteEmbeddedDocuments("Item", deleteItems);
    }

    let [skill_roll, skill_animation] = await create_roll(background.system.skill);
    let [stamina_roll, stamina_animation] = await create_roll(background.system.stamina);
    let [luck_roll, luck_animation] = await create_roll(background.system.luck);
    let [monies_roll, monies_animation] = await create_roll(background.system.monies);

    await Promise.all([skill_animation, stamina_animation, luck_animation, monies_animation]);

    let updates = {
      "system.background": background.name,
      "system.skill.value": skill_roll.total,
      "system.stamina.value": stamina_roll.total,
      "system.stamina.max": stamina_roll.total,
      "system.luck.value": luck_roll.total,
      "system.luck.max": luck_roll.total,
      "system.armour": background.system.armour,
      "system.initiativeTokens": background.system.initiativeTokens,
      "system.notes": background.system.notes,
      "system.special": background.system.special,
      "system.monies": `${monies_roll.total} silve pence`
    };
    for (let index = 1; index <= 12; index++) {
      updates[`system.provisions.p${index}`] = background.system.provisions[`p${index}`];
    }

    let content = ``;
    content += `<p><strong>Skill:</strong> ${skill_roll.total} (${skill_roll.terms[0].results[0].result} + 3)</p>`;
    content += `<p><strong>Stamina:</strong> ${stamina_roll.total} (${stamina_roll.terms[0].results[0].result} + ${stamina_roll.terms[0].results[1].result} + 12)</p>`;
    content += `<p><strong>Luck:</strong> ${luck_roll.total} (${luck_roll.terms[0].results[0].result} + 6)</p>`;

    ChatMessage.create({
      user: game.user._id,
      content: `<div class="incident-message"><h1>${this.actor.name}</h1><h2>Background choosen:<br>${background.name}</h2>
        ${content}</div>`,
      whisper: game.users.filter(u => u.isGM).map(u => u._id)
    });

    await this.actor.update(updates);

    let items = await Promise.all(background.items.map(async (i) => (await fromUuid(i.uuid)).toObject()));
    this.actor.createEmbeddedDocuments("Item", items);
  }
}