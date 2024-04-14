export class TroikaCombatTracker extends CombatTracker {
  constructor(options) {
    super(options);
  }

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "combat",
      template: "systems/troika/templates/combat/combat-tracker.hbs",
      title: "Combat Tracker",
    });
  }

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    if (context.combat?.started)
      context.turns = context.turns.slice(0, context.turn + 1);
    else if (await context.combat?.getFlag("troika", "preparing"))
      context.turns = [];
    console.log(context);
    return context;
  }
}