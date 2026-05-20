import type { Generation, Member } from "./common.js"

const generation1: Generation = { key: "keyaki-1", name: "1期生", seq: 1 }
const hiraganaGeneration1: Generation = { key: "hiragana-1", name: "けやき坂46 1期生", seq: 2 }
const hiraganaGeneration2: Generation = { key: "hiragana-2", name: "けやき坂46 2期生", seq: 3 }
const generation2: Generation = { key: "keyaki-2", name: "2期生", seq: 4 }
const hiraganaGeneration3: Generation = { key: "hiragana-3", name: "けやき坂46 3期生", seq: 5 }

export const generations: Generation[] = [
  generation1,
  hiraganaGeneration1,
  hiraganaGeneration2,
  generation2,
  hiraganaGeneration3
]

export const members: Member[] = [
  // 1st generation
  {
    birthdate: "1997-05-07",
    generation: generation1,
    graduatedAt: "2020-10-13T14:59:00Z",
    name: "石森虹花",
    nameSpaced: "石森 虹花",
    uid: "01"
  },
  {
    birthdate: "1998-09-30",
    generation: generation1,
    graduatedAt: "2018-12-31T03:00:00Z",
    name: "今泉佑唯",
    nameSpaced: "今泉 佑唯",
    uid: "02"
  },
  {
    birthdate: "1997-01-04",
    generation: generation1,
    name: "上村莉菜",
    nameSpaced: "上村 莉菜",
    uid: "03"
  },
  {
    birthdate: "1997-10-07",
    generation: generation1,
    name: "尾関梨香",
    nameSpaced: "尾関 梨香",
    uid: "04"
  },
  {
    birthdate: "1998-06-04",
    generation: generation1,
    graduatedAt: "2020-03-31T03:00:00Z",
    name: "織田奈那",
    nameSpaced: "織田 奈那",
    uid: "05"
  },
  {
    birthdate: "1998-11-14",
    generation: generation1,
    name: "小池美波",
    nameSpaced: "小池 美波",
    uid: "06"
  },
  {
    birthdate: "1999-10-23",
    generation: generation1,
    name: "小林由依",
    nameSpaced: "小林 由依",
    uid: "07"
  },
  {
    birthdate: "1998-02-15",
    generation: generation1,
    name: "齋藤冬優花",
    nameSpaced: "齋藤 冬優花",
    uid: "08"
  },
  {
    birthdate: "1996-11-16",
    generation: generation1,
    graduatedAt: "2020-10-31T14:59:00Z",
    name: "佐藤詩織",
    nameSpaced: "佐藤 詩織",
    uid: "09"
  },
  {
    birthdate: "1998-11-23",
    generation: generation1,
    graduatedAt: "2018-12-31T03:00:00Z",
    name: "志田愛佳",
    nameSpaced: "志田 愛佳",
    uid: "10"
  },
  {
    birthdate: "1995-11-29",
    generation: generation1,
    name: "菅井友香",
    nameSpaced: "菅井 友香",
    uid: "11"
  },
  {
    birthdate: "1997-12-05",
    generation: generation1,
    graduatedAt: "2020-03-31T03:00:00Z",
    name: "鈴本美愉",
    nameSpaced: "鈴本 美愉",
    uid: "12"
  },
  {
    birthdate: "1997-04-23",
    generation: generation1,
    graduatedAt: "2020-05-31T03:00:00Z",
    name: "長沢菜々香",
    nameSpaced: "長沢 菜々香",
    uid: "13"
  },
  {
    birthdate: "1997-07-07",
    generation: generation1,
    name: "土生瑞穂",
    nameSpaced: "土生 瑞穂",
    uid: "14"
  },
  {
    birthdate: "2000-05-07",
    generation: generation1,
    name: "原田葵",
    nameSpaced: "原田 葵",
    uid: "15"
  },
  {
    birthdate: "2001-06-25",
    generation: generation1,
    graduatedAt: "2020-03-31T03:00:00Z",
    name: "平手友梨奈",
    nameSpaced: "平手 友梨奈",
    uid: "17"
  },
  {
    birthdate: "1997-11-12",
    generation: generation1,
    name: "守屋茜",
    nameSpaced: "守屋 茜",
    uid: "18"
  },
  {
    birthdate: "2002-02-24",
    generation: generation1,
    graduatedAt: "2018-12-31T03:00:00Z",
    name: "米谷奈々未",
    nameSpaced: "米谷 奈々未",
    uid: "19"
  },
  {
    birthdate: "1995-05-16",
    generation: generation1,
    name: "渡辺梨加",
    nameSpaced: "渡辺 梨加",
    uid: "20"
  },
  {
    birthdate: "1998-07-27",
    generation: generation1,
    name: "渡邉理佐",
    nameSpaced: "渡邉 理佐",
    uid: "21"
  },
  {
    birthdate: "1998-09-04",
    generation: generation1,
    graduatedAt: "2019-08-31T03:00:00Z",
    name: "長濱ねる",
    nameSpaced: "長濱 ねる",
    uid: "22"
  },

  // Hiragana 1st generation
  {
    birthdate: "1995-11-10",
    generation: hiraganaGeneration1,
    name: "井口眞緒",
    nameSpaced: "井口 眞緒",
    uid: "23"
  },
  {
    birthdate: "1997-12-26",
    generation: hiraganaGeneration1,
    name: "潮紗理菜",
    nameSpaced: "潮 紗理菜",
    uid: "24"
  },
  {
    birthdate: "2001-12-02",
    generation: hiraganaGeneration1,
    name: "柿崎芽実",
    nameSpaced: "柿崎 芽実",
    uid: "25"
  },
  {
    birthdate: "2001-05-08",
    generation: hiraganaGeneration1,
    name: "影山優佳",
    nameSpaced: "影山 優佳",
    uid: "26"
  },
  {
    birthdate: "1998-02-02",
    generation: hiraganaGeneration1,
    name: "加藤史帆",
    nameSpaced: "加藤 史帆",
    uid: "27"
  },
  {
    birthdate: "1997-09-05",
    generation: hiraganaGeneration1,
    name: "齊藤京子",
    nameSpaced: "齊藤 京子",
    uid: "28"
  },
  {
    birthdate: "1996-01-22",
    generation: hiraganaGeneration1,
    name: "佐々木久美",
    nameSpaced: "佐々木 久美",
    uid: "29"
  },
  {
    birthdate: "1999-12-17",
    generation: hiraganaGeneration1,
    name: "佐々木美玲",
    nameSpaced: "佐々木 美玲",
    uid: "30"
  },
  {
    birthdate: "1998-09-20",
    generation: hiraganaGeneration1,
    name: "高瀬愛奈",
    nameSpaced: "高瀬 愛奈",
    uid: "31"
  },
  {
    birthdate: "1998-11-02",
    generation: hiraganaGeneration1,
    name: "高本彩花",
    nameSpaced: "高本 彩花",
    uid: "32"
  },
  {
    birthdate: "1998-08-23",
    generation: hiraganaGeneration1,
    name: "東村芽依",
    nameSpaced: "東村 芽依",
    uid: "33"
  },

  // Hiragana 2nd generation
  {
    birthdate: "2002-09-10",
    generation: hiraganaGeneration2,
    name: "金村美玖",
    nameSpaced: "金村 美玖",
    uid: "34"
  },
  {
    birthdate: "2001-07-23",
    generation: hiraganaGeneration2,
    name: "河田陽菜",
    nameSpaced: "河田 陽菜",
    uid: "35"
  },
  {
    birthdate: "2002-09-07",
    generation: hiraganaGeneration2,
    name: "小坂菜緒",
    nameSpaced: "小坂 菜緒",
    uid: "36"
  },
  {
    birthdate: "2001-01-18",
    generation: hiraganaGeneration2,
    name: "富田鈴花",
    nameSpaced: "富田 鈴花",
    uid: "37"
  },
  {
    birthdate: "2001-02-15",
    generation: hiraganaGeneration2,
    name: "丹生明里",
    nameSpaced: "丹生 明里",
    uid: "38"
  },
  {
    birthdate: "2002-09-28",
    generation: hiraganaGeneration2,
    name: "濱岸ひより",
    nameSpaced: "濱岸 ひより",
    uid: "39"
  },
  {
    birthdate: "1999-04-27",
    generation: hiraganaGeneration2,
    name: "松田好花",
    nameSpaced: "松田 好花",
    uid: "40"
  },
  {
    birthdate: "1998-04-28",
    generation: hiraganaGeneration2,
    name: "宮田愛萌",
    nameSpaced: "宮田 愛萌",
    uid: "41"
  },
  {
    birthdate: "2000-02-24",
    generation: hiraganaGeneration2,
    name: "渡邉美穂",
    nameSpaced: "渡邉 美穂",
    uid: "42"
  },

  // 2nd generation
  {
    birthdate: "2001-01-29",
    generation: generation2,
    name: "井上梨名",
    nameSpaced: "井上 梨名",
    uid: "43"
  },
  {
    birthdate: "1998-06-29",
    generation: generation2,
    name: "関有美子",
    nameSpaced: "関 有美子",
    uid: "44"
  },
  {
    birthdate: "2002-03-23",
    generation: generation2,
    name: "武元唯衣",
    nameSpaced: "武元 唯衣",
    uid: "45"
  },
  {
    birthdate: "1998-10-21",
    generation: generation2,
    name: "田村保乃",
    nameSpaced: "田村 保乃",
    uid: "46"
  },
  {
    birthdate: "2001-08-29",
    generation: generation2,
    name: "藤吉夏鈴",
    nameSpaced: "藤吉 夏鈴",
    uid: "47"
  },
  {
    birthdate: "1999-10-13",
    generation: generation2,
    name: "松田里奈",
    nameSpaced: "松田 里奈",
    uid: "48"
  },
  {
    birthdate: "1998-05-05",
    generation: generation2,
    name: "松平璃子",
    nameSpaced: "松平 璃子",
    uid: "49"
  },
  {
    birthdate: "2001-07-10",
    generation: generation2,
    name: "森田ひかる",
    nameSpaced: "森田 ひかる",
    uid: "50"
  },
  {
    birthdate: "2005-09-28",
    generation: generation2,
    name: "山﨑天",
    nameSpaced: "山﨑 天",
    uid: "51"
  },
  {
    birthdate: "1999-04-17",
    generation: generation2,
    name: "遠藤光莉",
    nameSpaced: "遠藤 光莉",
    uid: "53"
  },
  {
    birthdate: "2000-04-18",
    generation: generation2,
    name: "大園玲",
    nameSpaced: "大園 玲",
    uid: "54"
  },
  {
    birthdate: "1999-10-12",
    generation: generation2,
    name: "大沼晶保",
    nameSpaced: "大沼 晶保",
    uid: "55"
  },
  {
    birthdate: "2002-12-19",
    generation: generation2,
    name: "幸阪茉里乃",
    nameSpaced: "幸阪 茉里乃",
    uid: "56"
  },
  {
    birthdate: "2002-01-12",
    generation: generation2,
    name: "増本綺良",
    nameSpaced: "増本 綺良",
    uid: "57"
  },
  {
    birthdate: "2000-01-02",
    generation: generation2,
    name: "守屋麗奈",
    nameSpaced: "守屋 麗奈",
    uid: "58"
  },

  // Hiragana 3rd generation
  {
    birthdate: "2004-04-12",
    generation: hiraganaGeneration3,
    name: "上村ひなの",
    nameSpaced: "上村 ひなの",
    uid: "52"
  }
]
