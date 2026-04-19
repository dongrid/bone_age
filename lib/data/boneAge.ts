// TW2 (Tanner-Whitehouse 2) bone age scoring data
// Source: medicalmac.com/bone.htm (boy) and medicalmac.com/boneg.htm (girl)
// Method: RUS (Radius, Ulna, Short bones) + Carpal scoring → bone age in years

export type Sex = "boy" | "girl";

export type Stage = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";

export interface BoneDefinition {
  key: string;
  nameJa: string;
  nameEn: string;
  image: string;
  stages: Stage[];
  criteria: Partial<Record<Stage, string>>;
}

export interface BoneScores {
  // indices 0-8: RUS or Carpal score per stage (A=index 0)
  rusOrCarpal: number[];
  // indices 0-8: 20-bone score per stage
  twentyBone: number[];
}

export interface AgeTable {
  startAge: number; // age in years for the first entry
  thresholds: number[]; // score thresholds; each step = 0.1 years; 0 = end (ADULT)
}

// ─── Stage criteria (same for boy and girl) ───────────────────────────────────

export const BONE_DEFINITIONS: BoneDefinition[] = [
  {
    key: "RADIUS",
    nameJa: "橈骨",
    nameEn: "Radius",
    image: "/images/bones/radius.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2 / 楔形 / 近位辺縁の1/3が平坦",
      E: "白線が出現",
      F: "近位辺縁に不規則な白線 / 近位辺縁が骨幹端遠位辺縁の1/2以上に伸びている",
      G: "humpがある / ２本の白線 / 近位辺縁が凹",
      H: "キャップ現象を認める",
      I: "癒合開始",
    },
  },
  {
    key: "ULNA",
    nameJa: "尺骨",
    nameEn: "Ulna",
    image: "/images/bones/ulna.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2 / a>>c / 楔形",
      E: "茎状突起出現",
      F: "濃淡差が明瞭になり内部に白線 / Radius側が平坦",
      G: "a=b / 1/3で重複",
      H: "癒合開始",
    },
  },
  {
    key: "META1",
    nameJa: "第1中手骨",
    nameEn: "1st Metacarpal",
    image: "/images/bones/meta1.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2",
      E: "a=b / 近位辺縁が凹",
      F: "内部に白線が２本",
      G: "キャップ現象",
      H: "癒合開始",
      I: "癒合完了",
    },
  },
  {
    key: "META3",
    nameJa: "第3中手骨",
    nameEn: "3rd Metacarpal",
    image: "/images/bones/meta35.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2 / 丸い",
      E: "角張ってくる",
      F: "２本の白線が内部にはっきりしてくる",
      G: "a>b",
      H: "癒合開始（骨幹端の1/4以上の部分で癒合）",
      I: "癒合完了",
    },
  },
  {
    key: "META5",
    nameJa: "第5中手骨",
    nameEn: "5th Metacarpal",
    image: "/images/bones/meta35.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2 / 丸い",
      E: "角張ってくる",
      F: "２本の白線が内部にはっきりしてくる",
      G: "a>b",
      H: "癒合開始（骨幹端の1/4以上の部分で癒合）",
      I: "癒合完了",
    },
  },
  {
    key: "PROX1",
    nameJa: "第1基節骨",
    nameEn: "1st Proximal phalanx",
    image: "/images/bones/prox1.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2",
      E: "近位辺縁が凹で白く見える / 楔形",
      F: "a>b",
      G: "キャップ現象",
      H: "癒合開始",
      I: "癒合完了",
    },
  },
  {
    key: "PROX3",
    nameJa: "第3基節骨",
    nameEn: "3rd Proximal phalanx",
    image: "/images/bones/prox35.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2",
      E: "凹でかつ白く見える",
      F: "a=b",
      G: "キャップ現象",
      H: "癒合開始",
      I: "癒合完了",
    },
  },
  {
    key: "PROX5",
    nameJa: "第5基節骨",
    nameEn: "5th Proximal phalanx",
    image: "/images/bones/prox35.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2",
      E: "凹でかつ白く見える",
      F: "a=b",
      G: "キャップ現象",
      H: "癒合開始",
      I: "癒合完了",
    },
  },
  {
    key: "MID3",
    nameJa: "第3中節骨",
    nameEn: "3rd Middle phalanx",
    image: "/images/bones/mid35.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2",
      E: "凸かつ白く見える",
      F: "a=b",
      G: "キャップ現象",
      H: "癒合開始",
      I: "癒合完了",
    },
  },
  {
    key: "MID5",
    nameJa: "第5中節骨",
    nameEn: "5th Middle phalanx",
    image: "/images/bones/mid35.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2",
      E: "凸かつ白く見える",
      F: "a=b",
      G: "キャップ現象",
      H: "癒合開始",
      I: "癒合完了",
    },
  },
  {
    key: "DIST1",
    nameJa: "第1末節骨",
    nameEn: "1st Distal phalanx",
    image: "/images/bones/dis1.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2",
      E: "a=b / 遠位辺縁が平坦でかつ近位辺縁が凸",
      F: "近位外側縁が凹 / 鞍形成 / a>b",
      G: "キャップ現象",
      H: "癒合開始",
      I: "癒合完了",
    },
  },
  {
    key: "DIST3",
    nameJa: "第3末節骨",
    nameEn: "3rd Distal phalanx",
    image: "/images/bones/dis35.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2",
      E: "a=b / 近位辺縁凸",
      F: "内部に白線",
      G: "キャップ現象",
      H: "癒合開始",
      I: "癒合完了",
    },
  },
  {
    key: "DIST5",
    nameJa: "第5末節骨",
    nameEn: "5th Distal phalanx",
    image: "/images/bones/dis35.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2",
      E: "a=b / 近位辺縁凸",
      F: "内部に白線",
      G: "キャップ現象",
      H: "癒合開始",
      I: "癒合完了",
    },
  },
  // Carpal bones
  {
    key: "CAPITATE",
    nameJa: "有頭骨",
    nameEn: "Capitate",
    image: "/images/bones/capi.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H"],
    criteria: {
      A: "骨化中心未出現",
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2（橈骨横径の半分） / 有鉤骨に接する辺縁が平坦もしくはやや凸 / 「D」形",
      E: "有鉤骨に接する辺縁は凹でかつやや白く見える / b>a>>c",
      F: "a>b",
      G: "遠位外側縁に白線 / 有鉤骨に接する辺縁より白くなる",
      H: "有頭骨内部に白線",
    },
  },
  {
    key: "HAMATE",
    nameJa: "有鉤骨",
    nameEn: "Hamate",
    image: "/images/bones/hama.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      A: "骨化中心未出現",
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2 / 三角骨との関節面が平坦化 / 「D」型",
      E: "有鉤骨に接する辺縁中心やや近位側の隆起 / 「D」型「三角」形",
      F: "三角骨に接する辺縁凹",
      G: "遠位辺縁または内部白くなる",
      H: "hookの出現 / 第4・5中手骨との関節面形成 / 遠位辺縁に「へ」形白線",
      I: "hookの完成",
    },
  },
  {
    key: "TRIQUET",
    nameJa: "三角骨",
    nameEn: "Triquetral",
    image: "/images/bones/triq.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H"],
    criteria: {
      A: "骨化中心未出現",
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2 / 有鈎骨に接する辺縁が平坦",
      E: "縦径>横径",
      F: "月状骨に接する辺縁の平坦化 / 有鈎骨に接する辺縁と約90度の核を形成",
      G: "有鈎骨または月状骨に接する辺縁が手掌面と手背面の２本線を形成する",
      H: "内側辺縁が凹",
    },
  },
  {
    key: "LUNATE",
    nameJa: "月状骨",
    nameEn: "Lunate",
    image: "/images/bones/Lunate.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H"],
    criteria: {
      A: "骨化中心未出現",
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2 / 遠位辺縁が白くなる",
      E: "遠位辺縁部に白線 / 橈骨に接する辺縁が平坦化",
      F: "鞍形成・a<b / 舟状骨と三角骨に接する辺縁が平坦化およびやや白く見える",
      G: "a>b/2 / 舟状骨に接する辺縁と橈骨に接する辺縁で明確な「角」が出来る",
      H: "鞍の手背面が舟状骨と重なる / 舟状骨に接する辺縁が凹",
    },
  },
  {
    key: "SCAPHOID",
    nameJa: "舟状骨",
    nameEn: "Scaphoid",
    image: "/images/bones/Scaphoid.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H"],
    criteria: {
      A: "骨化中心未出現",
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2",
      E: "白線の出現",
      F: "有頭骨との関節面である２本線がいずれも凹 / 大小菱形骨と接する面が平坦",
      G: "有頭骨との関節面が手掌側凹・手背側凸 / 手掌の中心線にA点がB点よりも近い",
      H: "有頭骨との関節面が全体にわたり有頭骨辺縁に沿う / B点がA点よりも中心線に近くなる / 遠位外側辺縁が凹",
    },
  },
  {
    key: "TRAPEZIUM",
    nameJa: "大菱形骨",
    nameEn: "Trapezium",
    image: "/images/bones/Trapezium.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    criteria: {
      A: "骨化中心未出現",
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2 / 舟状骨面・第1中手骨面ともに平坦 / m>n",
      E: "g<d/3",
      F: "第1中手骨に接する辺縁が凹",
      G: "遠位辺縁が第2中手骨と重複 / 舟状骨に接する辺縁が平坦・白くなる",
      H: "外側縁の平坦化 / 第1中手骨と鞍状関節面を形成",
      I: "外側近位辺縁の突出",
    },
  },
  {
    key: "TRAPEZOID",
    nameJa: "小菱形骨",
    nameEn: "Trapezoid",
    image: "/images/bones/Trapezoid.gif",
    stages: ["A", "B", "C", "D", "E", "F", "G", "H"],
    criteria: {
      A: "骨化中心未出現",
      B: "辺縁不明瞭",
      C: "辺縁が明瞭で平滑",
      D: "a>b/2",
      E: "白線 / 平坦化",
      F: "第2中手骨および有頭骨と接する辺縁に白線 / 遠位辺縁の突出",
      G: "第2中手骨および有頭骨と接する辺縁骨内部に白線",
      H: "近位辺縁が凹 / 内部に白い直線がみられる",
    },
  },
];

