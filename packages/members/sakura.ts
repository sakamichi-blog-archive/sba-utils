import type { Generation, Member } from "./common.js"

const generation1: Generation = { key: "sakura-1", seq: 1, name: "1期生" }
const generation2: Generation = { key: "sakura-2", seq: 2, name: "2期生" }
const generation3: Generation = { key: "sakura-3", seq: 3, name: "3期生" }
const generation4: Generation = { key: "sakura-4", seq: 4, name: "4期生" }

export const generations: Generation[] = [generation1, generation2, generation3, generation4]

export const members: Member[] = [
  // 1st generation
  {
    uid: "03",
    name: "上村莉菜",
    nameSpaced: "上村 莉菜",
    generation: generation1,
    birthdate: "1997-01-05",
    graduatedAt: "2025-02-28T03:00:00"
  },
  {
    uid: "04",
    name: "尾関梨香",
    nameSpaced: "尾関 梨香",
    generation: generation1,
    birthdate: "1997-10-08",
    graduatedAt: "2022-10-31T03:00:00"
  },
  {
    uid: "06",
    name: "小池美波",
    nameSpaced: "小池 美波",
    generation: generation1,
    birthdate: "1998-11-15",
    graduatedAt: "2025-05-31T03:00:00"
  },
  {
    uid: "07",
    name: "小林由依",
    nameSpaced: "小林 由依",
    generation: generation1,
    birthdate: "1999-10-24",
    graduatedAt: "2024-02-29T03:00:00"
  },
  {
    uid: "08",
    name: "齋藤冬優花",
    nameSpaced: "齋藤 冬優花",
    generation: generation1,
    birthdate: "1998-02-16",
    graduatedAt: "2025-02-14T03:00:00"
  },
  {
    uid: "11",
    name: "菅井友香",
    nameSpaced: "菅井 友香",
    generation: generation1,
    birthdate: "1995-11-30",
    graduatedAt: "2022-12-31T03:00:00"
  },
  {
    uid: "14",
    name: "土生瑞穂",
    nameSpaced: "土生 瑞穂",
    generation: generation1,
    birthdate: "1997-07-08",
    graduatedAt: "2023-12-31T03:00:00"
  },
  {
    uid: "15",
    name: "原田葵",
    nameSpaced: "原田 葵",
    generation: generation1,
    birthdate: "2000-05-08",
    graduatedAt: "2022-08-31T03:00:00"
  },
  {
    uid: "18",
    name: "守屋茜",
    nameSpaced: "守屋 茜",
    generation: generation1,
    birthdate: "1997-11-13",
    graduatedAt: "2021-12-31T03:00:00"
  },
  {
    uid: "20",
    name: "渡辺梨加",
    nameSpaced: "渡辺 梨加",
    generation: generation1,
    birthdate: "1995-05-16",
    graduatedAt: "2021-12-31T03:00:00"
  },
  {
    uid: "21",
    name: "渡邉理佐",
    nameSpaced: "渡邉 理佐",
    generation: generation1,
    birthdate: "1998-07-28",
    graduatedAt: "2022-06-30T14:59:00"
  },

  // 2nd generation
  {
    uid: "43",
    name: "井上梨名",
    nameSpaced: "井上 梨名",
    generation: generation2,
    birthdate: "2001-01-29",
    graduatedAt: "2026-02-28T03:00:00"
  },
  {
    uid: "53",
    name: "遠藤光莉",
    nameSpaced: "遠藤 光莉",
    generation: generation2,
    birthdate: "1999-04-17"
  },
  {
    uid: "54",
    name: "大園玲",
    nameSpaced: "大園 玲",
    generation: generation2,
    birthdate: "2000-04-18"
  },
  {
    uid: "55",
    name: "大沼晶保",
    nameSpaced: "大沼 晶保",
    generation: generation2,
    birthdate: "1999-10-12"
  },
  {
    uid: "56",
    name: "幸阪茉里乃",
    nameSpaced: "幸阪 茉里乃",
    generation: generation2,
    birthdate: "2002-12-19"
  },
  {
    uid: "44",
    name: "関有美子",
    nameSpaced: "関 有美子",
    generation: generation2,
    birthdate: "1998-06-29",
    graduatedAt: "2023-05-31T14:59:00"
  },
  {
    uid: "45",
    name: "武元唯衣",
    nameSpaced: "武元 唯衣",
    generation: generation2,
    birthdate: "2002-03-23"
  },
  {
    uid: "46",
    name: "田村保乃",
    nameSpaced: "田村 保乃",
    generation: generation2,
    birthdate: "1998-10-21"
  },
  {
    uid: "47",
    name: "藤吉夏鈴",
    nameSpaced: "藤吉 夏鈴",
    generation: generation2,
    birthdate: "2001-08-29"
  },
  {
    uid: "57",
    name: "増本綺良",
    nameSpaced: "増本 綺良",
    generation: generation2,
    birthdate: "2002-01-12"
  },
  {
    uid: "48",
    name: "松田里奈",
    nameSpaced: "松田 里奈",
    generation: generation2,
    birthdate: "1999-10-13"
  },
  {
    uid: "49",
    name: "松平璃子",
    nameSpaced: "松平 璃子",
    generation: generation2,
    birthdate: "1998-05-05",
    graduatedAt: "2021-04-30T14:59:00"
  },
  {
    uid: "50",
    name: "森田ひかる",
    nameSpaced: "森田 ひかる",
    generation: generation2,
    birthdate: "2001-07-10"
  },
  {
    uid: "58",
    name: "守屋麗奈",
    nameSpaced: "守屋 麗奈",
    generation: generation2,
    birthdate: "2000-01-02"
  },
  {
    uid: "51",
    name: "山﨑天",
    nameSpaced: "山﨑 天",
    generation: generation2,
    birthdate: "2005-09-28"
  },

  // 3rd generation
  {
    uid: "59",
    name: "石森璃花",
    nameSpaced: "石森 璃花",
    generation: generation3,
    birthdate: "2002-01-13"
  },
  {
    uid: "60",
    name: "遠藤理子",
    nameSpaced: "遠藤 理子",
    generation: generation3,
    birthdate: "2006-01-09"
  },
  {
    uid: "61",
    name: "小田倉麗奈",
    nameSpaced: "小田倉 麗奈",
    generation: generation3,
    birthdate: "2004-07-25"
  },
  {
    uid: "62",
    name: "小島凪紗",
    nameSpaced: "小島 凪紗",
    generation: generation3,
    birthdate: "2005-07-07"
  },
  {
    uid: "63",
    name: "谷口愛季",
    nameSpaced: "谷口 愛季",
    generation: generation3,
    birthdate: "2005-04-12"
  },
  {
    uid: "64",
    name: "中嶋優月",
    nameSpaced: "中嶋 優月",
    generation: generation3,
    birthdate: "2003-02-17"
  },
  {
    uid: "65",
    name: "的野美青",
    nameSpaced: "的野 美青",
    generation: generation3,
    birthdate: "2006-11-08"
  },
  {
    uid: "66",
    name: "向井純葉",
    nameSpaced: "向井 純葉",
    generation: generation3,
    birthdate: "2006-05-09"
  },
  {
    uid: "67",
    name: "村井優",
    nameSpaced: "村井 優",
    generation: generation3,
    birthdate: "2004-08-18"
  },
  {
    uid: "68",
    name: "村山美羽",
    nameSpaced: "村山 美羽",
    generation: generation3,
    birthdate: "2005-02-15"
  },
  {
    uid: "69",
    name: "山下瞳月",
    nameSpaced: "山下 瞳月",
    generation: generation3,
    birthdate: "2005-01-22"
  },

  // 4th generation
  {
    uid: "70",
    name: "浅井恋乃未",
    nameSpaced: "浅井 恋乃未",
    generation: generation4,
    birthdate: "2004-12-22"
  },
  {
    uid: "71",
    name: "稲熊ひな",
    nameSpaced: "稲熊 ひな",
    generation: generation4,
    birthdate: "2006-03-09"
  },
  {
    uid: "72",
    name: "勝又春",
    nameSpaced: "勝又 春",
    generation: generation4,
    birthdate: "2004-01-24"
  },
  {
    uid: "73",
    name: "佐藤愛桜",
    nameSpaced: "佐藤 愛桜",
    generation: generation4,
    birthdate: "2006-12-01"
  },
  {
    uid: "74",
    name: "中川智尋",
    nameSpaced: "中川 智尋",
    generation: generation4,
    birthdate: "2007-09-16"
  },
  {
    uid: "75",
    name: "松本和子",
    nameSpaced: "松本 和子",
    generation: generation4,
    birthdate: "2005-02-06"
  },
  {
    uid: "76",
    name: "目黒陽色",
    nameSpaced: "目黒 陽色",
    generation: generation4,
    birthdate: "2006-01-24"
  },
  {
    uid: "77",
    name: "山川宇衣",
    nameSpaced: "山川 宇衣",
    generation: generation4,
    birthdate: "2005-09-19"
  },
  {
    uid: "78",
    name: "山田桃実",
    nameSpaced: "山田 桃実",
    generation: generation4,
    birthdate: "2008-07-20"
  }
]
