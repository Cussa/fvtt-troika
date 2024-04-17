# Troika System Change Log

## 2024-04-11 v1.3.0

* ✨ Combat initiative [fix #4].
  - There is a "know issue" on Foundry v11 when you create a new combat, it basically will throw an exception. That does not interferer with the behaviour (https://github.com/foundryvtt/foundryvtt/issues/9718).
* ✨ Allow to roll damage directly from items [fix #13] - QoL for Slate & Chalcedony module.
* ✨ Change NPC and PC field order [fix #9].
* 🐛 Only roll dices for PCs

## 2024-04-11 v1.2.0

* 👷 Add release github action (for auto publish) [Fix #11].
* ✨ Roll the dices when creating the character [fix #5].
* 🐛 Show NPC source [fix #10].

## 2023-11-20 v1.1.0

* Update to compatibility with Foundry v11, breaks backwards compatibility.
* Built in all d66 basic backgrounds from the SRD (i.e. the Core Rulebook).
* Built in some code to build compendiums from json with gulp.
* Special modifiers for advanced skills now show up in character sheet as a (+/-) to make it more obvious why the total isn't the sum of skill and rank.
* CSS fixes and improvements.

## 2023-03-12 v1.0.1

* Fix - Lost 'Advanced NPC' type actor by accident
* Fix - typos on character sheets
* UI Improvement - swapped the order of the +/- buttons on quantity to be more logical
* UI Improvement - Made the mien entry fields on an NPC extend to full width of page
* Feature - Added button next to current mien on NPC sheet that rolls and sets the mien automatically based on the provided table.
* UI Improvement - Added section for worn/weightless gear, items who have have # required slots equal to zero automatically appear here.

## 2022-02-19 v1.0.0

* First public release in Foundry Package Manager
* Character sheets for PC, NPC
* Spells from Corebook Included as Compendium
* Attacks/Weapons from Corebook Included as Compendium
* Oops! and Random Spell Roll Tables included as Compendium