// RUS bones (used in RUS score and 20-bone score)
export const RUS_BONE_KEYS = [
  "RADIUS", "ULNA",
  "META1", "META3", "META5",
  "PROX1", "PROX3", "PROX5",
  "MID3", "MID5",
  "DIST1", "DIST3", "DIST5",
] as const;

// Carpal bones (used in Carpal score and 20-bone score)
export const CARPAL_BONE_KEYS = [
  "CAPITATE", "HAMATE", "TRIQUET", "LUNATE",
  "SCAPHOID", "TRAPEZIUM", "TRAPEZOID",
] as const;

// ─── Bone score tables ─────────────────────────────────────────────────────────
// Each entry: [rusOrCarpalScores (9 values), twentyBoneScores (9 values)]
// Index 0 = stage A, index 1 = stage B, ..., index 8 = stage I
// 0 means "not applicable" for that stage

type BoneScoreTable = Record<string, { rusOrCarpal: number[]; twentyBone: number[] }>;

export const BOY_SCORES: BoneScoreTable = {
  RADIUS:    { rusOrCarpal: [0,16,21,30,39,59,87,138,213],  twentyBone: [0,15,17,21,27,48,77,96,106] },
  ULNA:      { rusOrCarpal: [0,27,30,32,40,58,107,181,0],   twentyBone: [0,22,26,30,39,56,73,84,0] },
  META1:     { rusOrCarpal: [0,6,9,14,21,26,36,49,67],      twentyBone: [0,4,5,11,19,24,28,30,32] },
  META3:     { rusOrCarpal: [0,4,5,9,12,19,31,43,52],       twentyBone: [0,3,4,6,10,16,22,23,25] },
  META5:     { rusOrCarpal: [0,4,6,9,14,18,29,43,52],       twentyBone: [0,3,3,6,12,17,21,23,25] },
  PROX1:     { rusOrCarpal: [0,7,8,11,17,26,38,52,67],      twentyBone: [0,4,5,8,15,23,28,30,32] },
  PROX3:     { rusOrCarpal: [0,4,4,9,15,23,31,40,53],       twentyBone: [0,3,4,6,13,20,23,24,26] },
  PROX5:     { rusOrCarpal: [0,4,5,9,15,21,30,39,51],       twentyBone: [0,3,3,6,13,19,22,23,25] },
  MID3:      { rusOrCarpal: [0,4,6,9,15,22,32,43,52],       twentyBone: [0,3,4,7,13,19,22,23,25] },
  MID5:      { rusOrCarpal: [0,6,7,9,15,23,32,42,49],       twentyBone: [0,4,4,8,14,19,21,22,23] },
  DIST1:     { rusOrCarpal: [0,5,6,11,17,26,38,46,66],      twentyBone: [0,4,4,7,14,23,30,31,33] },
  DIST3:     { rusOrCarpal: [0,4,6,8,13,18,28,34,49],       twentyBone: [0,3,4,6,10,16,21,22,24] },
  DIST5:     { rusOrCarpal: [0,5,6,9,13,18,27,34,48],       twentyBone: [0,3,4,7,11,16,20,21,23] },
  CAPITATE:  { rusOrCarpal: [0,100,104,106,113,133,160,214,0], twentyBone: [0,60,62,65,71,79,89,116,0] },
  HAMATE:    { rusOrCarpal: [0,73,75,79,100,128,159,181,194],  twentyBone: [0,42,44,49,59,70,81,92,106] },
  TRIQUET:   { rusOrCarpal: [0,10,13,28,57,84,102,124,0],    twentyBone: [0,7,10,17,28,38,45,62,0] },
  LUNATE:    { rusOrCarpal: [0,14,22,39,58,84,101,120,120],  twentyBone: [0,10,13,20,27,36,44,60,60] },
  SCAPHOID:  { rusOrCarpal: [0,26,36,52,71,85,100,116,116],  twentyBone: [0,14,18,23,30,35,42,58,58] },
  TRAPEZIUM: { rusOrCarpal: [0,23,31,46,66,83,95,108,117],   twentyBone: [0,12,15,21,28,34,39,47,59] },
  TRAPEZOID: { rusOrCarpal: [0,27,32,42,51,77,93,115,115],   twentyBone: [0,14,16,20,23,32,39,56,56] },
};

