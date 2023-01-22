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
    data.enrichedDescription = await TextEditor.enrichHTML(this.object.system.description, {async: true});

    this._prepareItemData(data);

    return data;
  }

  _prepareItemData(data){
    
    const item = data.item;

    item.system.displayName = item.name;
    item.system.tooltip = "";

    if(item.type === 'gear'){
      
      if(item.system.canAttack === true){
        if(item.system.requiresTwoHands === true){
          item.system.displayName += "*";
          item.system.tooltip += "Requires two hands to use";
        }
        if(item.system.armourIgnored > 0){
          item.system.displayName += "#";
          if(item.tooltip !== ""){
            item.system.tooltip += ", ";
          }
          item.system.tooltip += 'Item ignores ${item.system.armourIgnored} points of armour';
        }
      }
    }
    console.log(data);
  }

  /** @override */
  get template() {
    const path = "systems/troika/templates/item";
    
    // unique item sheet by type, like `item-type-sheet.html`.
    if(this.item.type === 'spell' || this.item.type === 'skill'){
        return `${path}/item-skill-or-spell-sheet.html`;
    }
    else{
        return `${path}/item-${this.item.type}-sheet.html`;
    }
  }

}