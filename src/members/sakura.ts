import type { Generation, Member } from "./_types"

const generation1: Generation = { key: "sakura-1", seq: 1, name: "1期生" }
const generation2: Generation = { key: "sakura-2", seq: 2, name: "2期生" }
const generation3: Generation = { key: "sakura-3", seq: 3, name: "3期生" }
const generation4: Generation = { key: "sakura-4", seq: 4, name: "4期生" }

const memberList: Member[] = [
  // 1st generation
  {
    birthdate: "1997-01-05",
    generation: generation1,
    graduatedAt: "2025-02-28T03:00:00Z",
    name: "上村莉菜",
    nameEnglish: "Rina Uemura",
    nameSpaced: "上村 莉菜",
    uid: "03"
  },
  {
    birthdate: "1997-10-08",
    generation: generation1,
    graduatedAt: "2022-10-31T03:00:00Z",
    name: "尾関梨香",
    nameEnglish: "Rika Ozeki",
    nameSpaced: "尾関 梨香",
    uid: "04"
  },
  {
    birthdate: "1998-11-15",
    generation: generation1,
    graduatedAt: "2025-05-31T03:00:00Z",
    name: "小池美波",
    nameEnglish: "Minami Koike",
    nameSpaced: "小池 美波",
    uid: "06"
  },
  {
    birthdate: "1999-10-24",
    generation: generation1,
    graduatedAt: "2024-02-29T03:00:00Z",
    name: "小林由依",
    nameEnglish: "Yui Kobayashi",
    nameSpaced: "小林 由依",
    uid: "07"
  },
  {
    birthdate: "1998-02-16",
    generation: generation1,
    graduatedAt: "2025-02-14T03:00:00Z",
    name: "齋藤冬優花",
    nameEnglish: "Fuyuka Saitou",
    nameSpaced: "齋藤 冬優花",
    uid: "08"
  },
  {
    birthdate: "1995-11-30",
    generation: generation1,
    graduatedAt: "2022-12-31T03:00:00Z",
    name: "菅井友香",
    nameEnglish: "Yuuka Sugai",
    nameSpaced: "菅井 友香",
    uid: "11"
  },
  {
    birthdate: "1997-07-08",
    generation: generation1,
    graduatedAt: "2023-12-31T03:00:00Z",
    name: "土生瑞穂",
    nameEnglish: "Mizuho Habu",
    nameSpaced: "土生 瑞穂",
    uid: "14"
  },
  {
    birthdate: "2000-05-08",
    generation: generation1,
    graduatedAt: "2022-08-31T03:00:00Z",
    name: "原田葵",
    nameEnglish: "Aoi Harada",
    nameSpaced: "原田 葵",
    uid: "15"
  },
  {
    birthdate: "1997-11-13",
    generation: generation1,
    graduatedAt: "2021-12-31T03:00:00Z",
    name: "守屋茜",
    nameEnglish: "Akane Moriya",
    nameSpaced: "守屋 茜",
    uid: "18"
  },
  {
    birthdate: "1995-05-16",
    generation: generation1,
    graduatedAt: "2021-12-31T03:00:00Z",
    name: "渡辺梨加",
    nameEnglish: "Rika Watanabe",
    nameSpaced: "渡辺 梨加",
    uid: "20"
  },
  {
    birthdate: "1998-07-28",
    generation: generation1,
    graduatedAt: "2022-06-30T14:59:00Z",
    name: "渡邉理佐",
    nameEnglish: "Risa Watanabe",
    nameSpaced: "渡邉 理佐",
    uid: "21"
  },

  // 2nd generation
  {
    birthdate: "2001-01-29",
    generation: generation2,
    graduatedAt: "2026-02-28T03:00:00Z",
    name: "井上梨名",
    nameEnglish: "Rina Inoue",
    nameSpaced: "井上 梨名",
    uid: "43"
  },
  {
    birthdate: "1999-04-17",
    generation: generation2,
    name: "遠藤光莉",
    nameEnglish: "Hikari Endou",
    nameSpaced: "遠藤 光莉",
    uid: "53"
  },
  {
    birthdate: "2000-04-18",
    generation: generation2,
    name: "大園玲",
    nameEnglish: "Rei Oozono",
    nameSpaced: "大園 玲",
    uid: "54"
  },
  {
    birthdate: "1999-10-12",
    generation: generation2,
    name: "大沼晶保",
    nameEnglish: "Akiho Oonuma",
    nameSpaced: "大沼 晶保",
    uid: "55"
  },
  {
    birthdate: "2002-12-19",
    generation: generation2,
    name: "幸阪茉里乃",
    nameEnglish: "Marino Kousaka",
    nameSpaced: "幸阪 茉里乃",
    uid: "56"
  },
  {
    birthdate: "1998-06-29",
    generation: generation2,
    graduatedAt: "2023-05-31T14:59:00Z",
    name: "関有美子",
    nameEnglish: "Yumiko Seki",
    nameSpaced: "関 有美子",
    uid: "44"
  },
  {
    birthdate: "2002-03-23",
    generation: generation2,
    name: "武元唯衣",
    nameEnglish: "Yui Takemoto",
    nameSpaced: "武元 唯衣",
    uid: "45"
  },
  {
    birthdate: "1998-10-21",
    generation: generation2,
    name: "田村保乃",
    nameEnglish: "Hono Tamura",
    nameSpaced: "田村 保乃",
    uid: "46"
  },
  {
    birthdate: "2001-08-29",
    generation: generation2,
    name: "藤吉夏鈴",
    nameEnglish: "Karin Fujiyoshi",
    nameSpaced: "藤吉 夏鈴",
    uid: "47"
  },
  {
    birthdate: "2002-01-12",
    generation: generation2,
    name: "増本綺良",
    nameEnglish: "Kira Masumoto",
    nameSpaced: "増本 綺良",
    uid: "57"
  },
  {
    birthdate: "1999-10-13",
    generation: generation2,
    name: "松田里奈",
    nameEnglish: "Rina Matsuda",
    nameSpaced: "松田 里奈",
    uid: "48"
  },
  {
    birthdate: "1998-05-05",
    generation: generation2,
    graduatedAt: "2021-04-30T14:59:00Z",
    name: "松平璃子",
    nameEnglish: "Riko Matsudaira",
    nameSpaced: "松平 璃子",
    uid: "49"
  },
  {
    birthdate: "2001-07-10",
    generation: generation2,
    name: "森田ひかる",
    nameEnglish: "Hikaru Morita",
    nameSpaced: "森田 ひかる",
    uid: "50"
  },
  {
    birthdate: "2000-01-02",
    generation: generation2,
    name: "守屋麗奈",
    nameEnglish: "Rena Moriya",
    nameSpaced: "守屋 麗奈",
    uid: "58"
  },
  {
    birthdate: "2005-09-28",
    generation: generation2,
    name: "山﨑天",
    nameEnglish: "Ten Yamasaki",
    nameSpaced: "山﨑 天",
    uid: "51"
  },

  // 3rd generation
  {
    birthdate: "2002-01-13",
    generation: generation3,
    name: "石森璃花",
    nameEnglish: "Rika Ishimori",
    nameSpaced: "石森 璃花",
    uid: "59"
  },
  {
    birthdate: "2006-01-09",
    generation: generation3,
    name: "遠藤理子",
    nameEnglish: "Riko Endou",
    nameSpaced: "遠藤 理子",
    uid: "60"
  },
  {
    birthdate: "2004-07-25",
    generation: generation3,
    name: "小田倉麗奈",
    nameEnglish: "Reina Odakura",
    nameSpaced: "小田倉 麗奈",
    uid: "61"
  },
  {
    birthdate: "2005-07-07",
    generation: generation3,
    name: "小島凪紗",
    nameEnglish: "Nagisa Kojima",
    nameSpaced: "小島 凪紗",
    uid: "62"
  },
  {
    birthdate: "2005-04-12",
    generation: generation3,
    name: "谷口愛季",
    nameEnglish: "Airi Taniguchi",
    nameSpaced: "谷口 愛季",
    uid: "63"
  },
  {
    birthdate: "2003-02-17",
    generation: generation3,
    name: "中嶋優月",
    nameEnglish: "Yuzuki Nakashima",
    nameSpaced: "中嶋 優月",
    uid: "64"
  },
  {
    birthdate: "2006-11-08",
    generation: generation3,
    name: "的野美青",
    nameEnglish: "Mio Matono",
    nameSpaced: "的野 美青",
    uid: "65"
  },
  {
    birthdate: "2006-05-09",
    generation: generation3,
    name: "向井純葉",
    nameEnglish: "Itoha Mukai",
    nameSpaced: "向井 純葉",
    uid: "66"
  },
  {
    birthdate: "2004-08-18",
    generation: generation3,
    name: "村井優",
    nameEnglish: "Yuu Murai",
    nameSpaced: "村井 優",
    uid: "67"
  },
  {
    birthdate: "2005-02-15",
    generation: generation3,
    name: "村山美羽",
    nameEnglish: "Miu Murayama",
    nameSpaced: "村山 美羽",
    uid: "68"
  },
  {
    birthdate: "2005-01-22",
    generation: generation3,
    name: "山下瞳月",
    nameEnglish: "Shizuki Yamashita",
    nameSpaced: "山下 瞳月",
    uid: "69"
  },

  // 4th generation
  {
    birthdate: "2004-12-22",
    generation: generation4,
    name: "浅井恋乃未",
    nameEnglish: "Konomi Asai",
    nameSpaced: "浅井 恋乃未",
    uid: "70"
  },
  {
    birthdate: "2006-03-09",
    generation: generation4,
    name: "稲熊ひな",
    nameEnglish: "Hina Inaguma",
    nameSpaced: "稲熊 ひな",
    uid: "71"
  },
  {
    birthdate: "2004-01-24",
    generation: generation4,
    name: "勝又春",
    nameEnglish: "Haru Katsumata",
    nameSpaced: "勝又 春",
    uid: "72"
  },
  {
    birthdate: "2006-12-01",
    generation: generation4,
    name: "佐藤愛桜",
    nameEnglish: "Neo Satou",
    nameSpaced: "佐藤 愛桜",
    uid: "73"
  },
  {
    birthdate: "2007-09-16",
    generation: generation4,
    name: "中川智尋",
    nameEnglish: "Chihiro Nakagawa",
    nameSpaced: "中川 智尋",
    uid: "74"
  },
  {
    birthdate: "2005-02-06",
    generation: generation4,
    name: "松本和子",
    nameEnglish: "Wako Matsumoto",
    nameSpaced: "松本 和子",
    uid: "75"
  },
  {
    birthdate: "2006-01-24",
    generation: generation4,
    name: "目黒陽色",
    nameEnglish: "Hiiro Meguro",
    nameSpaced: "目黒 陽色",
    uid: "76"
  },
  {
    birthdate: "2005-09-19",
    generation: generation4,
    name: "山川宇衣",
    nameEnglish: "Ui Yamakawa",
    nameSpaced: "山川 宇衣",
    uid: "77"
  },
  {
    birthdate: "2008-07-20",
    generation: generation4,
    name: "山田桃実",
    nameEnglish: "Momomi Yamada",
    nameSpaced: "山田 桃実",
    uid: "78"
  }
]

const nonMemberList: Member[] = [{ name: "四期生リレー", nameSpaced: "四期生リレー", uid: "2001" }]

export const members: Member[] = [...memberList, ...nonMemberList]