export const GIRL_SCORES: BoneScoreTable = {
  RADIUS:    { rusOrCarpal: [0,23,30,44,56,78,114,160,218],  twentyBone: [0,17,19,25,33,54,85,99,106] },
  ULNA:      { rusOrCarpal: [0,30,33,37,45,74,118,173,0],    twentyBone: [0,22,26,30,39,60,73,80,0] },
  META1:     { rusOrCarpal: [0,8,12,18,24,31,43,53,67],      twentyBone: [0,5,6,11,18,24,29,31,33] },
  META3:     { rusOrCarpal: [0,5,8,12,16,23,37,47,53],       twentyBone: [0,3,5,7,11,17,23,24,26] },
  META5:     { rusOrCarpal: [0,6,9,12,17,23,35,48,52],       twentyBone: [0,3,4,7,12,18,22,24,25] },
  PROX1:     { rusOrCarpal: [0,9,11,14,20,31,44,56,67],      twentyBone: [0,5,5,8,14,24,29,30,32] },
  PROX3:     { rusOrCarpal: [0,5,7,12,19,27,37,44,54],       twentyBone: [0,4,4,7,13,20,24,25,26] },
  PROX5:     { rusOrCarpal: [0,6,7,12,18,26,35,42,51],       twentyBone: [0,4,4,7,13,19,23,24,25] },
  MID3:      { rusOrCarpal: [0,6,8,12,18,27,36,45,52],       twentyBone: [0,4,4,7,13,20,23,24,25] },
  MID5:      { rusOrCarpal: [0,7,8,12,18,28,35,43,49],       twentyBone: [0,4,5,8,14,20,22,22,23] },
  DIST1:     { rusOrCarpal: [0,7,9,15,22,33,48,51,68],       twentyBone: [0,5,5,8,15,24,31,32,34] },
  DIST3:     { rusOrCarpal: [0,7,8,11,15,22,33,37,49],       twentyBone: [0,3,4,6,10,17,22,23,24] },
  DIST5:     { rusOrCarpal: [0,7,8,11,15,22,32,36,47],       twentyBone: [0,3,4,7,11,17,21,22,23] },
  CAPITATE:  { rusOrCarpal: [0,84,88,91,99,121,149,203,0],   twentyBone: [0,53,56,61,67,76,85,113,0] },
  HAMATE:    { rusOrCarpal: [0,72,74,78,102,131,161,183,194], twentyBone: [0,44,47,53,64,74,85,97,109] },
  TRIQUET:   { rusOrCarpal: [0,11,16,31,55,80,104,126,0],    twentyBone: [0,8,12,19,28,36,46,63,0] },
  LUNATE:    { rusOrCarpal: [0,16,24,40,59,84,106,122,0],    twentyBone: [0,10,14,20,27,35,46,60,0] },
  SCAPHOID:  { rusOrCarpal: [0,24,35,51,71,88,104,118,0],    twentyBone: [0,13,17,23,29,36,44,57,0] },
  TRAPEZIUM: { rusOrCarpal: [0,20,27,42,60,80,95,111,119],   twentyBone: [0,12,14,20,25,32,39,49,59] },
  TRAPEZOID: { rusOrCarpal: [0,21,30,43,53,77,97,118,0],     twentyBone: [0,13,16,20,24,31,40,57,0] },
};

