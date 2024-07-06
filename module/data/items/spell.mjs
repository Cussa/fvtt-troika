import { TroikaSkill } from "./skill.mjs";

export class TroikaSpell extends TroikaSkill {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.castingCost = new fields.StringField({ required: true, blank: false, initial: "0" });

    return schema;
  }
}