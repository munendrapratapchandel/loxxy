import { Player } from './types';

export function calculatePowerIndex(player: Player): number {
  if (player.powerIndex !== undefined && player.powerIndex > 0) {
    return player.powerIndex;
  }
  const pvp = player.skills?.['PvP'] ?? 90;
  const gameSense = player.skills?.['Game Sense'] ?? 90;
  const clutching = player.skills?.['Clutching'] ?? 85;
  const building = player.skills?.['Building'] ?? 75;
  const parkour = player.skills?.['Parkour'] ?? 80;

  let tierBonus = 0;
  const tiers = Object.values(player.pvpTiers || {});
  if (tiers.includes('HT1')) tierBonus = 6.0;
  else if (tiers.includes('HT2')) tierBonus = 4.5;
  else if (tiers.includes('HT3')) tierBonus = 3.0;
  else if (tiers.includes('LT1')) tierBonus = 2.0;

  const raw = (pvp * 0.38) + (gameSense * 0.24) + (clutching * 0.16) + (building * 0.10) + (parkour * 0.08) + tierBonus;
  return Math.min(99.9, Math.round(raw * 10) / 10);
}
