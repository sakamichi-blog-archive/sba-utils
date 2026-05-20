import type { Generation, Member } from "./common"

const generation1: Generation = { key: "hinata-1", seq: 1, name: "1期生" }
const generation2: Generation = { key: "hinata-2", seq: 2, name: "2期生" }
const generation3: Generation = { key: "hinata-3", seq: 3, name: "3期生" }
const generation4: Generation = { key: "hinata-4", seq: 4, name: "4期生" }
const generation5: Generation = { key: "hinata-5", seq: 5, name: "5期生" }

export const generations: Generation[] = [
  generation1,
  generation2,
  generation3,
  generation4,
  generation5
]

export const members: Member[] = [
  // 1st generation
  {
    uid: "1",
    name: "井口眞緒",
    nameSpaced: "井口 眞緒",
    generation: generation1,
    birthdate: "1995-11-10",
    graduatedAt: "2020-03-31T03:00:00"
  },
  {
    uid: "2",
    name: "潮紗理菜",
    nameSpaced: "潮 紗理菜",
    generation: generation1,
    birthdate: "1997-12-26",
    graduatedAt: "2024-01-31T03:00:00"
  },
  {
    uid: "3",
    name: "柿崎芽実",
    nameSpaced: "柿崎 芽実",
    generation: generation1,
    birthdate: "2001-12-02",
    graduatedAt: "2019-08-31T03:00:00"
  },
  {
    uid: "4",
    name: "影山優佳",
    nameSpaced: "影山 優佳",
    generation: generation1,
    birthdate: "2001-05-08",
    graduatedAt: "2023-08-31T03:00:00"
  },
  {
    uid: "5",
    name: "加藤史帆",
    nameSpaced: "加藤 史帆",
    generation: generation1,
    birthdate: "1998-02-02",
    graduatedAt: "2025-01-31T03:00:00"
  },
  {
    uid: "6",
    name: "齊藤京子",
    nameSpaced: "齊藤 京子",
    generation: generation1,
    birthdate: "1997-09-05",
    graduatedAt: "2024-04-30T03:00:00"
  },
  {
    uid: "7",
    name: "佐々木久美",
    nameSpaced: "佐々木 久美",
    generation: generation1,
    birthdate: "1996-01-22",
    graduatedAt: "2025-05-31T03:00:00"
  },
  {
    uid: "8",
    name: "佐々木美玲",
    nameSpaced: "佐々木 美玲",
    generation: generation1,
    birthdate: "1999-12-17",
    graduatedAt: "2025-05-31T03:00:00"
  },
  {
    uid: "9",
    name: "高瀬愛奈",
    nameSpaced: "高瀬 愛奈",
    generation: generation1,
    birthdate: "1998-09-20",
    graduatedAt: "2025-05-31T03:00:00"
  },
  {
    uid: "10",
    name: "高本彩花",
    nameSpaced: "高本 彩花",
    generation: generation1,
    birthdate: "1998-11-02",
    graduatedAt: "2024-08-31T03:00:00"
  },
  {
    uid: "11",
    name: "東村芽依",
    nameSpaced: "東村 芽依",
    generation: generation1,
    birthdate: "1998-08-23",
    graduatedAt: "2025-02-28T03:00:00"
  },

  // 2nd generation
  {
    uid: "12",
    name: "金村美玖",
    nameSpaced: "金村 美玖",
    generation: generation2,
    birthdate: "2002-09-10"
  },
  {
    uid: "13",
    name: "河田陽菜",
    nameSpaced: "河田 陽菜",
    generation: generation2,
    birthdate: "2001-07-23",
    graduatedAt: "2026-01-31T03:00:00"
  },
  {
    uid: "14",
    name: "小坂菜緒",
    nameSpaced: "小坂 菜緒",
    generation: generation2,
    birthdate: "2002-09-07"
  },
  {
    uid: "15",
    name: "富田鈴花",
    nameSpaced: "富田 鈴花",
    generation: generation2,
    birthdate: "2001-01-18",
    graduatedAt: "2025-09-30T03:00:00"
  },
  {
    uid: "16",
    name: "丹生明里",
    nameSpaced: "丹生 明里",
    generation: generation2,
    birthdate: "2001-02-15",
    graduatedAt: "2025-02-28T03:00:00"
  },
  {
    uid: "17",
    name: "濱岸ひより",
    nameSpaced: "濱岸 ひより",
    generation: generation2,
    birthdate: "2002-09-28",
    graduatedAt: "2025-01-31T03:00:00"
  },
  {
    uid: "18",
    name: "松田好花",
    nameSpaced: "松田 好花",
    generation: generation2,
    birthdate: "1999-04-27"
  },
  {
    uid: "19",
    name: "宮田愛萌",
    nameSpaced: "宮田 愛萌",
    generation: generation2,
    birthdate: "1998-04-28",
    graduatedAt: "2023-01-31T03:00:00"
  },
  {
    uid: "20",
    name: "渡邉美穂",
    nameSpaced: "渡邉 美穂",
    generation: generation2,
    birthdate: "2000-02-24",
    graduatedAt: "2022-08-31T03:00:00"
  },

  // 3rd generation
  {
    uid: "21",
    name: "上村ひなの",
    nameSpaced: "上村 ひなの",
    generation: generation3,
    birthdate: "2004-04-12"
  },
  {
    uid: "22",
    name: "髙橋未来虹",
    nameSpaced: "髙橋 未来虹",
    generation: generation3,
    birthdate: "2003-09-27"
  },
  {
    uid: "23",
    name: "森本茉莉",
    nameSpaced: "森本 茉莉",
    generation: generation3,
    birthdate: "2004-02-23"
  },
  {
    uid: "24",
    name: "山口陽世",
    nameSpaced: "山口 陽世",
    generation: generation3,
    birthdate: "2004-02-23"
  },

  // 4th generation
  {
    uid: "25",
    name: "石塚瑶季",
    nameSpaced: "石塚 瑶季",
    generation: generation4,
    birthdate: "2004-08-06"
  },
  {
    uid: "26",
    name: "岸帆夏",
    nameSpaced: "岸 帆夏",
    generation: generation4,
    birthdate: "2004-08-15",
    graduatedAt: "2024-02-29T03:00:00"
  },
  {
    uid: "27",
    name: "小西夏菜実",
    nameSpaced: "小西 夏菜実",
    generation: generation4,
    birthdate: "2004-10-03"
  },
  {
    uid: "28",
    name: "清水理央",
    nameSpaced: "清水 理央",
    generation: generation4,
    birthdate: "2005-01-15"
  },
  {
    uid: "29",
    name: "正源司陽子",
    nameSpaced: "正源司 陽子",
    generation: generation4,
    birthdate: "2007-02-14"
  },
  {
    uid: "30",
    name: "竹内希来里",
    nameSpaced: "竹内 希来里",
    generation: generation4,
    birthdate: "2006-02-20"
  },
  {
    uid: "31",
    name: "平尾帆夏",
    nameSpaced: "平尾 帆夏",
    generation: generation4,
    birthdate: "2003-07-31"
  },
  {
    uid: "32",
    name: "平岡海月",
    nameSpaced: "平岡 海月",
    generation: generation4,
    birthdate: "2002-04-09"
  },
  {
    uid: "33",
    name: "藤嶌果歩",
    nameSpaced: "藤嶌 果歩",
    generation: generation4,
    birthdate: "2006-08-07"
  },
  {
    uid: "34",
    name: "宮地すみれ",
    nameSpaced: "宮地 すみれ",
    generation: generation4,
    birthdate: "2005-12-31"
  },
  {
    uid: "35",
    name: "山下葉留花",
    nameSpaced: "山下 葉留花",
    generation: generation4,
    birthdate: "2003-05-20"
  },
  {
    uid: "36",
    name: "渡辺莉奈",
    nameSpaced: "渡辺 莉奈",
    generation: generation4,
    birthdate: "2009-02-07"
  },

  // 5th generation
  {
    uid: "37",
    name: "大田美月",
    nameSpaced: "大田 美月",
    generation: generation5,
    birthdate: "2006-12-07"
  },
  {
    uid: "38",
    name: "大野愛実",
    nameSpaced: "大野 愛実",
    generation: generation5,
    birthdate: "2007-05-05"
  },
  {
    uid: "39",
    name: "片山紗希",
    nameSpaced: "片山 紗希",
    generation: generation5,
    birthdate: "2006-12-26"
  },
  {
    uid: "40",
    name: "蔵盛妃那乃",
    nameSpaced: "蔵盛 妃那乃",
    generation: generation5,
    birthdate: "2006-01-23"
  },
  {
    uid: "41",
    name: "坂井新奈",
    nameSpaced: "坂井 新奈",
    generation: generation5,
    birthdate: "2009-03-14"
  },
  {
    uid: "42",
    name: "佐藤優羽",
    nameSpaced: "佐藤 優羽",
    generation: generation5,
    birthdate: "2006-09-10"
  },
  {
    uid: "43",
    name: "下田衣珠季",
    nameSpaced: "下田 衣珠季",
    generation: generation5,
    birthdate: "2006-12-26"
  },
  {
    uid: "44",
    name: "高井俐香",
    nameSpaced: "高井 俐香",
    generation: generation5,
    birthdate: "2007-08-01"
  },
  {
    uid: "45",
    name: "鶴崎仁香",
    nameSpaced: "鶴崎 仁香",
    generation: generation5,
    birthdate: "2004-03-27"
  },
  {
    uid: "46",
    name: "松尾桜",
    nameSpaced: "松尾 桜",
    generation: generation5,
    birthdate: "2005-06-08"
  }
]
