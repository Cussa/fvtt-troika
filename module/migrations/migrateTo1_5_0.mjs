export async function migrateTo1_5_0() {
  const actorsSettingIds = ["endOfTurnActor", "enemyActor", "henchmenActor"];

  for (const actorSettingId of actorsSettingIds) {
    const actorId = await game.settings.get("troika", actorSettingId);
    if (!actorId)
      continue;

    const actor = await game.actors.get(actorId);
    await actor.update({ "system.initiativeTokens": 1 });
  }

  for (const actor of game.actors) {
    var updates = {
      "system.initiativeTokens": parseInt(actor.system.initiativeTokens),
      "system.stamina.value": parseInt(actor.system.stamina.value),
      "system.stamina.max": parseInt(actor.system.stamina.max),
      "system.stamina.min": parseInt(actor.system.stamina.min),
      "system.skill.value": parseInt(actor.system.skill.value),
      "system.armour": parseInt(actor.system.armour),
    }
    if (actor.type == "pc") {
      updates["system.luck.value"] = parseInt(actor.system.luck.value);
      updates["system.luck.max"] = parseInt(actor.system.luck.max);
      updates["system.luck.min"] = parseInt(actor.system.luck.min);
    }
    await actor.update(updates);
  }
}