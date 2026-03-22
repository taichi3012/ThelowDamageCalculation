import MathUtil from "$lib/utils/mathUtil";
import StringUtil from "$lib/utils/stringUtil";
import {getTitleImage, getParametersImage} from "$lib/og/ogImage";

import type {RequestHandler} from "./$types";
import type {Parameter} from "thelow-damage-calculation/App.svelte";

export const GET = (({url}) => {
  const searchParams = url.searchParams;
  if (!searchParams.toString())
    return getTitleImage();

  const parseFractionalValues = (string: string) => {
    const arr = string.split(".");
    let val = MathUtil.parseBaseInt(arr[0], 62).toString();

    if (arr[1]) {
      val += ".";
      val += parseInt(
        StringUtil.reverse(
          MathUtil.parseBaseInt(arr[1], 62).toString()
        )
      );
    }

    let result = parseFloat(val);

    return result ? result : 0;
  };

  const msFlg: number = searchParams.has("ms") ? MathUtil.parseBaseInt(searchParams.get("ms")!, 62) : 0;
  const componentProps: Parameter = {
    weaponDamage: searchParams.has("wd") ? parseFractionalValues(searchParams.get("wd")!) : 0,
    specialDamage: searchParams.has("sd") ? parseFractionalValues(searchParams.get("sd")!) : 0,
    parkGain: searchParams.has("pg") ? parseFractionalValues(searchParams.get("pg")!) : 0,
    jobGain: searchParams.has("jg") ? parseFractionalValues(searchParams.get("jg")!) : 0,
    equipGain: searchParams.has("eg") ? parseFractionalValues(searchParams.get("eg")!) : 0,
    numLegendStone: searchParams.has("ns") ? parseInt(searchParams.get("ns")!) || 0 : 0,
    skill: searchParams.has("sk") ? searchParams.get("sk")! : "general_attack",
    strLevel: searchParams.has("str") ? MathUtil.parseBaseInt(searchParams.get("str")!, 62) : 0,
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

  return getParametersImage(componentProps);
}) satisfies RequestHandler;
