import { addAttribution, requiredInteger } from "../common.mjs";

export class TroikaItemBase extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    addAttribution(schema, fields);

    schema.description = new fields.StringField({ required: false, blank: true });

    schema.canAttack = new fields.BooleanField({ initial: false });
    schema.attack = new fields.SchemaField({
      dr1: new fields.StringField({ required: true, blank: false, initial: "2" }),
      dr2: new fields.StringField({ required: true, blank: false, initial: "2" }),
      dr3: new fields.StringField({ required: true, blank: false, initial: "2" }),
      dr4: new fields.StringField({ required: true, blank: false, initial: "2" }),
      dr5: new fields.StringField({ required: true, blank: false, initial: "4" }),
      dr6: new fields.StringField({ required: true, blank: false, initial: "8" }),
      dr7: new fields.StringField({ required: true, blank: false, initial: "10" }),
    });
 
    return schema;
  }
}