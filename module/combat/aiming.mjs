export function addAimingStatus(){
  CONFIG.statusEffects.push({
    icon: "systems/troika/assets/icons/bullseye.svg",
    id: "aiming",
    label: "Aiming",
    changes: [
      {
        key: "system.initiativeTokens",
        mode: 2,
        value: -1
      }
    ],
    statuses: ["aiming"]
  })
}