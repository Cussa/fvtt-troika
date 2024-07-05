import { migrateTo1_5_0 } from "./migrateTo1_5_0.mjs";

export async function migrate() {
  if (!game.user.isGM)
    return;

  const currentVersion = game.settings.get("troika", "systemMigrationVersion");
  Object.keys(migrations).forEach(async function (key) {
    if (!currentVersion || isNewerVersion(key, currentVersion)) {
      await migrations[key]();
      await game.settings.set("troika", "systemMigrationVersion", game.system.version);
    }
  });
}

const migrations = {
  "1.5.0": migrateTo1_5_0
}