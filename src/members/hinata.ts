import type { Generation, Member } from "./_types"

const generation1: Generation = { key: "hinata-1", seq: 1, name: "1期生" }
const generation2: Generation = { key: "hinata-2", seq: 2, name: "2期生" }
const generation3: Generation = { key: "hinata-3", seq: 3, name: "3期生" }
const generation4: Generation = { key: "hinata-4", seq: 4, name: "4期生" }
const generation5: Generation = { key: "hinata-5", seq: 5, name: "5期生" }

const memberList: Member[] = [
  // 1st generation
  {
    birthdate: "1995-11-10",
    generation: generation1,
    graduatedAt: "2020-03-31T03:00:00Z",
    name: "井口眞緒",
    nameEnglish: "Mao Iguchi",
    nameKana: "いぐち まお", // Unverified: not listed on the official website
    nameSpaced: "井口 眞緒",
    uid: "1"
  },
  {
    birthdate: "1997-12-26",
    generation: generation1,
    graduatedAt: "2024-01-31T03:00:00Z",
    name: "潮紗理菜",
    nameEnglish: "Sarina Ushio",
    nameKana: "うしお さりな", // Unverified: not listed on the official website
    nameSpaced: "潮 紗理菜",
    uid: "2"
  },
  {
    birthdate: "2001-12-02",
    generation: generation1,
    graduatedAt: "2019-08-31T03:00:00Z",
    name: "柿崎芽実",
    nameEnglish: "Memi Kakizaki",
    nameKana: "かきざき めぐみ", // Unverified: not listed on the official website
    nameSpaced: "柿崎 芽実",
    uid: "3"
  },
  {
    birthdate: "2001-05-08",
    generation: generation1,
    graduatedAt: "2023-08-31T03:00:00Z",
    name: "影山優佳",
    nameEnglish: "Yuuka Kageyama",
    nameKana: "かげやま ゆうか", // Unverified: not listed on the official website
    nameSpaced: "影山 優佳",
    uid: "4"
  },
  {
    birthdate: "1998-02-02",
    generation: generation1,
    graduatedAt: "2025-01-31T03:00:00Z",
    name: "加藤史帆",
    nameEnglish: "Shiho Katou",
    nameKana: "かとう しほ", // Unverified: not listed on the official website
    nameSpaced: "加藤 史帆",
    uid: "5"
  },
  {
    birthdate: "1997-09-05",
    generation: generation1,
    graduatedAt: "2024-04-30T03:00:00Z",
    name: "齊藤京子",
    nameEnglish: "Kyouko Saitou",
    nameKana: "さいとう きょうこ", // Unverified: not listed on the official website
    nameSpaced: "齊藤 京子",
    uid: "6"
  },
  {
    birthdate: "1996-01-22",
    generation: generation1,
    graduatedAt: "2025-05-31T03:00:00Z",
    name: "佐々木久美",
    nameEnglish: "Kumi Sasaki",
    nameKana: "ささき くみ", // Unverified: not listed on the official website
    nameSpaced: "佐々木 久美",
    uid: "7"
  },
  {
    birthdate: "1999-12-17",
    generation: generation1,
    graduatedAt: "2025-05-31T03:00:00Z",
    name: "佐々木美玲",
    nameEnglish: "Mirei Sasaki",
    nameKana: "ささき みれい", // Unverified: not listed on the official website
    nameSpaced: "佐々木 美玲",
    uid: "8"
  },
  {
    birthdate: "1998-09-20",
    generation: generation1,
    graduatedAt: "2025-05-31T03:00:00Z",
    name: "高瀬愛奈",
    nameEnglish: "Mana Takase",
    nameKana: "たかせ まな", // Unverified: not listed on the official website
    nameSpaced: "高瀬 愛奈",
    uid: "9"
  },
  {
    birthdate: "1998-11-02",
    generation: generation1,
    graduatedAt: "2024-08-31T03:00:00Z",
    name: "高本彩花",
    nameEnglish: "Ayaka Takamoto",
    nameKana: "たかもと あやか", // Unverified: not listed on the official website
    nameSpaced: "高本 彩花",
    uid: "10"
  },
  {
    birthdate: "1998-08-23",
    generation: generation1,
    graduatedAt: "2025-02-28T03:00:00Z",
    name: "東村芽依",
    nameEnglish: "Mei Higashimura",
    nameKana: "ひがしむら めい", // Unverified: not listed on the official website
    nameSpaced: "東村 芽依",
    uid: "11"
  },

  // 2nd generation
  {
    birthdate: "2002-09-10",
    generation: generation2,
    name: "金村美玖",
    nameEnglish: "Miku Kanemura",
    nameKana: "かねむら みく",
    nameSpaced: "金村 美玖",
    uid: "12"
  },
  {
    birthdate: "2001-07-23",
    generation: generation2,
    graduatedAt: "2026-01-31T03:00:00Z",
    name: "河田陽菜",
    nameEnglish: "Hina Kawata",
    nameKana: "かわた ひな", // Unverified: not listed on the official website
    nameSpaced: "河田 陽菜",
    uid: "13"
  },
  {
    birthdate: "2002-09-07",
    generation: generation2,
    name: "小坂菜緒",
    nameEnglish: "Nao Kosaka",
    nameKana: "こさか なお",
    nameSpaced: "小坂 菜緒",
    uid: "14"
  },
  {
    birthdate: "2001-01-18",
    generation: generation2,
    graduatedAt: "2025-09-30T03:00:00Z",
    name: "富田鈴花",
    nameEnglish: "Suzuka Tomita",
    nameKana: "とみた すずか", // Unverified: not listed on the official website
    nameSpaced: "富田 鈴花",
    uid: "15"
  },
  {
    birthdate: "2001-02-15",
    generation: generation2,
    graduatedAt: "2025-02-28T03:00:00Z",
    name: "丹生明里",
    nameEnglish: "Akari Nibu",
    nameKana: "にぶ あかり", // Unverified: not listed on the official website
    nameSpaced: "丹生 明里",
    uid: "16"
  },
  {
    birthdate: "2002-09-28",
    generation: generation2,
    graduatedAt: "2025-01-31T03:00:00Z",
    name: "濱岸ひより",
    nameEnglish: "Hiyori Hamagishi",
    nameKana: "はまぎし ひより", // Unverified: not listed on the official website
    nameSpaced: "濱岸 ひより",
    uid: "17"
  },
  {
    birthdate: "1999-04-27",
    generation: generation2,
    graduatedAt: "2026-03-31T03:00:00Z",
    name: "松田好花",
    nameEnglish: "Konoka Matsuda",
    nameKana: "まつだ このか", // Unverified: not listed on the official website
    nameSpaced: "松田 好花",
    uid: "18"
  },
  {
    birthdate: "1998-04-28",
    generation: generation2,
    graduatedAt: "2023-01-31T03:00:00Z",
    name: "宮田愛萌",
    nameEnglish: "Manamo Miyata",
    nameKana: "みやた まなも", // Unverified: not listed on the official website
    nameSpaced: "宮田 愛萌",
    uid: "19"
  },
  {
    birthdate: "2000-02-24",
    generation: generation2,
    graduatedAt: "2022-08-31T03:00:00Z",
    name: "渡邉美穂",
    nameEnglish: "Miho Watanabe",
    nameKana: "わたなべ みほ", // Unverified: not listed on the official website
    nameSpaced: "渡邉 美穂",
    uid: "20"
  },

  // 3rd generation
  {
    birthdate: "2004-04-12",
    generation: generation3,
    name: "上村ひなの",
    nameEnglish: "Hinano Kamimura",
    nameKana: "かみむら ひなの",
    nameSpaced: "上村 ひなの",
    uid: "21"
  },
  {
    birthdate: "2003-09-27",
    generation: generation3,
    name: "髙橋未来虹",
    nameEnglish: "Mikuni Takahashi",
    nameKana: "たかはし みくに",
    nameSpaced: "髙橋 未来虹",
    uid: "22"
  },
  {
    birthdate: "2004-02-23",
    generation: generation3,
    name: "森本茉莉",
    nameEnglish: "Marie Morimoto",
    nameKana: "もりもと まりぃ",
    nameSpaced: "森本 茉莉",
    uid: "23"
  },
  {
    birthdate: "2004-02-23",
    generation: generation3,
    name: "山口陽世",
    nameEnglish: "Haruyo Yamaguchi",
    nameKana: "やまぐち はるよ",
    nameSpaced: "山口 陽世",
    uid: "24"
  },

  // 4th generation
  {
    birthdate: "2004-08-06",
    generation: generation4,
    name: "石塚瑶季",
    nameEnglish: "Tamaki Ishizuka",
    nameKana: "いしづか たまき",
    nameSpaced: "石塚 瑶季",
    uid: "25"
  },
  {
    birthdate: "2004-08-15",
    generation: generation4,
    graduatedAt: "2024-02-29T03:00:00Z",
    name: "岸帆夏",
    nameEnglish: "Honoka Kishi",
    nameKana: "きし ほのか", // Unverified: not listed on the official website
    nameSpaced: "岸 帆夏",
    uid: "26"
  },
  {
    birthdate: "2004-10-03",
    generation: generation4,
    name: "小西夏菜実",
    nameEnglish: "Nanami Konishi",
    nameKana: "こにし ななみ",
    nameSpaced: "小西 夏菜実",
    uid: "27"
  },
  {
    birthdate: "2005-01-15",
    generation: generation4,
    name: "清水理央",
    nameEnglish: "Rio Shimizu",
    nameKana: "しみず りお",
    nameSpaced: "清水 理央",
    uid: "28"
  },
  {
    birthdate: "2007-02-14",
    generation: generation4,
    name: "正源司陽子",
    nameEnglish: "Yoko Shogenji",
    nameKana: "しょうげんじ ようこ",
    nameSpaced: "正源司 陽子",
    uid: "29"
  },
  {
    birthdate: "2006-02-20",
    generation: generation4,
    name: "竹内希来里",
    nameEnglish: "Kirari Takeuchi",
    nameKana: "たけうち きらり",
    nameSpaced: "竹内 希来里",
    uid: "30"
  },
  {
    birthdate: "2003-07-31",
    generation: generation4,
    name: "平尾帆夏",
    nameEnglish: "Honoka Hirao",
    nameKana: "ひらお ほのか",
    nameSpaced: "平尾 帆夏",
    uid: "31"
  },
  {
    birthdate: "2002-04-09",
    generation: generation4,
    name: "平岡海月",
    nameEnglish: "Mitsuki Hiraoka",
    nameKana: "ひらおか みつき",
    nameSpaced: "平岡 海月",
    uid: "32"
  },
  {
    birthdate: "2006-08-07",
    generation: generation4,
    name: "藤嶌果歩",
    nameEnglish: "Kaho Fujishima",
    nameKana: "ふじしま かほ",
    nameSpaced: "藤嶌 果歩",
    uid: "33"
  },
  {
    birthdate: "2005-12-31",
    generation: generation4,
    name: "宮地すみれ",
    nameEnglish: "Sumire Miyachi",
    nameKana: "みやち すみれ",
    nameSpaced: "宮地 すみれ",
    uid: "34"
  },
  {
    birthdate: "2003-05-20",
    generation: generation4,
    name: "山下葉留花",
    nameEnglish: "Haruka Yamashita",
    nameKana: "やました はるか",
    nameSpaced: "山下 葉留花",
    uid: "35"
  },
  {
    birthdate: "2009-02-07",
    generation: generation4,
    name: "渡辺莉奈",
    nameEnglish: "Rina Watanabe",
    nameKana: "わたなべ りな",
    nameSpaced: "渡辺 莉奈",
    uid: "36"
  },

  // 5th generation
  {
    birthdate: "2006-12-07",
    generation: generation5,
    name: "大田美月",
    nameEnglish: "Mizuki Ota",
    nameKana: "おおた みづき",
    nameSpaced: "大田 美月",
    uid: "37"
  },
  {
    birthdate: "2007-05-05",
    generation: generation5,
    name: "大野愛実",
    nameEnglish: "Manami Ono",
    nameKana: "おおの まなみ",
    nameSpaced: "大野 愛実",
    uid: "38"
  },
  {
    birthdate: "2006-12-26",
    generation: generation5,
    name: "片山紗希",
    nameEnglish: "Saki Katayama",
    nameKana: "かたやま さき",
    nameSpaced: "片山 紗希",
    uid: "39"
  },
  {
    birthdate: "2006-01-23",
    generation: generation5,
    name: "蔵盛妃那乃",
    nameEnglish: "Hinano Kuramori",
    nameKana: "くらもり ひなの",
    nameSpaced: "蔵盛 妃那乃",
    uid: "40"
  },
  {
    birthdate: "2009-03-14",
    generation: generation5,
    name: "坂井新奈",
    nameEnglish: "Nina Sakai",
    nameKana: "さかい にいな",
    nameSpaced: "坂井 新奈",
    uid: "41"
  },
  {
    birthdate: "2006-09-10",
    generation: generation5,
    name: "佐藤優羽",
    nameEnglish: "Yu Sato",
    nameKana: "さとう ゆう",
    nameSpaced: "佐藤 優羽",
    uid: "42"
  },
  {
    birthdate: "2006-12-26",
    generation: generation5,
    name: "下田衣珠季",
    nameEnglish: "Izuki Shimoda",
    nameKana: "しもだ いずき",
    nameSpaced: "下田 衣珠季",
    uid: "43"
  },
  {
    birthdate: "2007-08-01",
    generation: generation5,
    name: "高井俐香",
    nameEnglish: "Rika Takai",
    nameKana: "たかい りか",
    nameSpaced: "高井 俐香",
    uid: "44"
  },
  {
    birthdate: "2004-03-27",
    generation: generation5,
    name: "鶴崎仁香",
    nameEnglish: "Niko Tsurusaki",
    nameKana: "つるさき にこ",
    nameSpaced: "鶴崎 仁香",
    uid: "45"
  },
  {
    birthdate: "2005-06-08",
    generation: generation5,
    name: "松尾桜",
    nameEnglish: "Sakura Matsuo",
    nameKana: "まつお さくら",
    nameSpaced: "松尾 桜",
    uid: "46"
  }
]

const nonMemberList: Member[] = [
  {
    name: "ポカ",
    nameEnglish: "Poka",
    nameKana: "ぽか", // Unverified: not listed on the official website
    nameSpaced: "ポカ",
    uid: "000"
  },
  {
    name: "日向坂46新三期生",
    nameEnglish: "New 3rd Generation",
    nameKana: "ひなたざか46 しんさんきせい", // Unverified: not listed on the official website
    nameSpaced: "日向坂46 新三期生",
    uid: "1000"
  },
  {
    name: "四期生リレー",
    nameEnglish: "4th Generation",
    nameKana: "よんきせいりれー", // Unverified: not listed on the official website
    nameSpaced: "四期生リレー",
    uid: "2000"
  },
  {
    name: "五期生リレー",
    nameEnglish: "5th Generation",
    nameKana: "ごきせいりれー", // Unverified: not listed on the official website
    nameSpaced: "五期生リレー",
    uid: "3000"
  }
]

export const members: Member[] = [...memberList, ...nonMemberList]
