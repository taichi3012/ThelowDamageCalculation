<script lang="ts">
	import checkBox from "$lib/icons/check_box_black_36dp.svg?raw";
	import checkBoxOutline from "$lib/icons/check_box_outline_blank_black_36dp.svg?raw";
	import { SKILL_DATA } from "$lib/data/skillData";

	export let weaponDamage = 0;
	export let specialDamage = 0;
	export let parkGain = 0;
	export let jobGain = 0;
	export let equipGain = 0;
	export let numLegendStone = 0;
	export let magicStone: { [key: string]: boolean } = {
		level_1: false,
		level_2: false,
		level_3: false,
		level_4: false,
		"level_4.5": true,
		level_5: false,
	};
	export let skill = "general_attack";
	export let strLevel = 0;

	const magicStoneScales: { [key: string]: number } = {
		level_1: 1.1,
		level_2: 1.15,
		level_3: 1.23,
		level_4: 1.35,
		"level_4.5": 1.4,
		level_5: 1.55,
	};

	const magicStoneDisplayNames: { [key: string]: string } = {
		level_1: "魔法石Level1",
		level_2: "魔法石Level2",
		level_3: "魔法石Level3",
		level_4: "魔法石Level4",
		"level_4.5": "魔法石Level4.5",
		level_5: "魔法石Level5 or Leg",
	};

	let skillData = SKILL_DATA[skill] || SKILL_DATA["general_attack"];

	let magicStoneMul = Object.entries(magicStone)
		.filter(v => v[1])
		.reduce((pv, cv) => pv * magicStoneScales[cv[0]], 1);

	let resultDamage = findValue();
	let normalResult = resultDamage.toFixed(2);
	let criticalResult = (resultDamage * 1.15).toFixed(2);

	function findValue() {
		let value = 0;
		value += weaponDamage + (skillData.availabilSpecial ? specialDamage : 0);
		value *= magicStoneMul;
		value *= (100 + parkGain + jobGain + equipGain) / 100;
		value *= skillData.multiply;
		value *= 1 + 0.2 * strLevel;
		value *= 1.06 ** numLegendStone;

		return value
	}

	function getSigned(num: number) {
		return num > 0 ? "+" + num : num;
	}

	const boldNumsCharRatio = 0.589;
	const boldPeriodsCharRatio = 0.325;
	function clacFontSize(text: string, width: number, defaultSize: number, minSize: number) {
		let sum = 0;
		for (const char of text) {
			sum += char.match(/^[0-9]$/) ? boldNumsCharRatio
				: char == "." ? boldPeriodsCharRatio
				: 0;
		}

		return Math.max(minSize, Math.min(defaultSize, width / sum));
	}
</script>

<div class="container hbox" lang="ja-JP">
	<div class="result vbox space-around align-center">
		<div class="vbox align-center">
			通常
			<span class="bold" style="font-size: {clacFontSize(normalResult, 420, 80, 20)}px;">{normalResult}</span>
		</div>
		<div class="vbox align-center">
			クリティカル
			<span class="bold" style="font-size: {clacFontSize(criticalResult, 420, 80, 20)}px">{criticalResult}</span>
		</div>
	</div>
	<div class="params hbox">
		<div class="vbox flex-grow-1 align-stretch">
			<div class="vbox align-stretch margin1-2em">
				<span class="headline">基礎ダメージ</span>
				<div class="hbox space-between">
					武器ダメージ
					<span>{getSigned(weaponDamage)}</span>
				</div>
				<div class="hbox space-between">
					特攻値
					<span>{getSigned(specialDamage)}</span>
				</div>
			</div>
			<div class="vbox align-stretch margin1-2em">
				<span class="headline">魔法石</span>
				<div class="vbox">
					{#each Object.entries(magicStone) as entry}
						<div class="hbox">
							<span style="align-self: center;">{@html entry[1] ? checkBox : checkBoxOutline}</span>
							<span>{magicStoneDisplayNames[entry[0]]}</span>
						</div>
					{/each}
				</div>
				<div class="hbox space-between">
					レジェンド魔法石
					<span>{`${numLegendStone}個`}</span>
				</div>
				<div class="reduce-value hbox space-between">
					倍率(四捨五入)
					<span>{`×${(magicStoneMul * (1.06 ** numLegendStone)).toFixed(3)}`}</span>
				</div>
			</div>
		</div>
		<div class="vbox flex-grow-1 align-stretch">
			<div class="vbox align-stretch margin1-2em">
				<span class="headline">加算値</span>
				<div class="hbox space-between">
					パーク
					<span>{`${parkGain}%`}</span>
				</div>
				<div class="hbox space-between">
					職業補正
					<span>{`${jobGain}%`}</span>
				</div>
				<div class="hbox space-between">
					装備補正
					<span>{`${equipGain}%`}</span>
				</div>
				<div class="reduce-value hbox space-between">
					合計
					<span>{`${parkGain + jobGain + equipGain}%`}</span>
				</div>
			</div>
			<div class="vbox align-stretch margin1-2em">
				<span class="headline">その他</span>
				<div class="vbox" style="margin-bottom: 0.5em;">
					スキル
					<span>{skillData.name}</span>
				</div>
				<div class="vbox">
					攻撃力上昇エフェクト
					<span>{`Level${strLevel}`}</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		align-items: stretch;
		background-color: white;
		font-family: "Noto Sans JP";
		font-weight: 500;
		font-size: 28px;
	}

	.result {
		width: 35%;
	}

	.params {
		width: 65%;
	}

	.headline {
		align-self: stretch;
		margin-bottom: 0.2em;
		border-bottom: 2px solid;
		font-size: 32px;
		font-weight: bold;
	}

	.reduce-value {
		margin-top: 0.2em;
		border-top: 2px solid;
	}

	.vbox {
		display: flex;
		flex-direction: column;
	}

	.hbox {
		display: flex;
		flex-direction: row;
	}

	.space-around {
		justify-content: space-around;
	}

	.space-between {
		justify-content: space-between;
	}

	.align-center {
		align-items: center;
	}

	.align-stretch {
		align-items: stretch;
	}

	.margin1-2em {
		margin: 0.5em;
	}

	.flex-grow-1 {
		flex-grow: 1;
	}

	.bold {
		font-weight: bold;
	}
</style>