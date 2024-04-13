import { rollDamageForItem } from "../other/roll.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class TroikaItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["troika", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }]
    });
  }

  /** @override */
  async getData() {
    const data = super.getData();
    data.enrichedDescription = await TextEditor.enrichHTML(this.object.system.description, { async: true });

    this._prepareItemData(data);

    return data;
  }

  _prepareItemData(data) {


  }

  /** @override */
  get template() {
    const path = "systems/troika/templates/item";

    // unique item sheet by type, like `item-type-sheet.html`.
    if (this.item.type === 'spell' || this.item.type === 'skill') {
      return `${path}/item-skill-or-spell-sheet.html`;
    }
    else {
      return `${path}/item-${this.item.type}-sheet.html`;
    }
  }


  activateListeners(html) {
    super.activateListeners(html);

    html.find('.rollable').click(ev => {
      rollDamageForItem(null, this.object, 0, false);
    });
  }
}