// ─── Age lookup tables ─────────────────────────────────────────────────────────
// startAge: age in years for first threshold
// thresholds: score values; each array index step = 0.1 years; 0 = end (ADULT)
// Usage: if score < thresholds[0] → "<= startAge"; iterate until threshold >= score

export const BOY_AGE_TABLES = {
  RUS: {
    startAge: 3.2,
    thresholds: [
      124,126,130,133,136,139,142,145,147,
      150,152,155,157,159,161,163,165,167,169,
      171,173,175,177,178,180,182,184,186,188,
      191,193,195,197,200,202,205,207,210,212,
      215,217,220,222,225,228,230,233,235,238,
      240,243,245,248,250,252,255,257,259,262,
      264,266,268,271,273,275,277,280,282,284,
      286,289,291,293,296,298,301,304,307,311,
      314,318,323,327,333,338,344,351,358,365,
      374,382,392,402,412,424,435,448,461,474,
      488,503,518,533,549,566,583,600,618,637,
      655,675,694,714,734,755,775,795,815,835,
      854,872,891,908,925,941,956,970,982,994,
      1000, 0,
    ],
  },
  Carpal: {
    startAge: 3.2,
    thresholds: [
      195,200,208,216,222,228,232,237,240,
      244,246,249,251,253,254,256,257,259,260,
      262,264,266,268,271,274,278,282,287,293,
      299,306,314,323,332,341,351,361,372,383,
      394,405,416,427,438,449,460,470,480,490,
      499,508,517,525,533,541,549,557,564,572,
      580,587,595,603,611,619,627,636,645,654,
      663,673,684,694,705,716,727,739,750,762,
      774,785,797,809,820,831,843,854,864,874,
      884,894,903,912,921,929,936,944,951,957,
      963,969,974,979,984,988,992,995,998,1000,
      0,
    ],
  },
  TwentyBone: {
    startAge: 3.2,
    thresholds: [
      210,214,221,226,232,237,241,246,250,
      254,257,261,264,267,271,274,277,280,283,
      286,289,293,296,300,304,308,313,317,323,
      328,334,340,346,353,360,367,374,381,389,
      396,403,411,418,425,432,439,445,451,457,
      463,469,474,479,484,489,494,499,504,508,
      513,518,523,528,533,539,545,551,557,563,
      570,577,585,593,601,610,618,627,637,646,
      656,666,676,686,696,707,717,728,739,749,
      760,771,782,793,803,814,824,835,845,855,
      865,874,884,893,901,910,918,925,932,939,
      945,951,956,961,966,969,973,976,979,982,
      984,986,987,989,990,991,992,993,994,995,
      996,997,998,999,1000, 0,
    ],
  },
};

