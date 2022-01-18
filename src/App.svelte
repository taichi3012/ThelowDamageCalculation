<script>
	import { tweened } from "svelte/motion";
	import { quartOut } from "svelte/easing";
	import ThemeButton from "./component/ThemeButton.svelte";
	import { applyTheme } from "./main";

	export let skill_data;
	export let over_strength_values;
	export let darkMode;

	export let weaponDamage = "";
	export let specialDamage = "";
	export let parkGain = "";
	export let jobGain = "";
	export let equipGain = "";
	let overStrength = "0";
	export let numLegendStone = "0";
	export let magicStone = {
		level_1: false,
		level_2: false,
		level_3: false,
		level_4: false,
		"level_4.5": false,
		level_5: false,
	};

	export let skill = "general_attack";
	export let strLevel = 0;

	const normalResult = tweened(0, {
		delay: 200,
		duration: 1000,
		easing: quartOut,
	});

	const criticalResult = tweened(0, {
		delay: 200,
		duration: 1000,
		easing: quartOut,
	});

	let magicStoneScales = {
		level_1: 1.1,
		level_2: 1.15,
		level_3: 1.23,
		level_4: 1.35,
		"level_4.5": 1.4,
		level_5: 1.55,
	};

	$: {
		let normal = Number(weaponDamage);
		if (skill_data[skill].availabilSpecial) {
			normal += specialDamage;
		}

		let scale = (100 + parkGain + jobGain + equipGain) / 100;

		for (const key of Object.keys(magicStone)) {
			if (magicStone[key]) {
				scale *= magicStoneScales[key];
			}
		}

		scale *= skill_data[skill].multiply;
		scale *= strLevel ? 1 + 0.2 * Number(strLevel) : 1;
		scale *= 1.06 ** Number(numLegendStone);

		normalResult.set(normal * scale);
		criticalResult.set(normal * scale * 1.15);

		updateURLParameters();
	}

	function applyOverStrength() {
		parkGain = over_strength_values[Number(overStrength)];
	}

	function updateURLParameters() {
		const url = new URL(window.location);
		const params = new URLSearchParams();

		if (weaponDamage) params.set("wd", weaponDamage.toString(36));
		if (specialDamage) params.set("sd", specialDamage.toString(36));
		if (parkGain) params.set("pg", parkGain.toString(36));
		if (jobGain) params.set("jg", jobGain.toString(36));
		if (equipGain) params.set("eg", equipGain.toString(36));
		if (numLegendStone !== "0") params.set("ns", numLegendStone.toString(36));

		if (skill !== "general_attack") params.set("sk", skill);

		const ms = Object.keys(magicStone).reduce((acc, cur) => {
			return acc + (magicStone[cur] ? 1 : 0);
		}, "");

		if (ms !== "000000") {
			params.set("ms", ms);
		}

		if (strLevel) {
			params.set("str", strLevel.toString(36));
		}

		url.search = params.toString();
		window.history.replaceState({}, "", url);
	}
</script>

<main on:load={applyTheme()}>
	<div class="container vbox">
		<h1>Thelowダメージ計算</h1>
		<div class="result vbox padding">
			<div class="hbox space-around">
				<div class="vbox">
					<h4>通常</h4>
					<span class="text-big">{$normalResult.toFixed(2)}</span>
				</div>
				<div class="vbox">
					<h4>クリティカル</h4>
					<span class="text-big">{$criticalResult.toFixed(2)}</span>
				</div>
			</div>
		</div>
		<div class="params space-around">
			<div class="basicdamage panel padding">
				<h2>基本ダメージ</h2>
				<section>
					<label for="weaponDamageInput">武器の素ダメージ</label>
					<input type="number" placeholder="例:300" bind:value={weaponDamage} />
				</section>
				<section>
					<label for="specialDamageInput">特攻値</label>
					<input type="number" placeholder="例:50" bind:value={specialDamage} />
				</section>
				<section>
					<label for="jobGainInput">職業補正(%)</label>
					<input type="number" placeholder="例:10" bind:value={jobGain} />
				</section>
				<section>
					<label for="equipGainInput">装備補正(%)</label>
					<input type="number" placeholder="例:10" bind:value={equipGain} />
				</section>
				<section>
					<label for="parkGainInput">パーク(%)</label>
					<input type="number" placeholder="例:140" bind:value={parkGain} />
				</section>
				<section>
					<span>オーバーストレンジ</span>
					<div class="hbox">
						<select class="flex-grow-3" bind:value={overStrength}>
							{#each over_strength_values as _, i}
								<option value={`${i}`}>{i}</option>
							{/each}
						</select>
						<input class="flex-grow-1" type="button" value="OS値適用" on:click={applyOverStrength} />
					</div>
				</section>
			</div>
			<div class="vbox panel">
				<div class="magicstone padding vbox">
					<h2>魔法石</h2>
					<section class="vbox margin-1/2em">
						<label for="legendValueSelector">レジェンド魔法石個数</label>
						<select bind:value={numLegendStone}>
							<option value="0">0個</option>
							<option value="1">1個</option>
							<option value="2">2個</option>
							<option value="3">3個</option>
						</select>
					</section>
					<section>
						<input id="ms1" type="checkbox" bind:checked={magicStone["level_1"]} />
						<label for="ms1">特攻魔法石Level1</label>
					</section>
					<section>
						<input id="ms2" type="checkbox" bind:checked={magicStone["level_2"]} />
						<label for="ms2">特攻魔法石Level2</label>
					</section>
					<section>
						<input id="ms3" type="checkbox" bind:checked={magicStone["level_3"]} />
						<label for="ms3">特攻魔法石Level3</label>
					</section>
					<section>
						<input id="ms4" type="checkbox" bind:checked={magicStone["level_4"]} />
						<label for="ms4">特攻魔法石Level4</label>
					</section>
					<section>
						<input id="ms4.5" type="checkbox" bind:checked={magicStone["level_4.5"]} />
						<label for="ms4.5">特攻魔法石Level4.5</label>
					</section>
					<section>
						<input id="ms5" type="checkbox" bind:checked={magicStone["level_5"]} />
						<label for="ms5">特攻魔法石Level5 or Legend</label>
					</section>
				</div>
				<div class="othereffect">
					<h2>その他</h2>
					<section>
						<label for="skillSelector">スキル</label>
						<select bind:value={skill}>
							{#each Object.keys(skill_data) as id}
								<option value={id}>{skill_data[id].name}</option>
							{/each}
						</select>
					</section>
					<section>
						<label for="strengthEffectInput">攻撃力上昇エフェクトLv</label>
						<input type="number" placeholder="例:5" bind:value={strLevel} />
					</section>
				</div>
			</div>
		</div>
		<p class="text-center">※特攻値の乗らないスキル(ショックストーンなど)は、特攻値を除いて計算しています。</p>
		<ThemeButton bind:darkMode />
	</div>
</main>

<style>
	.params {
		display: flex;
		flex-direction: row;
	}

	.container {
		margin: auto;
		max-width: 1000px;
		min-height: 100vh;
	}

	@media screen and (max-width: 640px) {
		.params {
			display: flex;
			flex-direction: column;
		}
		.container {
			margin: 0 0.4em;
		}
	}

	.panel {
		min-width: 40%;
	}

	.basicdamage {
		display: flex;
		flex-direction: column;
	}

	.basicdamage section {
		display: flex;
		flex-direction: column;
		margin: 0.5em;
	}

	.othereffect section {
		display: flex;
		flex-direction: column;
		margin: 0.5em;
	}

	.result {
		justify-content: center;
		text-align: center;
	}
</style>
