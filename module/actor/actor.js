import { create_roll } from "../other/roll.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class TroikaActor extends Actor {
  prepareData() {
    super.prepareData();
  }

  /** @override */
  get template() {
    return "systems/troika/templates/actor/pc-sheet.html";
  }

  /** @override */
  static async create(data, options = {}) {

    data.prototypeToken = data.prototypeToken || {};

    let [skill_roll, skill_animation] = await create_roll("1d3[white]+3");
    let [stamina_roll, stamina_animation] = await create_roll("2d6[blue]+12");
    let [luck_roll, luck_animation] = await create_roll("1d6[green]+6");

    await Promise.all([skill_animation, stamina_animation, luck_animation]);

    if (data.type === "pc") {
      mergeObject(data.prototypeToken, {
        actorLink: true  // this will make the 'Link Actor Data' option for a token is checked by default. So changes to the token sheet will reflect to the actor sheet.
      }, { overwrite: false });

      mergeObject(data, {
        system: {
          skill: {
            value: skill_roll.total,
          },
          stamina: {
            value: stamina_roll.total,
            max: stamina_roll.total,
          },
          luck: {
            value: luck_roll.total,
            max: luck_roll.total,
          }
        }
      });

      let content = ``;
      content += `<p><strong>Skill:</strong> ${skill_roll.total} (${skill_roll.terms[0].results[0].result} + 3)</p>`;
      content += `<p><strong>Stamina:</strong> ${stamina_roll.total} (${stamina_roll.terms[0].results[0].result} + ${stamina_roll.terms[0].results[1].result} + 12)</p>`;
      content += `<p><strong>Luck:</strong> ${luck_roll.total} (${luck_roll.terms[0].results[0].result} + 6)</p>`;

      ChatMessage.create({
        user: game.user._id,
        content: `<div class="incident-message"><h1>Character Creation:<br>${data.name}</h1>${content}</div>`,
        whisper: game.users.filter(u => u.isGM).map(u => u._id)
      });
    }

    return super.create(data, options);
  }
}