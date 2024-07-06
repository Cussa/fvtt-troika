import { TroikaActorBase } from "./base.mjs";

export class TroikaPc extends TroikaActorBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.background = new fields.StringField({ required: false, blank: true });

    schema.luck = new fields.SchemaField({
      value: this.numberField(fields, 7, 0, 12),
      max: this.numberField(fields, 7, 0, 12)
    });

    delete schema.attribution;

    return schema;
  }
}