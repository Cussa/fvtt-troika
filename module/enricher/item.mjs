export function itemEnricher(item) {
  item.system.displayName = item.name;

  if (item.type != "gear")
    return;

  let tooltip = [];

  if (item.system.requiresTwoHands === true) {
    item.system.displayName += "*";
    tooltip.push("This item requires two hands to wield.");
  }

  if (item.system.armourIgnored > 0) {
    item.system.displayName += "#";
    tooltip.push(`This item bypasses ${item.system.armourIgnored} point(s) of armour.`);
  }

  item.system.attackTooltip = tooltip.join("<br>");
}