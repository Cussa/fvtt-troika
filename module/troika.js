import { TroikaActor } from "./actor/actor.js";
import { TroikaActorSheet } from "./actor/actor-sheet.js";
import { TroikaItem } from "./item/item.js";
import { TroikaItemSheet } from "./item/item-sheet.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import TroikaCombat from "./combat/troika-combat.mjs";
import { TroikaCombatTracker } from "./combat/combat-tracker.mjs";
import { registerSystemSettings } from "./other/settings.mjs";
import { migrate } from "./migrations/migrations.mjs";
import { addAimingStatus } from "./combat/aiming.mjs";

import * as models from './data/_module.mjs';

Hooks.once('init', async function () {

  game.troika = {
    TroikaActor,
    TroikaItem
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = TroikaActor;
  CONFIG.Item.documentClass = TroikaItem;

  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);
  Actors.registerSheet("troika", TroikaActorSheet, { makeDefault: true });
  Items.registerSheet("troika", TroikaItemSheet, { makeDefault: true });

  preloadHandlebarsTemplates();

  registerSystemSettings();

  // Combat Configuration

  CONFIG.Combat.documentClass = TroikaCombat;
  CONFIG.ui.combat = TroikaCombatTracker;

  CONFIG.Actor.dataModels = {
    pc: models.TroikaPc,
    npc: models.TroikaNpc,
    "npc-complex": models.TroikaNpcComplex,
    henchmen: models.TroikaHenchmen,
    background: models.TroikaBackground
  };

  CONFIG.Item.dataModels = {
    gear: models.TroikaGear,
    skill: models.TroikaSkill,
    spell: models.TroikaSpell
  };

  // Add Handlebars helpers
  Handlebars.registerHelper('concat', function () {
    var outStr = '';

    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('if_eq', function (a, b, opts) {
    if (a == b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });

  Handlebars.registerHelper('if_not_eq', function (a, b, opts) {
    if (a != b) { return opts.fn(this); }
    return opts.inverse(this);
  });

  Handlebars.registerHelper('sum_three_ints', function (a, b, c, opts) {
    return parseInt(a) + parseInt(b) + parseInt(c);
  });

  Handlebars.registerHelper('remove_html_tags', function (str, opts) {
    if (str === null) {
      return null;
    }
    else {
      str = str.toString();
      return str.replace(/(<([^>]+)>)/ig, '');
    }
  });

  Handlebars.registerHelper('show_rank_modifier', function (modifier, opts) {
    if (!modifier) {
      return '';
    }
    else if (modifier == 0) {
      return '';
    }
    else {
      let formattedStr = modifier.toString();
      if (modifier > 0) {
        formattedStr = "+" + formattedStr;
      }
      else if (modifier < 0)
        formattedStr = "-" + formattedStr;

      return " (" + formattedStr + ")";
    }
  });
});

Hooks.once("ready", async function () {
  await migrate();
  addAimingStatus();
});