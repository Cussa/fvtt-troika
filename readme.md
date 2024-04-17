<div style="text-align: center;">
<h1>Hod Studio Publishing,<br />in collaboration with <a href="http://www.melsonia.com/" target="_blank" rel="nofollow noopener">Melsonian Arts Council</a>,<br />proudly presents:</h1>
</div>
<div style="text-align: center;"><img src="https://static.wixstatic.com/media/ab0272_a037b2b537914fc989238ec7a04323b9~mv2.png/v1/fill/w_980,h_275,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/TroikaTitle.png" /></div>
<div style="text-align: center;">
<em>The official Troika! system for Foundry Virtual Tabletop</em>
</div>
<p>&nbsp;</p>
<div>This system started as a fan-made (amazing work @TheLastScrub, you will never be forgotten!), but is now on the Hod Studio Publishing/Cussa Mitre hands!</div>
<div>&nbsp;</div>
<div>There are several improvements we are planning to do on the system. To know more, check the open issues and discussions happening around the game.</div>

## System Features

* PC Sheet
  * Roll Skill and Luck
  * Roll Advanced Skills and Spells
  * Drag inventory around to re-order
* NPC Sheet
  * Roll Skill
  * Set current mien, log 6 possible miens
* Compendiums
  * All SRD Spells and Skills
  * All SRD Items
  * SRD Oops! Magic Fumble Table
* Initiative system, as defined by the rules

## Character Sheet

![Character Sheet Skills Spells and Attacks](./imgs/char_sheet01.png)

## Initiative

The initiative system handles everything as defined by Troika rules. Choose the tokens that will be added to the initiative and begin the combat. All NPCs will be "converted" to the "-- Enemy --" actor in the initiative. The "-- End of Turn --" defines the end. Clicking on "next turn" will start the next round on Foundry.

![Troika Initiative](./imgs/troika-initiative.mp4)

If you want to use the rules that limits the number of enemies tokens to twice the number of players' tokens select it on the `Configuration Settings`.

![Troika Initiative Configuration](./imgs/cap-enemies-tokens.png)

> [!WARNING]
> ### 🚧 Known problem: henchmen
> The way the initiative is currently implemented means that Henchmen, if created as NPCs like the rules mention, would not appears in the initiative token as the henchmen themselves, but as an enemy. We have an issue (#14) opened in Github to create a new actor type for Henchmen and solve this. In the meantime, please, create your henchmen using the PC sheet.

## Rolling Dice

The following fields on a character sheet are rollable:

![Character Sheet Skills Spells and Attacks](./imgs/rollable-fields-pc.png)

Skill tests let the user choose to roll under (in which case the system rolls 2d6 under the target), or over in which case the system rolls 2d6+Skill.

NOTE - Hold shift and click to bypass the dialog and roll under, hold control and click to bypass the dialog and roll over.

![Character Sheet Skills Spells and Attacks](./imgs/roll-skill-test.png)

When rolling damage, a dialoge will appear that allows the user to modify the 1d6 roll. A custom modifier can be typed in (to account for armor for instance). Or there are buttons that roll with a modifier of -3 through +3 as well. 

All the damage values are displayed in the chat for reference, the value that was rolled is bolded.

![Character Sheet Skills Spells and Attacks](./imgs/roll-damage.png)

Note - *Armour Ignored* value is not automatically included in the damage calculation.

Some books uses an item damage, without really using the item. Something like the following:

> (...) if broken, it explodes (DAMAGE AS GREATSWORD to everyone).

To make things simpler, you can now roll damage directly from item sheet. Use the small dice symbol besides the `Damage roll`.

![Roll from item sheet](./imgs/roll-from-item.png)

## Configuring Attacks

The attacks grid is populated based on what spells and items a character has (this is true of NPCs as well). In order to show up in the available attacks grid, an item or spell must be edited and marked as being an attack:

![Character Sheet Skills Spells and Attacks](./imgs/add-an-attack.png)

If the *Requires Two Hands* checkbox is checked, an asterisk is placed next to the name of the attack in the grid. Similarly, if a non-zero value for *Armour Ignored* is entered, a # sign is placed next to the attack name.

![Character Sheet Skills Spells and Attacks](./imgs/requires-two-hands-armour-ignored.png)

## Inventory Management

Items in the inventory section can be dragged to re-order. Items in compendiums can be dragged and dropped directly on the sheet to add them. If an item is marked as needing multiple inventory slots (heavy armour for instance), it will note the slots it takes up as a range.

![Character Sheet Skills Spells and Attacks](./imgs/inventory-slots.png)

## NPC Sheet

Most characters can be represented by the default PC sheet. To facilitate this, *Initiative* is a value even on a PC sheet.

However besides the *PC*, there are two other Actor types included in the system. These are the *NPC* and the *NPC-Complex*. The complex NPC is simply the PC sheet, but the *Background* field has been replaced by *Mien*. This is largely for more complicated NPCs that might have spells or otherwise be like a PC.

The standard NPC sheet is meant to represent a character statblock similar to the bestiary in the core rulebook. It is far more simple than the PC sheet:

![Character Sheet Skills Spells and Attacks](./imgs/npc-sheet.png)

## Credits

Original system and all versions prior to 1.2 created by TheLastScrub

Version 1.2 and ahead created by Cussa Mitre/Hod Studio Publishing