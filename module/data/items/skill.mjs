import { requiredInteger } from "../common.mjs";
import { TroikaItemBase } from "./base.mjs";

export class TroikaSkill extends TroikaItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.rank = new fields.NumberField({ ...requiredInteger, initial: 1, min: 0, max: 50 });
    schema.modifier = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 50 });
    schema.improvement = new fields.BooleanField({ initial: false });

    return schema;
  }
}