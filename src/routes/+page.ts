import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
	const params: URLSearchParams = url.searchParams;
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

	const msFlg: number = params.has("ms") ? parseInt(params.get("ms")!, 2) : 0;

	return {
		weaponDamage: params.has("wd") ? parseFromAlignedNum(params.get("wd")!) : 0,
		specialDamage: params.has("sd") ? parseFromAlignedNum(params.get("sd")!) : 0,
		parkGain: params.has("pg") ? parseFromAlignedNum(params.get("pg")!) : 0,
		jobGain: params.has("jg") ? parseFromAlignedNum(params.get("jg")!) : 0,
		equipGain: params.has("eg") ? parseFromAlignedNum(params.get("eg")!) : 0,
		numLegendStone: params.has("ns") ? parseInt(params.get("ns")!).toString() : "0",
		skill: params.has("sk") ? params.get("sk") : "general_attack",
		strLevel: params.has("str") ? parseInt(params.get("str")!, 36) : 0,
		magicStone: {
			level_1: ((msFlg >> 5) & 1) == 1,
			level_2: ((msFlg >> 4) & 1) == 1,
			level_3: ((msFlg >> 3) & 1) == 1,
			level_4: ((msFlg >> 2) & 1) == 1,
			"level_4.5": ((msFlg >> 1) & 1) == 1,
			level_5: ((msFlg >> 0) & 1) == 1,
		},
	}
}