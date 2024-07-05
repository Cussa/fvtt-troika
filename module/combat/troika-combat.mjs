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
      actor = await Actor.create({ name: actorName, type: "npc", img: actorImg, system: { initiativeTokens: 1 } });
      await game.settings.set("troika", settingId, actor._id);
    }
    return actor._id;
  }

  _shuffleArray(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  }

  async shuffleInitiative() {
    await this.setFlag("troika", "preparing", true);

    const enemyActorId = await this.getFlag("troika", "enemyActorId");
    const endOfTurnActorId = await this.getFlag("troika", "endOfTurnActorId");
    const henchmenActorId = await this.getFlag("troika", "henchmenActorId");
    const capEnemyTokens = await this.getFlag("troika", "capEnemyTokens");

    let enemiesTokens = 0;
    let playersTokens = 0;
    let henchmenTokens = 0;

    let combatants = Array.from(this.combatants);
    let bag = [];
    let tokenIds = await this.getFlag("troika", "tokenIds") || [];
    let originalCombatantsIds = [];

    let playersHandled = [];
    if (this.previous.turn == null)
      bag.push({ "actorId": endOfTurnActorId });

    for (const combatant of combatants) {
      const convertedInitiative = await combatant.getFlag("troika", "convertedInitiative") || 0;
      const initiativeTokens = combatant.actor.system.initiativeTokens;
      const numberToAdd = initiativeTokens - convertedInitiative;
      if (numberToAdd <= 0 || playersHandled.indexOf(combatant.actorId) > -1)
        continue;

      let objectToAdd;
      if (combatant.actor.type == "pc") {
        objectToAdd = combatant.toObject();
        playersHandled.push(combatant.actorId);
      }
      else if (combatant.actor.type == "henchmen") {
        objectToAdd = { "actorId": henchmenActorId };
      }
      else {
        objectToAdd = { "actorId": enemyActorId };
      }
      for (let index = 0; index < numberToAdd; index++) {
        const current = foundry.utils.deepClone(objectToAdd);
        bag.push(current);
      }
      if (convertedInitiative == 0)
        originalCombatantsIds.push(combatant._id);
      if (combatant.tokenId && tokenIds.indexOf(combatant.tokenId) == -1)
        tokenIds.push(combatant.tokenId);
    }

    await this.deleteEmbeddedDocuments("Combatant", originalCombatantsIds);
    await this.createEmbeddedDocuments("Combatant", bag);
    await this.setFlag("troika", "tokenIds", tokenIds);

    let playerInitiatives = {};

    for (const tokenId of tokenIds) {
      const token = await game.scenes.current.tokens.get(tokenId);
      if (!token || token.actor.system.stamina.value <= 0)
        continue;

      if (token.actor.type == "pc") {
        playersTokens += Number(token.actor.system.initiativeTokens);
        if (playerInitiatives[token.actor.id] == undefined)
          playerInitiatives[token.actor.id] = {
            initiative: token.actor.system.initiativeTokens,
            added: 0
          };
      }
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

    let initiativeArray = [...Array(this.combatants.size).keys()];
    this._shuffleArray(initiativeArray);

    console.log(initiativeArray);

    for (const combatant of this.combatants) {
      let initiative = initiativeArray.pop();

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
      else if (combatant.actorId == endOfTurnActorId) {
        while (initiative == this.combatants.size - 1) {
          initiativeArray.push(this.combatants.size);
          this._shuffleArray(initiativeArray);
          initiative = initiativeArray.pop();
        }
      }
      else {
        playerInitiatives[combatant.actor.id].added++;
        if (combatant.actor.system.stamina.value <= 0 ||
          playerInitiatives[combatant.actor.id].added >
          playerInitiatives[combatant.actor.id].initiative
        ) {
          initiative = -1;
        }
      }
      await combatant.setFlag("troika", "convertedInitiative", combatant.actor.system.initiativeTokens);

      updates.push(
        {
          _id: combatant._id,
          initiative: initiative,
        },
      );
    }

    await this.updateEmbeddedDocuments("Combatant", updates);
    await this.setFlag("troika", "preparing", false);
  }

  async startCombat() {
    let endOfTurn = await this.getActor(ActorType.END_OF_TURN);
    let enemy = await this.getActor(ActorType.ENEMY);
    let henchmen = await this.getActor(ActorType.HENCHMEN);

    await this.setFlag("troika", "endOfTurnActorId", endOfTurn);
    await this.setFlag("troika", "enemyActorId", enemy);
    await this.setFlag("troika", "henchmenActorId", henchmen);
    await this.setFlag("troika", "capEnemyTokens", await game.settings.get("troika", "capEnemyTokens"));

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