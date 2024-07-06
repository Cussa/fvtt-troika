import { requiredInteger } from "../common.mjs";
import { TroikaActorBase } from "./base.mjs";

export class TroikaNpc extends TroikaActorBase {
  static mienOptionField(fields, index) {
    return new fields.SchemaField({
      number: new fields.NumberField({ ...requiredInteger, initial: index }),
      description: new fields.StringField({ required: false, blank: true })
    });
  }

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.mien = new fields.StringField({ required: false, blank: true });
    schema.mienOptions = new fields.SchemaField({
      0: this.mienOptionField(fields, 1),
      1: this.mienOptionField(fields, 2),
      2: this.mienOptionField(fields, 3),
      3: this.mienOptionField(fields, 4),
      4: this.mienOptionField(fields, 5),
      5: this.mienOptionField(fields, 6),
    });

    return schema;
  }
}