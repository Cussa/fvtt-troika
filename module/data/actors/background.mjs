import { addAttribution, requiredInteger } from "../common.mjs";

export class TroikaBackground extends foundry.abstract.TypeDataModel {
  static rollField(fields, formula) {
    return new fields.StringField({ required: true, blank: true, initial: formula });
  }
  static numberField(fields, initial, min, max) {
    return new fields.NumberField({ ...requiredInteger, initial, min, max });
  }

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.skill = this.rollField(fields, "1d3+3");
    schema.stamina = this.rollField(fields, "2d6+12");
    schema.luck = this.rollField(fields, "1d6+6");
    schema.armour = this.numberField(fields, 0, 0, 20);
    schema.initiativeTokens = this.numberField(fields, 2, 0, 20);

    schema.monies = this.rollField(fields, "2d6");
    schema.provisions = new fields.SchemaField({
      p1: new fields.BooleanField({ initial: true }),
      p2: new fields.BooleanField({ initial: true }),
      p3: new fields.BooleanField({ initial: true }),
      p4: new fields.BooleanField({ initial: true }),
      p5: new fields.BooleanField({ initial: true }),
      p6: new fields.BooleanField({ initial: true }),
      p7: new fields.BooleanField({ initial: false }),
      p8: new fields.BooleanField({ initial: false }),
      p9: new fields.BooleanField({ initial: false }),
      p10: new fields.BooleanField({ initial: false }),
      p11: new fields.BooleanField({ initial: false }),
      p12: new fields.BooleanField({ initial: false }),
    });

    schema.notes = new fields.StringField({ required: false, blank: true });
    schema.special = new fields.StringField({ required: false, blank: true });

    addAttribution(schema, fields);

    return schema;
  }
}