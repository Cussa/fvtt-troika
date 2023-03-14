export async function rollSkillTestOver(actor, totalRank, rollLabel){

    let formula = `2d6+${totalRank}`
    const roll = await new Roll(formula, {}).roll({async: true});
    rollLabel += " (Roll Against)";

    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        flavor: rollLabel
    });
}

export async function rollSkillTestUnder(actor, totalRank, rollLabel){

    let formula = `2d6`;
    const roll = await new Roll(formula, {}).roll({async: true});
    let dieResult = roll.total;

    rollLabel += " (Roll Under)";

    let style = "";
    let isSuccess = false;

    if(roll.total <= totalRank){
        style = "color: green"
        isSuccess = true;
    }
    else{
        style = "color: red"
    }

    let html = '';

    html = `<div class="dice-roll">`
    html += `     <div class="dice-result">`
    html += `     <div class="dice-formula"><i class="fa-solid fa-crosshairs-simple"></i> ${totalRank}</div>`
    html += `     <div class="dice-tooltip">`
    html += `          <section class="tooltip-part">`
    html += `               <div class="dice">`
    html += `                    <header class="part-header flexrow">`
    html += `                       <span class="part-formula">2d6</span>`
    html += `                       <span class="part-total">${roll.total}</span>`
    html += `                    </header>`
    html += `                    <ol class="dice-rolls">`
    html += `                         <li class="roll die d6 ${dieResult === 1 ? "max" : ""} ${dieResult === 6 ? "min" : ""}">${roll.terms[0].results[0].result}</li>`
    html += `                         <li class="roll die d6 ${dieResult === 1 ? "max" : ""} ${dieResult === 6 ? "min" : ""}">${roll.terms[0].results[1].result}</li>`
    html += `                    </ol>`
    html += `               </div>`
    html += `          </section>`
    html += `     </div>`
    html += `     <h4 class="dice-total" style="${style}">${roll.total} ${isSuccess ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>'}</h4>`
    html += `</div>`

    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: html,
        flavor: rollLabel
    });
}

export async function showDamageRollDialog(actor, item){

    let damageModifier = 0;
    let isMightyBlow = false;

    let html = "";

    html += `<div class="modify-damage-dialog">`;
    html += `     <label for="targetModifier">Modifier:</label>`
    html += `     <input class="center-aligned-input-text-small" type="number" name="damageModifier" value="0" title="+/- Modifier for armour, item bonuses, etc." />`
    html += `     <label for="isMightyBlow">Mighty Blow:</label>`
    html += `     <input class="center-aligned-input-text-small" type="checkbox" name="isMightyBlow" value="0" title="Mighty Blow (x2 Damage)" />`
    html += `</div>`;
    html += `<div class="modify-damage-dialog">*ctrl+click or shift-click to bypass this window and roll with no modifier.</div>`;


    new Dialog({
        title: "Modify Damage Roll",
        default: "rollDamage",
        content: html,
        buttons: {
          rollDamage:{
            label: "Roll",
            callback: html => { 
              try{
                damageModifier = parseInt(html.find("[name='damageModifier']").val());
                isMightyBlow = html.find("[name=isMightyBlow]")[0].checked;
                rollDamageForItem(actor, item, damageModifier, isMightyBlow);
              }
              catch(ex){
                console.log(ex);
              }
            },
          },
          rollDamageMinusThree:{
            label: "-3",
            callback: html =>{
                isMightyBlow = html.find("[name=isMightyBlow]")[0].checked;
                rollDamageForItem(actor, item, -3, isMightyBlow);
            }
          },
          rollDamageMinusTwo:{
            label: "-2",
            callback: html =>{
                isMightyBlow = html.find("[name=isMightyBlow]")[0].checked;
                rollDamageForItem(actor, item, -2, isMightyBlow);
            }
          },
          rollDamageMinusOne:{
            label: "-1",
            callback: html =>{
                isMightyBlow = html.find("[name=isMightyBlow]")[0].checked;
                rollDamageForItem(actor, item, -1, isMightyBlow);
            }
          },
          rollDamagePlusOne:{
            label: "+1",
            callback: html =>{
                isMightyBlow = html.find("[name=isMightyBlow]")[0].checked;
                rollDamageForItem(actor, item, 1, isMightyBlow);
            }
          },
          rollDamagePlusTwo:{
            label: "+2",
            callback: html =>{
                isMightyBlow = html.find("[name=isMightyBlow]")[0].checked;
                rollDamageForItem(actor, item, 2, isMightyBlow);
            }
          },
          rollDamagePlusThree:{
            label: "+3",
            callback: html =>{
                isMightyBlow = html.find("[name=isMightyBlow]")[0].checked;
                rollDamageForItem(actor, item, 3, isMightyBlow);
            }
          }
        }
    }).render(true);

}

