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
    if (await context.combat?.getFlag("troika", "preparing"))
      context.turns = [];
    else if (context.combat?.started)
      context.turns = context.turns.slice(0, context.turn + 1);
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".combat-show-all").click(ev => this._showAllCombatants(ev));
  }

  async _showAllCombatants(event) {
    event.preventDefault();
    const tokenIds = game.combat.getFlag("troika", "tokenIds");
    let tokenInfo = [];

    for (const tokenId of tokenIds) {
      const token = game.scenes.current.tokens.get(tokenId);
      if (!token)
        continue;

      tokenInfo.push(token);
      console.log(token);
    }
    const content = await renderTemplate("systems/troika/templates/combat/show-all-combatants.hbs", { tokens: tokenInfo });

    Dialog.prompt({
      title: "Combatants",
      content
    })
  }
}