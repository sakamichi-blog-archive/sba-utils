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
    birthdate: "1995-11-10",
    generation: generation1,
    graduatedAt: "2020-03-31T03:00:00",
    name: "井口眞緒",
    nameSpaced: "井口 眞緒",
    uid: "1"
  },
  {
    birthdate: "1997-12-26",
    generation: generation1,
    graduatedAt: "2024-01-31T03:00:00",
    name: "潮紗理菜",
    nameSpaced: "潮 紗理菜",
    uid: "2"
  },
  {
    birthdate: "2001-12-02",
    generation: generation1,
    graduatedAt: "2019-08-31T03:00:00",
    name: "柿崎芽実",
    nameSpaced: "柿崎 芽実",
    uid: "3"
  },
  {
    birthdate: "2001-05-08",
    generation: generation1,
    graduatedAt: "2023-08-31T03:00:00",
    name: "影山優佳",
    nameSpaced: "影山 優佳",
    uid: "4"
  },
  {
    birthdate: "1998-02-02",
    generation: generation1,
    graduatedAt: "2025-01-31T03:00:00",
    name: "加藤史帆",
    nameSpaced: "加藤 史帆",
    uid: "5"
  },
  {
    birthdate: "1997-09-05",
    generation: generation1,
    graduatedAt: "2024-04-30T03:00:00",
    name: "齊藤京子",
    nameSpaced: "齊藤 京子",
    uid: "6"
  },
  {
    birthdate: "1996-01-22",
    generation: generation1,
    graduatedAt: "2025-05-31T03:00:00",
    name: "佐々木久美",
    nameSpaced: "佐々木 久美",
    uid: "7"
  },
  {
    birthdate: "1999-12-17",
    generation: generation1,
    graduatedAt: "2025-05-31T03:00:00",
    name: "佐々木美玲",
    nameSpaced: "佐々木 美玲",
    uid: "8"
  },
  {
    birthdate: "1998-09-20",
    generation: generation1,
    graduatedAt: "2025-05-31T03:00:00",
    name: "高瀬愛奈",
    nameSpaced: "高瀬 愛奈",
    uid: "9"
  },
  {
    birthdate: "1998-11-02",
    generation: generation1,
    graduatedAt: "2024-08-31T03:00:00",
    name: "高本彩花",
    nameSpaced: "高本 彩花",
    uid: "10"
  },
  {
    birthdate: "1998-08-23",
    generation: generation1,
    graduatedAt: "2025-02-28T03:00:00",
    name: "東村芽依",
    nameSpaced: "東村 芽依",
    uid: "11"
  },

  // 2nd generation
  {
    birthdate: "2002-09-10",
    generation: generation2,
    name: "金村美玖",
    nameSpaced: "金村 美玖",
    uid: "12"
  },
  {
    birthdate: "2001-07-23",
    generation: generation2,
    graduatedAt: "2026-01-31T03:00:00",
    name: "河田陽菜",
    nameSpaced: "河田 陽菜",
    uid: "13"
  },
  {
    birthdate: "2002-09-07",
    generation: generation2,
    name: "小坂菜緒",
    nameSpaced: "小坂 菜緒",
    uid: "14"
  },
  {
    birthdate: "2001-01-18",
    generation: generation2,
    graduatedAt: "2025-09-30T03:00:00",
    name: "富田鈴花",
    nameSpaced: "富田 鈴花",
    uid: "15"
  },
  {
    birthdate: "2001-02-15",
    generation: generation2,
    graduatedAt: "2025-02-28T03:00:00",
    name: "丹生明里",
    nameSpaced: "丹生 明里",
    uid: "16"
  },
  {
    birthdate: "2002-09-28",
    generation: generation2,
    graduatedAt: "2025-01-31T03:00:00",
    name: "濱岸ひより",
    nameSpaced: "濱岸 ひより",
    uid: "17"
  },
  {
    birthdate: "1999-04-27",
    generation: generation2,
    name: "松田好花",
    nameSpaced: "松田 好花",
    uid: "18"
  },
  {
    birthdate: "1998-04-28",
    generation: generation2,
    graduatedAt: "2023-01-31T03:00:00",
    name: "宮田愛萌",
    nameSpaced: "宮田 愛萌",
    uid: "19"
  },
  {
    birthdate: "2000-02-24",
    generation: generation2,
    graduatedAt: "2022-08-31T03:00:00",
    name: "渡邉美穂",
    nameSpaced: "渡邉 美穂",
    uid: "20"
  },

  // 3rd generation
  {
    birthdate: "2004-04-12",
    generation: generation3,
    name: "上村ひなの",
    nameSpaced: "上村 ひなの",
    uid: "21"
  },
  {
    birthdate: "2003-09-27",
    generation: generation3,
    name: "髙橋未来虹",
    nameSpaced: "髙橋 未来虹",
    uid: "22"
  },
  {
    birthdate: "2004-02-23",
    generation: generation3,
    name: "森本茉莉",
    nameSpaced: "森本 茉莉",
    uid: "23"
  },
  {
    birthdate: "2004-02-23",
    generation: generation3,
    name: "山口陽世",
    nameSpaced: "山口 陽世",
    uid: "24"
  },

  // 4th generation
  {
    birthdate: "2004-08-06",
    generation: generation4,
    name: "石塚瑶季",
    nameSpaced: "石塚 瑶季",
    uid: "25"
  },
  {
    birthdate: "2004-08-15",
    generation: generation4,
    graduatedAt: "2024-02-29T03:00:00",
    name: "岸帆夏",
    nameSpaced: "岸 帆夏",
    uid: "26"
  },
  {
    birthdate: "2004-10-03",
    generation: generation4,
    name: "小西夏菜実",
    nameSpaced: "小西 夏菜実",
    uid: "27"
  },
  {
    birthdate: "2005-01-15",
    generation: generation4,
    name: "清水理央",
    nameSpaced: "清水 理央",
    uid: "28"
  },
  {
    birthdate: "2007-02-14",
    generation: generation4,
    name: "正源司陽子",
    nameSpaced: "正源司 陽子",
    uid: "29"
  },
  {
    birthdate: "2006-02-20",
    generation: generation4,
    name: "竹内希来里",
    nameSpaced: "竹内 希来里",
    uid: "30"
  },
  {
    birthdate: "2003-07-31",
    generation: generation4,
    name: "平尾帆夏",
    nameSpaced: "平尾 帆夏",
    uid: "31"
  },
  {
    birthdate: "2002-04-09",
    generation: generation4,
    name: "平岡海月",
    nameSpaced: "平岡 海月",
    uid: "32"
  },
  {
    birthdate: "2006-08-07",
    generation: generation4,
    name: "藤嶌果歩",
    nameSpaced: "藤嶌 果歩",
    uid: "33"
  },
  {
    birthdate: "2005-12-31",
    generation: generation4,
    name: "宮地すみれ",
    nameSpaced: "宮地 すみれ",
    uid: "34"
  },
  {
    birthdate: "2003-05-20",
    generation: generation4,
    name: "山下葉留花",
    nameSpaced: "山下 葉留花",
    uid: "35"
  },
  {
    birthdate: "2009-02-07",
    generation: generation4,
    name: "渡辺莉奈",
    nameSpaced: "渡辺 莉奈",
    uid: "36"
  },

  // 5th generation
  {
    birthdate: "2006-12-07",
    generation: generation5,
    name: "大田美月",
    nameSpaced: "大田 美月",
    uid: "37"
  },
  {
    birthdate: "2007-05-05",
    generation: generation5,
    name: "大野愛実",
    nameSpaced: "大野 愛実",
    uid: "38"
  },
  {
    birthdate: "2006-12-26",
    generation: generation5,
    name: "片山紗希",
    nameSpaced: "片山 紗希",
    uid: "39"
  },
  {
    birthdate: "2006-01-23",
    generation: generation5,
    name: "蔵盛妃那乃",
    nameSpaced: "蔵盛 妃那乃",
    uid: "40"
  },
  {
    birthdate: "2009-03-14",
    generation: generation5,
    name: "坂井新奈",
    nameSpaced: "坂井 新奈",
    uid: "41"
  },
  {
    birthdate: "2006-09-10",
    generation: generation5,
    name: "佐藤優羽",
    nameSpaced: "佐藤 優羽",
    uid: "42"
  },
  {
    birthdate: "2006-12-26",
    generation: generation5,
    name: "下田衣珠季",
    nameSpaced: "下田 衣珠季",
    uid: "43"
  },
  {
    birthdate: "2007-08-01",
    generation: generation5,
    name: "高井俐香",
    nameSpaced: "高井 俐香",
    uid: "44"
  },
  {
    birthdate: "2004-03-27",
    generation: generation5,
    name: "鶴崎仁香",
    nameSpaced: "鶴崎 仁香",
    uid: "45"
  },
  {
    birthdate: "2005-06-08",
    generation: generation5,
    name: "松尾桜",
    nameSpaced: "松尾 桜",
    uid: "46"
  }
]