export const GIRL_AGE_TABLES = {
  RUS: {
    startAge: 3.3,
    thresholds: [
      218,220,221,222,223,224,225,225,226,
      227,228,229,230,232,233,235,237,239,241,
      244,247,250,253,257,261,264,268,273,277,
      281,285,290,294,298,303,307,311,315,319,
      322,326,330,333,337,340,343,347,350,354,
      358,362,366,370,374,379,384,389,394,400,
      406,412,419,426,433,441,448,456,465,473,
      482,491,500,510,520,530,540,551,562,573,
      584,596,607,619,631,644,656,669,682,695,
      708,721,734,748,761,774,788,801,815,828,
      842,855,868,881,894,907,919,930,942,952,
      963,972,981,989,997,1000, 0,
    ],
  },
  Carpal: {
    startAge: 3.6,
    thresholds: [
      244,246,249,252,257,264,271,278,287,
      297,307,317,329,340,353,365,378,391,404,
      417,430,443,455,468,480,492,504,515,526,
      536,547,557,566,576,586,595,604,613,623,
      632,641,650,659,668,678,687,697,707,717,
      727,737,747,757,767,777,787,797,807,817,
      827,837,846,855,864,873,881,889,897,905,
      912,919,926,932,939,944,950,955,960,965,
      969,973,977,980,983,986,988,990,992,993,
      995,996,997,998,1000, 0,
    ],
  },
  TwentyBone: {
    startAge: 3.6,
    thresholds: [
      299,300,301,304,307,311,316,321,327,
      333,340,347,354,362,370,378,386,394,402,
      410,418,426,434,442,450,458,466,474,481,
      489,496,503,511,518,524,531,537,543,550,
      556,562,568,574,580,586,592,598,605,612,
      619,626,634,642,650,659,668,678,688,698,
      708,719,729,740,751,761,772,783,794,804,
      815,825,835,844,854,863,871,879,887,894,
      901,907,913,918,923,928,933,937,941,945,
      948,951,954,957,960,963,965,968,970,973,
      975,977,979,981,983,985,987,988,990,992,
      993,994,996,997,998,999,1000, 0,
    ],
  },
};

