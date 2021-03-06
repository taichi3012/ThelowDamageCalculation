import App from "./App.svelte";
import { skill_data } from "./data/skilldata";
import { over_strength_values } from "./data/parkdata";

const app = new App({
	target: document.body,
	props: {
		skill_data,
		over_strength_values,
		darkMode: localStorage.getItem("dark_mode") == "true",
		...parseURLParams(),
	},
});

export function applyTheme() {
	const darkMode = localStorage.getItem("dark_mode") == "true";

	//Apply theme attribute
	if (darkMode) {
		document.documentElement.setAttribute("theme", "dark");
	} else {
		document.documentElement.removeAttribute("theme");
	}
}

export function parseURLParams() {
	const params = new URLSearchParams(location.search);
	const parseFromAlignedNum = function(string) {
		const arr = String(string).split("E");
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

	const parsed = {
		weaponDamage: params.has("wd") ? parseFromAlignedNum(params.get("wd")) : 0,
		specialDamage: params.has("sd") ? parseFromAlignedNum(params.get("sd")) : 0,
		parkGain: params.has("pg") ? parseFromAlignedNum(params.get("pg")) : 0,
		jobGain: params.has("jg") ? parseFromAlignedNum(params.get("jg")) : 0,
		equipGain: params.has("eg") ? parseFromAlignedNum(params.get("eg")) : 0,
		numLegendStone: params.has("ns") ? parseInt(params.get("ns")).toString() : "0",
		skill: params.has("sk") ? params.get("sk") : "general_attack",
		strLevel: params.has("str") ? parseInt(params.get("str"), 36) : 0,
	};

	if (params.has("ms")) {
		const flg = parseInt(params.get("ms"), 2);
		parsed["magicStone"] = {
			level_1: ((flg >> 5) & 1) == 1,
			level_2: ((flg >> 4) & 1) == 1,
			level_3: ((flg >> 3) & 1) == 1,
			level_4: ((flg >> 2) & 1) == 1,
			"level_4.5": ((flg >> 1) & 1) == 1,
			level_5: ((flg >> 0) & 1) == 1,
		};
	}

	return parsed;
}

export function copyToClipboard(text) {
	const textarea = document.createElement("textarea");
	document.body.append(textarea);
	textarea.value = text;

	textarea.select();
	document.execCommand("copy");
	textarea.remove(textarea);
}

export default app;
