
export const registerSystemSettings = function () {
  game.settings.register("troika", "endOfTurnActor", {
    name: "endOfTurnActor",
    scope: "world",
    config: false,
    restricted: true,
    default: null,
    type: String
  });

  game.settings.register("troika", "enemyActor", {
    name: "enemyActor",
    scope: "world",
    config: false,
    restricted: true,
    default: null,
    type: String
  });

  game.settings.register("troika", "capEnemyTokens", {
    name: "Cap enemies tokens to Twice player's tokens?",
    scope: "world",
    config: true,
    restricted: false,
    default: true,
    type: Boolean
  });
}