// ─── Calculation helpers ───────────────────────────────────────────────────────

export type StageSelections = Partial<Record<string, number>>; // boneKey → stage index (0=A)

export interface ScoreResult {
  rusScore: number;
  carpalScore: number;
  twentyBoneScore: number;
}

export interface AgeResult {
  rusAge: string;
  carpalAge: string;
  twentyBoneAge: string;
}

function scoreToAge(table: AgeTable, score: number): string {
  const { startAge, thresholds } = table;
  let age = startAge;
  if (thresholds[0] > score) return `≦${age.toFixed(1)}`;
  for (let i = 0; thresholds[i] !== 0; i++) {
    if (thresholds[i] >= score) return (Math.round(age * 10) / 10).toFixed(1);
    age += 0.1;
  }
  return "ADULT";
}

export function calcScores(sex: Sex, selections: StageSelections): ScoreResult {
  const scores = sex === "boy" ? BOY_SCORES : GIRL_SCORES;

  let rusScore = 0;
  let carpalScore = 0;
  let twentyBoneScore = 0;

  for (const key of RUS_BONE_KEYS) {
    const idx = selections[key] ?? 0;
    const bone = scores[key];
    rusScore += bone.rusOrCarpal[idx] ?? 0;
    twentyBoneScore += bone.twentyBone[idx] ?? 0;
  }

  for (const key of CARPAL_BONE_KEYS) {
    const idx = selections[key] ?? 0;
    const bone = scores[key];
    carpalScore += bone.rusOrCarpal[idx] ?? 0;
    twentyBoneScore += bone.twentyBone[idx] ?? 0;
  }

  return { rusScore, carpalScore, twentyBoneScore };
}

export function calcAges(sex: Sex, scores: ScoreResult): AgeResult {
  const tables = sex === "boy" ? BOY_AGE_TABLES : GIRL_AGE_TABLES;
  return {
    rusAge: scoreToAge(tables.RUS, scores.rusScore),
    carpalAge: scoreToAge(tables.Carpal, scores.carpalScore),
    twentyBoneAge: scoreToAge(tables.TwentyBone, scores.twentyBoneScore),
  };
}

export function stageImagePath(bone: BoneDefinition, stage: Stage): string {
  const base = bone.image.replace(".gif", "");
  return `${base}_${stage.toLowerCase()}.gif`;
}
