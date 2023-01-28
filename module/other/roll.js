export async function rollSkillTest(actor, totalRank){

    let formula = `2d6+${totalRank}`
    const roll = await new Roll(formula, {}).roll({async: true});

    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor })
    });
  }

export async function dx6Roll(actor, numberOfD6){
    let formula = numberOfD6.toString() + "d6";
    let dxtotal = '';
    let formulaLabel = 'd';

    const roll = await new Roll(formula, {}).roll({async: true});

    for(let i = 0; i < numberOfD6; i++){
        formulaLabel += "6";
        dxtotal += roll.terms[0].results[i].result;
    }

    let html = '';

    html = `<div class="dice-roll">`
    html += `     <div class="dice-result">`
    html += `     <div class="dice-formula">${formulaLabel}</div>`
    html += `     <div class="dice-tooltip">`
    html += `          <section class="tooltip-part">`
    html += `               <div class="dice">`
    html += `                    <header class="part-header flexrow">`
    html += `                       <span class="part-formula">${formulaLabel}</span>`
    html += `                       <span class="part-total">${dxtotal}</span>`
    html += `                    </header>`
    html += `                    <ol class="dice-rolls">`

    for(let i = 0; i < numberOfD6; i++){
        html += `                         <li class="roll die d6">${roll.terms[0].results[i].result}</li>`
    }

    html += `                    </ol>`
    html += `               </div>`
    html += `          </section>`
    html += `     </div>`
    html += `     <h4 class="dice-total">${dxtotal}</h4>`
    html += `</div>`

    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: html
    });
  }

  export async function d36Roll(actor){
    let formula = "d3+d6";
    let dxtotal = '';
    let formulaLabel = 'd36';
    let val1 = 0;
    let val2 = 0;

    const roll = await new Roll(formula, {}).roll({async: true});
    
    console.log(roll);

    val1 = roll.terms[0].results[0].result;
    val2 = roll.terms[2].results[0].result;
    dxtotal += val1.toString() + val2.toString();

    let html = '';

    html = `<div class="dice-roll">`
    html += `     <div class="dice-result">`
    html += `     <div class="dice-formula">${formulaLabel}</div>`
    html += `     <div class="dice-tooltip">`
    html += `          <section class="tooltip-part">`
    html += `               <div class="dice">`
    html += `                    <header class="part-header flexrow">`
    html += `                       <span class="part-formula">${formulaLabel}</span>`
    html += `                       <span class="part-total">${dxtotal}</span>`
    html += `                    </header>`
    html += `                    <ol class="dice-rolls">`    
    html += `                         <li class="roll die d6">${val1}</li>`
    html += `                         <li class="roll die d6">${val2}</li>`
    html += `                    </ol>`
    html += `               </div>`
    html += `          </section>`
    html += `     </div>`
    html += `     <h4 class="dice-total">${dxtotal}</h4>`
    html += `</div>`

    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: html
    });
  }

  export async function simpleDiceRoll(actor, formula, formulaLabel){

    const roll = await new Roll(formula, {}).roll({async: true});

    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor })
    });
  }