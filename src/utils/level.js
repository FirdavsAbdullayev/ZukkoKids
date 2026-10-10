/**
 * Tanga miqdoriga qarab daraja (level) hisoblash.
 * Har 100 tanga = +1 daraja. Progress keyingi darajagacha.
 */
export const LEVEL_STEP = 100;

export function getLevelInfo(coins = 0) {
  const level = Math.floor(coins / LEVEL_STEP) + 1;
  const progressInLevel = coins % LEVEL_STEP;
  const progressPct = Math.round((progressInLevel / LEVEL_STEP) * 100);
  return { level, progressInLevel, progressPct };
}

export const LEVEL_TITLES = [
  'Yangi o\'quvchi',
  'Tanga topuvchi',
  'Aqlliroq',
  'Bilimdon',
  'Yulduz o\'quvchi',
  'Alohida',
  'Bilim shahzodasi',
  'Moltivor',
  'Oltin aql',
  "Zukko yulduz",
];