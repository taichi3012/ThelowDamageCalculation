import MathUtil from "$lib/utils/mathUtil";
import StringUtil from "$lib/utils/stringUtil";

import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
	const params: URLSearchParams = url.searchParams;
	const parseFractionalValues = function(string: string) {
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

		const result = parseFloat(val);
		return Number.isNaN(result) ? 0 : result;
	};

	const msFlg: number = params.has("ms") ? MathUtil.parseBaseInt(params.get("ms")!, 62) : 0;

	return {
		weaponDamage: params.has("wd") ? parseFractionalValues(params.get("wd")!) : 0,
		specialDamage: params.has("sd") ? parseFractionalValues(params.get("sd")!) : 0,
		parkGain: params.has("pg") ? parseFractionalValues(params.get("pg")!) : 0,
		jobGain: params.has("jg") ? parseFractionalValues(params.get("jg")!) : 0,
		equipGain: params.has("eg") ? parseFractionalValues(params.get("eg")!) : 0,
		numLegendStone: params.has("ns") ? parseInt(params.get("ns")!).toString() : "0",
		skill: params.has("sk") ? params.get("sk") : "general_attack",
		strLevel: params.has("str") ? MathUtil.parseBaseInt(params.get("str")!, 62) : 0,
		magicStone: {
			level_1: ((msFlg >> 0) & 1) == 1,
			level_2: ((msFlg >> 1) & 1) == 1,
			level_3: ((msFlg >> 2) & 1) == 1,
			level_4: ((msFlg >> 3) & 1) == 1,
			"level_4.5": ((msFlg >> 4) & 1) == 1,
			level_5: ((msFlg >> 5) & 1) == 1,
		},
	}
}