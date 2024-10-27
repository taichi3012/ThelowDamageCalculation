export type SkillProp = {
  name: string;
  multiply: number;
  specialAttackAvailable: boolean;
};

export const SKILL_DATA: { [key: string]: SkillProp } = {
  general_attack: {
    name: "スキルなし(通常攻撃)",
    multiply: 1.0,
    specialAttackAvailable: true,
  },
  magical_mixture_hit: {
    name: "魔混(直撃)",
    multiply: 1.7,
    specialAttackAvailable: true,
  },
  gekokujo_boss: {
    name: "下剋上(BOSS)",
    multiply: 1.07,
    specialAttackAvailable: true,
  },
  gekokujo_boss_excl_job: {
    name: "下剋上(BOSS,専用職業)",
    multiply: 1.3,
    specialAttackAvailable: true,
  },
  //専用職業で冥剣を使用してスケルトンBOSSを攻撃したときなど
  gekokujo_boss_coexis: {
    name: "下剋上(BOSS,専用職業,-10%)",
    multiply: 1.3 * 0.9,
    specialAttackAvailable: false,
  },
  gekokujo_mob: {
    name: "下剋上(MOB)",
    multiply: 0.7,
    specialAttackAvailable: true,
  },
  amrudad_boss_excl_job: {
    name: "アムル(BOSS,専用職業)",
    multiply: 1.1,
    specialAttackAvailable: true,
  },
  maryokuzoufuku_boss: {
    name: "魔力増幅(BOSS)",
    multiply: 1.1,
    specialAttackAvailable: true,
  },
  maryokuzoufuku_mob: {
    name: "魔力増幅(MOB)",
    multiply: 0.85,
    specialAttackAvailable: true,
  },
  volcano: {
    name: "ボルケーノ",
    multiply: 22.0,
    specialAttackAvailable: false,
  },
  magic_ball_chant: {
    name: "マジックボール(詠唱あり)",
    multiply: 8.0,
    specialAttackAvailable: false,
  },
  magic_ball_normal: {
    name: "マジックボール(詠唱なし)",
    multiply: 4.0,
    specialAttackAvailable: false,
  },
  shock_stone: {
    name: "ショックストーン",
    multiply: 7.0,
    specialAttackAvailable: false,
  },
  chaos_blizzard: {
    name: "カオスブリザード(全弾Hit)",
    multiply: 1.1 * 7.0,
    specialAttackAvailable: false,
  },
  snow_pillar: {
    name: "雪柱",
    multiply: 4.0,
    specialAttackAvailable: false,
  },
  stead_shock: {
    name: "ステッドショック",
    multiply: 32.0,
    specialAttackAvailable: false,
  },
  over_shoot_shadow_power: {
    name: "オーバーシュート(スキルあり)",
    multiply: 18.75,
    specialAttackAvailable: false,
  },
  over_shoot_normal: {
    name: "オーバーシュート(スキルなし)",
    multiply: 12.5,
    specialAttackAvailable: false,
  },
  awakening: {
    name: "覚醒",
    multiply: 2.0,
    specialAttackAvailable: true,
  },
  berserk: {
    name: "バーサーク(狂気あり)",
    multiply: 7.5,
    specialAttackAvailable: true,
  },
  eclipse_special: {
    name: "星輝神の歌声",
    multiply: 1.5,
    specialAttackAvailable: true,
  },
  blood_slash: {
    name: "血の斬撃",
    multiply: 2.5,
    specialAttackAvailable: true,
  },
  heiron_metu: {
    name: "ヘイロン滅",
    multiply: 8.0,
    specialAttackAvailable: false,
  },
};
