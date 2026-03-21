import MathUtil from "$lib/utils/mathUtil";
import StringUtil from "$lib/utils/stringUtil";

import type {PageLoad} from "./$types";
import type {Parameter} from "thelow-damage-calculation/App.svelte";

export const load: PageLoad = ({url}) => {
  const ogImgBaseURL = "https://thelow-damage-calculation-taichi3012.vercel.app/api/og.png";
  const urlParams: URLSearchParams = url.searchParams;

  const parseFractionalValues = function (str: string) {
    const arr = str.split(".");
    let val = MathUtil.parseBaseInt(arr[0], 62).toString();

    if (arr[1]) {
      val += ".";
      val += parseInt(
        StringUtil.reverse(
          MathUtil.parseBaseInt(arr[1], 62).toString()
        )
      );
    }

    const result = parseFloat(val);
    return Number.isNaN(result) ? 0 : result;
  };

  const msFlg: number = urlParams.has("ms") ? MathUtil.parseBaseInt(urlParams.get("ms")!, 62) : 0;
  const params: Parameter = {
    weaponDamage: urlParams.has("wd") ? parseFractionalValues(urlParams.get("wd")!) : 0,
    specialDamage: urlParams.has("sd") ? parseFractionalValues(urlParams.get("sd")!) : 0,
    parkGain: urlParams.has("pg") ? parseFractionalValues(urlParams.get("pg")!) : 0,
    jobGain: urlParams.has("jg") ? parseFractionalValues(urlParams.get("jg")!) : 0,
    equipGain: urlParams.has("eg") ? parseFractionalValues(urlParams.get("eg")!) : 0,
    numLegendStone: urlParams.has("ns") && parseInt(urlParams.get("ns")!) ? parseInt(urlParams.get("ns")!) : 0,
    skill: urlParams.has("sk")  ? urlParams.get("sk")! : "general_attack",
    strLevel: urlParams.has("str") ? MathUtil.parseBaseInt(urlParams.get("str")!, 62) : 0,
    magicStones: {
      level_1: ((msFlg >> 0) & 1) == 1,
      level_2: ((msFlg >> 1) & 1) == 1,
      level_3: ((msFlg >> 2) & 1) == 1,
      level_4: ((msFlg >> 3) & 1) == 1,
      "level_4.5": ((msFlg >> 4) & 1) == 1,
      level_5: ((msFlg >> 5) & 1) == 1,
    },
    dungeonDamageGain: 0
  };

  return {
    params: params,
    ogImage: ogImgBaseURL + "?" + urlParams.toString(),
  }
}
