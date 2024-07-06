import { requiredInteger } from "../common.mjs";
import { TroikaItemBase } from "./base.mjs";

export class TroikaGear extends TroikaItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.inventorySlots = new fields.NumberField({ ...requiredInteger, initial: 1, min: 0, max: 50 });
    schema.sortOrder = new fields.NumberField({ ...requiredInteger, initial: -1 });
    schema.equipped = new fields.BooleanField({ initial: false });
    schema.armourProvided = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 50 });
    schema.requiresTwoHands = new fields.BooleanField({ initial: false });
    schema.armourIgnored = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 50 });
    schema.quantity = new fields.NumberField({ ...requiredInteger, initial: 1 });

    return schema;
  }
}