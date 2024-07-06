export function addAttribution(schema, fields){
  schema.attribution = new fields.SchemaField({
    source: new fields.StringField({ required: false, blank: true }),
    link: new fields.StringField({ required: false, blank: true })
  });
}

export const requiredInteger = { required: true, nullable: false, integer: true };