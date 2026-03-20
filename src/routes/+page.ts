import type { PageLoad } from "./$types";
import type { Parameter } from "$lib/App.svelte";

export const load: PageLoad = ({ url }) => {
  const urlParams: URLSearchParams = url.searchParams;
  const parseFromAlignedNum = function(str: string) {
    const arr = str.split("E");
    let value = parseInt(arr[0], 36);
    let exp = 0;

    if (arr[1]) {
      exp = parseInt(arr[1], 36);
    }

    value *= 10 ** exp;

    if (exp < 0) {
      value = parseFloat(value.toFixed(-exp));
    }

    return value;
  };

  const msFlg: number = urlParams.has("ms") ? parseInt(urlParams.get("ms")!, 2) : 0;
  const params: Parameter = {
    weaponDamage: urlParams.has("wd") ? parseFromAlignedNum(urlParams.get("wd")!) : 0,
    specialDamage: urlParams.has("sd") ? parseFromAlignedNum(urlParams.get("sd")!) : 0,
    parkGain: urlParams.has("pg") ? parseFromAlignedNum(urlParams.get("pg")!) : 0,
    jobGain: urlParams.has("jg") ? parseFromAlignedNum(urlParams.get("jg")!) : 0,
    equipGain: urlParams.has("eg") ? parseFromAlignedNum(urlParams.get("eg")!) : 0,
    numLegendStone: urlParams.has("ns") ? parseInt(urlParams.get("ns")!) : 0,
    skill: urlParams.has("sk") ? urlParams.get("sk")! : "general_attack",
    strLevel: urlParams.has("str") ? parseInt(urlParams.get("str")!, 36) : 0,
    magicStones: {
      level_1: ((msFlg >> 5) & 1) == 1,
      level_2: ((msFlg >> 4) & 1) == 1,
      level_3: ((msFlg >> 3) & 1) == 1,
      level_4: ((msFlg >> 2) & 1) == 1,
      "level_4.5": ((msFlg >> 1) & 1) == 1,
      level_5: ((msFlg >> 0) & 1) == 1,
    },
    dungeonDamageGain: 0
  };

  return {
    params: params
  };
}