export async function rollDamageForItem(actor, item, damageModifier, isMightyBlow){

    let label = `Rolling damage for ${item.name}`;
    let formula = "1d6";
    let damage = 0;
    let damageModifierLabel = ""
    
    if (damageModifier > 0){
        damageModifierLabel = "+" + damageModifier.toString();
        formula += "+" + damageModifier.toString();
    }
    else if(damageModifier < 0){
        damageModifierLabel = damageModifier.toString();
        formula += damageModifier.toString();
    }

    const roll = await new Roll(formula, {}).roll({async: true});

    let dieResult = roll.terms[0].results[0].result;
    let actualResult = roll.total;
    let result = roll.total;

    if (result < 1){
        result = 1;
    }

    if(result === 1){
        damage = item.system.attack.dr1;
    }
    else if(result === 2){
        damage = item.system.attack.dr2;
    }
    else if(result === 3){
        damage = item.system.attack.dr3;
    }
    else if(result === 4){
        damage = item.system.attack.dr4;
    }
    else if(result === 5){
        damage = item.system.attack.dr5;
    }
    else if(result === 6){
        damage = item.system.attack.dr6;
    }
    else {
        damage = item.system.attack.dr7;
    }

    let html = '';

    html =  `<div class="dice-roll">`
    html += `     <div class="dice-result">`
    html += `     <div class="dice-formula">Damage for <i>${item.name} </i>${damageModifier != 0 ? " [" + damageModifierLabel + "]" : ""} ${isMightyBlow ? "<b>[Mighty Blow]</b>" : ""}</div>`
    html += `     <div class="dice-formula">`
    html += `          <div class="attacks-grid-chat">`
    html += `               <span class="dark-underline ${result === 1 ? "bolded" : ""}">1</span>`
    html += `               <span class="dark-underline ${result === 2 ? "bolded" : ""}">2</span>`
    html += `               <span class="dark-underline ${result === 3 ? "bolded" : ""}">3</span>`
    html += `               <span class="dark-underline ${result === 4 ? "bolded" : ""}">4</span>`
    html += `               <span class="dark-underline ${result === 5 ? "bolded" : ""}">5</span>`
    html += `               <span class="dark-underline ${result === 6 ? "bolded" : ""}">6</span>`
    html += `               <span class="dark-underline ${result >= 7 ? "bolded" : ""}">7+</span>`  
    html += `               <span class="${result === 1 ? "italicized bolded" : ""}">${item.system.attack.dr1}</span>`
    html += `               <span class="${result === 2 ? "italicized bolded" : ""}">${item.system.attack.dr2}</span>`
    html += `               <span class="${result === 3 ? "italicized bolded" : ""}">${item.system.attack.dr3}</span>`
    html += `               <span class="${result === 4 ? "italicized bolded" : ""}">${item.system.attack.dr4}</span>`
    html += `               <span class="${result === 5 ? "italicized bolded" : ""}">${item.system.attack.dr5}</span>`
    html += `               <span class="${result === 6 ? "italicized bolded" : ""}">${item.system.attack.dr6}</span>`
    html += `               <span class="${result >= 7 ? "italicized bolded" : ""}">${item.system.attack.dr7}</span>`
    html += `          </div>`
    html += `     </div>`
    html += `     <div class="dice-tooltip">`
    html += `          <section class="tooltip-part">`
    html += `               <div class="dice">`
    html += `                    <header class="part-header flexrow">`
    html += `                       <span class="part-formula">${formula}</span>`
    html += `                       <span class="part-total">${actualResult}</span>`
    html += `                    </header>`
    html += `                    <ol class="dice-rolls">`    
    html += `                         <li class="roll die d6 ${dieResult === 6 ? "max" : ""} ${dieResult === 1 ? "min" : ""}">${dieResult}</li>`
    html += `                    </ol>`
    html += `               </div>`
    html += `          </section>`
    html += `     </div>`
    if(isMightyBlow){
        html += `     <h4 class="dice-total">${damage}x2 = ${damage*2} <i class="fas fa-heart-crack"></h4>`
    }
    else{
        html += `     <h4 class="dice-total">${damage} <i class="fas fa-heart-crack"></h4>`
    }
    html += `</div>`

    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: html
    });

}

// show a dialog that requests a choice of roll under or roll against, and then calls the appropriate function
export async function showSkillTestDialog(actor, totalRank, rollLabel){

    new Dialog({
        title: rollLabel,
        default: "roll",
        buttons: {
          rollUnder:{
            label: "Roll Under",
    
            callback: () => { 
              try{
                rollSkillTestUnder(actor, totalRank, rollLabel);
              }
              catch(ex){
                console.log(ex);
              }
            }
          },
          rollOver:{
            label: "Roll Over",
    
            callback: () => { 
              try{
                rollSkillTestOver(actor, totalRank, rollLabel);
              }
              catch(ex){
                console.log(ex);
              }
            }
          }
        }
    }).render(true);

}

// roll a d66 test, a d666 test, etc...
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

  // Roll a d36 test
  export async function d36Roll(actor){

    let formula = "d3+d6";
    let dxtotal = '';
    let formulaLabel = 'd36';
    let val1 = 0;
    let val2 = 0;

    const roll = await new Roll(formula, {}).roll({async: true});

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

  // roll something simple and send right to chat
  export async function simpleDiceRoll(actor, formula, formulaLabel){

    const roll = await new Roll(formula, {}).roll({async: true});

    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor })
    });

  }