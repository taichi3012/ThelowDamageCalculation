export const skill_data = {
	general_attack: {
		name: "スキルなし(通常攻撃)",
		multiply: 1.0,
		availabilSpecial: true,
	},
	magical_mixture_hit: {
		name: "魔混(直撃)",
		multiply: 1.7,
		availabilSpecial: true,
	},
	gekokujo_boss: {
		name: "下剋上(BOSS)",
		multiply: 1.07,
		availabilSpecial: true,
	},
	gekokujo_boss_excl_job: {
		name: "下剋上(BOSS,専用職業)",
		multiply: 1.3,
		availabilSpecial: true,
	},
	//専用職業で冥剣を使用してスケルトンBOSSを攻撃したときなど
	gekokujo_boss_coexis: {
		name: "下剋上(BOSS,専用職業,-10%)",
		multiply: 1.3 * 0.9,
		availabilSpecial: false,
	},
	gekokujo_mob: {
		name: "下剋上(MOB)",
		multiply: 0.7,
		availabilSpecial: true,
	},
	amrudad_boss_excl_job: {
		name: "アムル(BOSS,専用職業)",
		multiply: 1.1,
		availabilSpecial: true,
	},
	volcano: {
		name: "ボルケーノ",
		multiply: 22.0,
		availabilSpecial: false,
	},
	magic_ball_chant: {
		name: "マジックボール(詠唱あり)",
		multiply: 8.0,
		availabilSpecial: false,
	},
	magic_ball_normal: {
		name: "マジックボール(詠唱なし)",
		multiply: 4.0,
		availabilSpecial: false,
	},
	shock_stone: {
		name: "ショックストーン",
		multiply: 7.0,
		availabilSpecial: false,
	},
	chaos_blizzard: {
		name: "カオスブリザード(全弾Hit)",
		multiply: 1.1 * 7.0,
		availabilSpecial: false,
	},
	snow_pillar: {
		name: "雪柱",
		multiply: 4.0,
		availabilSpecial: false,
	},
	stead_shock: {
		name: "ステッドショック",
		multiply: 32.0,
		availabilSpecial: false,
	},
	over_shoot_shadow_power: {
		name: "オーバーシュート(スキルあり)",
		multiply: 18.75,
		availabilSpecial: false,
	},
	over_shoot_normal: {
		name: "オーバーシュート(スキルなし)",
		multiply: 12.5,
		availabilSpecial: false,
	},
	awakening: {
		name: "覚醒",
		multiply: 2.0,
		availabilSpecial: true,
	},
	blood_slash: {
		name: "血の斬撃",
		multiply: 2.5,
		availabilSpecial: true,
	},
	heiron_metu: {
		name: "ヘイロン滅",
		multiply: 8.0,
		availabilSpecial: false,
	},
};
