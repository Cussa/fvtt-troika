export async function migrateTo1_5_0() {
  const actorsSettingIds = ["endOfTurnActor", "enemyActor", "henchmenActor"];

  for (const actorSettingId of actorsSettingIds) {
    const actorId = await game.settings.get("troika", actorSettingId);
    if (!actorId)
      continue;

    const actor = await game.actors.get(actorId);
    await actor.update({ "system.initiativeTokens": 1 });
  }
}