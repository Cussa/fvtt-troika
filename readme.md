# Troika! System (Rules Implementation) for Foundry Virtual Table Top

THIS SOFTWARE IS AN INDEPENDENT PRODUCTION BY AUTHOR AND IS NOT 
AFFILIATED WITH THE MELSONIAN ARTS COUNCIL.

## System Features

* PC Sheet
  * Roll Skill and Luck
  * Roll Advanced Skills and Spells
  * Drag inventory around to re-order
* Compendiums
  * All SRD Spells and Skills
  * All SRD Items
  * SRD Oops! Magic Fumble Table

## Character Sheet

![Character Sheet Skills Spells and Attacks](./assets/doc-img/char_sheet01.png)

## Initiative

Initiative in Troika is difficult to implement with the standard Foundry VTT initiative tracker. But one way of doing within Foundry is to use a *Roll Table*. To do so, add two values for each PC, one value for the end of round, and however many rows are necessary for NPCs. 

Then, make sure that *Draw With Replacement* is **unchecked**, such that values that have already been drawn are removed from the available pool. If the end of round option comes up, simply hit the 'reset' button to bring back the disabled options. Rebalance the table as combatants are killed or defeated.

![Character Sheet Skills Spells and Attacks](./assets/doc-img/initiative-example.png)

## Rolling Dice

The following fields on a character sheet are rollable:

![Character Sheet Skills Spells and Attacks](./assets/doc-img/rollable-fields-pc.png)

Skill tests let the user choose to roll under (in which case the system rolls 2d6 under the target), or over in which case the system rolls 2d6+Skill.

NOTE - Hold shift and click to bypass the dialog and roll under, hold control and click to bypass the dialog and roll over.

![Character Sheet Skills Spells and Attacks](./assets/doc-img/roll-skill-test.png)

When rolling damage, a dialoge will appear that allows the user to modify the 1d6 roll. A custom modifier can be typed in (to account for armor for instance). Or there are buttons that roll with a modifier of -3 through +3 as well. 

All the damage values are displayed in the chat for reference, the value that was rolled is bolded.

![Character Sheet Skills Spells and Attacks](./assets/doc-img/roll-damage.png)

Note - *Armour Ignored* value is not automatically included in the damage calculation.

## Configuring Attacks

The attacks grid is populated based on what spells and items a character has (this is true of NPCs as well). In order to show up in the available attacks grid, an item or spell must be edited and marked as being an attack:

![Character Sheet Skills Spells and Attacks](./assets/doc-img/add-an-attack.png)

If the *Requires Two Hands* checkbox is checked, an asterisk is placed next to the name of the attack in the grid. Similarly, if a non-zero value for *Armour Ignored* is entered, a # sign is placed next to the attack name.

![Character Sheet Skills Spells and Attacks](./assets/doc-img/requires-two-hands-armour-ignored.png)

## Inventory Management

Items in the inventory section can be dragged to re-order. Items in compendiums can be dragged and dropped directly on the sheet to add them. If an item is marked as needing multiple inventory slots (heavy armour for instance), it will note the slots it takes up as a range.

![Character Sheet Skills Spells and Attacks](./assets/doc-img/inventory-slots.png)