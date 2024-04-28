const ActorType = Object.freeze({
  END_OF_TURN: Symbol("end_of_turn"),
  ENEMY: Symbol("enemy"),
  HENCHMEN: Symbol("henchmen")
});

export default class TroikaCombat extends Combat {
  getRandomInt(max = 100) {
    return Math.floor(Math.random() * max);
  }

  async getActor(actorType) {

    let settingId = "", actorName = "", actorImg = "";
    switch (actorType) {
      case ActorType.END_OF_TURN:
        settingId = "endOfTurnActor";
        actorName = "-- End of Turn --";
        actorImg = "systems/troika/assets/icons/troika-initiative-tokens-flag-end-round.webp";
        break;

      case ActorType.ENEMY:
        settingId = "enemyActor";
        actorName = "-- Enemy --";
        actorImg = "systems/troika/assets/icons/troika-initiative-tokens-monsters2.webp";
        break;

      case ActorType.HENCHMEN:
        settingId = "henchmenActor";
        actorName = "-- Henchmen --";
        actorImg = "systems/troika/assets/icons/troika-initiative-tokens-raygun.webp";
        break;

      default:
        console.error(actorType);
        throw Error("actorType not defined", actorType);
    }

    const actorId = await game.settings.get("troika", settingId);
    let actor = await game.actors.get(actorId);
    if (actor == undefined) {
      actor = await Actor.create({ name: actorName, type: "npc", img: actorImg });
      await game.settings.set("troika", settingId, actor._id);
    }
    return actor._id;
  }

  async shuffleInitiative() {

    await this.setFlag("troika", "preparing", true);
    let enemiesTokens = 0;
    let playersTokens = 0;
    let henchmenTokens = 0;

    const enemyActorId = await this.getFlag("troika", "enemyActorId");
    const endOfTurnActorId = await this.getFlag("troika", "endOfTurnActorId");
    const henchmenActorId = await this.getFlag("troika", "henchmenActorId");
    const capEnemyTokens = await this.getFlag("troika", "capEnemyTokens");

    let originalCombatants = await this.getFlag("troika", "originalCombatants");
    for (const combatant of originalCombatants) {
      const token = await game.scenes.current.tokens.get(combatant);
      if (!token || token.actor.system.stamina.value <= 0)
        continue;

      if (token.actor.type == "pc")
        playersTokens += Number(token.actor.system.initiativeTokens);
      else if (token.actor.type == "henchmen")
        henchmenTokens += Number(token.actor.system.initiativeTokens);
      else
        enemiesTokens += Number(token.actor.system.initiativeTokens);
    }

    if (capEnemyTokens)
      enemiesTokens = Math.min(...[enemiesTokens, playersTokens * 2]);

    let updates = [];
    let currentEnemiesTokens = 0;
    let currentHenchmenTokens = 0;
    let endOfTurnCombantantId;
    let maxInitiative = -100;

    for (const combatant of this.combatants) {
      if (combatant.actorId == endOfTurnActorId) {
        endOfTurnCombantantId = combatant._id;
        continue;
      }

      let initiative = this.getRandomInt();

      if (combatant.actorId == enemyActorId) {
        currentEnemiesTokens++;
        if (currentEnemiesTokens > enemiesTokens) {
          initiative = -1;
        }
      }
      else if (combatant.actorId == henchmenActorId) {
        currentHenchmenTokens++;
        if (currentHenchmenTokens > henchmenTokens) {
          initiative = -1;
        }
      }
      else if (combatant.actor.system.stamina.value <= 0) {
        initiative = -1;
      }

      if (maxInitiative < initiative)
        maxInitiative = initiative;

      updates.push(
        {
          _id: combatant._id,
          initiative: initiative,
        },
      );
    }

    updates.push({
      _id: endOfTurnCombantantId,
      initiative: this.getRandomInt(maxInitiative)
    });

    await this.updateEmbeddedDocuments("Combatant", updates);
    await this.setFlag("troika", "preparing", false);
  }

  async startCombat() {
    await this.setFlag("troika", "preparing", true);
    let bag = [];
    let combatants = Array.from(this.combatants);
    let originalCombatants = [];
    let originalCombatantsIds = [];

    let endOfTurn = await this.getActor(ActorType.END_OF_TURN);
    let enemy = await this.getActor(ActorType.ENEMY);
    let henchmen = await this.getActor(ActorType.HENCHMEN);

    await this.setFlag("troika", "endOfTurnActorId", endOfTurn);
    await this.setFlag("troika", "enemyActorId", enemy);
    await this.setFlag("troika", "henchmenActorId", henchmen);
    await this.setFlag("troika", "capEnemyTokens", await game.settings.get("troika", "capEnemyTokens"));

    for (const combatant of combatants) {
      if (combatant.actor.system.stamina.value <= 0)
        continue;

      let objectToAdd;
      if (combatant.actor.type == "pc") {
        objectToAdd = combatant.toObject();
      }
      else if (combatant.actor.type == "henchmen") {
        objectToAdd = { "actorId": henchmen };
      }
      else {
        objectToAdd = { "actorId": enemy };
      }
      let initiativeTokens = combatant.actor.system.initiativeTokens;
      for (let index = 0; index < initiativeTokens; index++) {
        let current = foundry.utils.deepClone(objectToAdd);
        bag.push(current);
      }
      originalCombatantsIds.push(combatant._id);
      originalCombatants.push(combatant.tokenId);
    }

    bag.push({ "actorId": endOfTurn });

    await this.deleteEmbeddedDocuments("Combatant", originalCombatantsIds);
    await this.createEmbeddedDocuments("Combatant", bag);
    await this.setFlag("troika", "originalCombatants", originalCombatants);

    await this.shuffleInitiative();
    return super.startCombat();
  }

  async nextRound() {
    await this.shuffleInitiative();

    return super.nextRound();
  }

  async nextTurn() {
    if (this.combatant.actorId == this.getFlag("troika", "endOfTurnActorId"))
      return this.nextRound();

    return super.nextTurn();
  }
}