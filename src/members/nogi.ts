import type { Generation, Member, NonMember } from "./_types"

const generation1: Generation = { key: "nogi-1", name: "1期生", seq: 1 }
const generation2: Generation = { key: "nogi-2", name: "2期生", seq: 2 }
const generation3: Generation = { key: "nogi-3", name: "3期生", seq: 3 }
const generation4: Generation = { key: "nogi-4", name: "4期生", seq: 4 }
const generation5: Generation = { key: "nogi-5", name: "5期生", seq: 5 }
const generation6: Generation = { key: "nogi-6", name: "6期生", seq: 6 }

const memberList: Member[] = [
  // 1st generation
  {
    birthdate: "1993-08-20",
    generation: generation1,
    graduatedAt: "2023-03-31T03:00:00Z",
    name: "秋元真夏",
    nameEnglish: "Manatsu Akimoto",
    nameSpaced: "秋元 真夏",
    uid: "7639"
  },
  {
    birthdate: "1997-01-22",
    generation: generation1,
    graduatedAt: "2022-02-01T03:00:00Z",
    name: "生田絵梨花",
    nameEnglish: "Erika Ikuta",
    nameSpaced: "生田 絵梨花",
    uid: "253"
  },
  {
    birthdate: "1995-12-29",
    generation: generation1,
    graduatedAt: "2018-05-31T03:00:00Z",
    name: "生駒里奈",
    nameEnglish: "Rina Ikoma",
    nameSpaced: "生駒 里奈",
    uid: "254"
  },
  {
    birthdate: "1996-01-22",
    generation: generation1,
    graduatedAt: "2014-07-21T14:59:00Z",
    name: "市來玲奈",
    nameEnglish: "Rena Ichiki",
    nameSpaced: "市來 玲奈",
    uid: "255"
  },
  {
    birthdate: "1995-12-12",
    generation: generation1,
    graduatedAt: "2014-10-31T14:59:00Z",
    name: "伊藤寧々",
    nameEnglish: "Nene Itou",
    nameSpaced: "伊藤 寧々",
    uid: "256"
  },
  {
    birthdate: "1996-02-20",
    generation: generation1,
    graduatedAt: "2018-01-31T03:00:00Z",
    name: "伊藤万理華",
    nameEnglish: "Marika Itou",
    nameSpaced: "伊藤 万理華",
    uid: "257"
  },
  {
    birthdate: "1994-12-14",
    generation: generation1,
    graduatedAt: "2020-05-28T03:00:00Z",
    name: "井上小百合",
    nameEnglish: "Sayuri Inoue",
    nameSpaced: "井上 小百合",
    uid: "258"
  },
  {
    birthdate: "1990-06-12",
    generation: generation1,
    graduatedAt: "2012-11-18T14:59:00Z",
    name: "岩瀬佑美子",
    nameEnglish: "Yumiko Iwase",
    nameSpaced: "岩瀬 佑美子",
    uid: "53388"
  },
  {
    birthdate: "1993-01-04",
    generation: generation1,
    graduatedAt: "2019-04-30T03:00:00Z",
    name: "衛藤美彩",
    nameEnglish: "Misa Etou",
    nameSpaced: "衛藤 美彩",
    uid: "260"
  },
  {
    birthdate: "1994-08-12",
    generation: generation1,
    graduatedAt: "2013-11-17T14:59:00Z",
    name: "柏幸奈",
    nameEnglish: "Yukina Kashiwa",
    nameSpaced: "柏 幸奈",
    uid: "261"
  },
  {
    birthdate: "1998-03-22",
    generation: generation1,
    graduatedAt: "2018-12-31T03:00:00Z",
    name: "川後陽菜",
    nameEnglish: "Hina Kawago",
    nameSpaced: "川後 陽菜",
    uid: "262"
  },
  {
    birthdate: "1995-07-23",
    generation: generation1,
    graduatedAt: "2018-04-30T03:00:00Z",
    name: "川村真洋",
    nameEnglish: "Mahiro Kawamura",
    nameSpaced: "川村 真洋",
    uid: "263"
  },
  {
    birthdate: "1998-08-10",
    generation: generation1,
    graduatedAt: "2023-06-30T03:00:00Z",
    name: "齋藤飛鳥",
    nameEnglish: "Asuka Saitou",
    nameSpaced: "齋藤 飛鳥",
    uid: "264"
  },
  {
    birthdate: "1997-02-17",
    generation: generation1,
    graduatedAt: "2018-07-31T03:00:00Z",
    name: "斎藤ちはる",
    nameEnglish: "Chiharu Saitou",
    nameSpaced: "斎藤 ちはる",
    uid: "265"
  },
  {
    birthdate: "1993-07-20",
    generation: generation1,
    graduatedAt: "2019-07-31T03:00:00Z",
    name: "斉藤優里",
    nameEnglish: "Yuuri Saitou",
    nameSpaced: "斉藤 優里",
    uid: "266"
  },
  {
    birthdate: "1994-05-16",
    generation: generation1,
    graduatedAt: "2019-09-30T03:00:00Z",
    name: "桜井玲香",
    nameEnglish: "Reika Sakurai",
    nameSpaced: "桜井 玲香",
    uid: "267"
  },
  {
    birthdate: "1992-08-20",
    generation: generation1,
    graduatedAt: "2020-11-26T03:00:00Z",
    name: "白石麻衣",
    nameEnglish: "Mai Shiraishi",
    nameSpaced: "白石 麻衣",
    uid: "268"
  },
  {
    birthdate: "1994-02-08",
    generation: generation1,
    graduatedAt: "2022-02-01T03:00:00Z",
    name: "高山一実",
    nameEnglish: "Kazumi Takayama",
    nameSpaced: "高山 一実",
    uid: "269"
  },
  {
    birthdate: "1994-05-19",
    generation: generation1,
    graduatedAt: "2016-04-30T03:00:00Z",
    name: "永島聖羅",
    nameEnglish: "Seira Nagashima",
    nameSpaced: "永島 聖羅",
    uid: "272"
  },
  {
    birthdate: "1994-08-06",
    generation: generation1,
    graduatedAt: "2020-11-26T03:00:00Z",
    name: "中田花奈",
    nameEnglish: "Kana Nakada",
    nameSpaced: "中田 花奈",
    uid: "270"
  },
  {
    birthdate: "1996-04-13",
    generation: generation1,
    graduatedAt: "2018-01-31T03:00:00Z",
    name: "中元日芽香",
    nameEnglish: "Himeka Nakamoto",
    nameSpaced: "中元 日芽香",
    uid: "271"
  },
  {
    birthdate: "1994-05-25",
    generation: generation1,
    graduatedAt: "2019-02-28T03:00:00Z",
    name: "西野七瀬",
    nameEnglish: "Nanase Nishino",
    nameSpaced: "西野 七瀬",
    uid: "273"
  },
  {
    birthdate: "1994-10-18",
    generation: generation1,
    graduatedAt: "2018-12-31T03:00:00Z",
    name: "能條愛未",
    nameEnglish: "Ami Noujou",
    nameSpaced: "能條 愛未",
    uid: "274"
  },
  {
    birthdate: "1993-02-20",
    generation: generation1,
    graduatedAt: "2017-03-31T03:00:00Z",
    name: "橋本奈々未",
    nameEnglish: "Nanami Hashimoto",
    nameSpaced: "橋本 奈々未",
    uid: "275"
  },
  {
    birthdate: "1995-12-05",
    generation: generation1,
    graduatedAt: "2015-04-04T14:59:00Z",
    name: "畠中清羅",
    nameEnglish: "Seira Hatanaka",
    nameSpaced: "畠中 清羅",
    uid: "276"
  },
  {
    birthdate: "1998-01-31",
    generation: generation1,
    graduatedAt: "2022-11-30T03:00:00Z",
    name: "樋口日奈",
    nameEnglish: "Hina Higuchi",
    nameSpaced: "樋口 日奈",
    uid: "277"
  },
  {
    birthdate: "1991-03-29",
    generation: generation1,
    graduatedAt: "2016-07-01T03:00:00Z",
    name: "深川麻衣",
    nameEnglish: "Mai Fukagawa",
    nameSpaced: "深川 麻衣",
    uid: "278"
  },
  {
    birthdate: "1998-02-06",
    generation: generation1,
    graduatedAt: "2022-03-31T03:00:00Z",
    name: "星野みなみ",
    nameEnglish: "Minami Hoshino",
    nameSpaced: "星野 みなみ",
    uid: "279"
  },
  {
    birthdate: "1992-08-27",
    generation: generation1,
    graduatedAt: "2021-08-19T03:00:00Z",
    name: "松村沙友理",
    nameEnglish: "Sayuri Matsumura",
    nameSpaced: "松村 沙友理",
    uid: "280"
  },
  {
    birthdate: "1993-10-29",
    generation: generation1,
    graduatedAt: "2013-11-17T14:59:00Z",
    name: "宮澤成良",
    nameEnglish: "Seira Miyazawa",
    nameSpaced: "宮澤 成良",
    uid: "281"
  },
  {
    birthdate: "1994-12-14",
    generation: generation1,
    graduatedAt: "2014-12-15T14:59:00Z",
    name: "大和里菜",
    nameEnglish: "Rina Yamato",
    nameSpaced: "大和 里菜",
    uid: "282"
  },
  {
    birthdate: "1994-06-27",
    generation: generation1,
    graduatedAt: "2018-12-31T03:00:00Z",
    name: "若月佑美",
    nameEnglish: "Yumi Wakatsuki",
    nameSpaced: "若月 佑美",
    uid: "283"
  },
  {
    birthdate: "1998-04-23",
    generation: generation1,
    graduatedAt: "2023-01-10T03:00:00Z",
    name: "和田まあや",
    nameEnglish: "Maaya Wada",
    nameSpaced: "和田 まあや",
    uid: "284"
  },

  // 2nd generation
  {
    birthdate: "1993-05-26",
    generation: generation2,
    graduatedAt: "2019-07-31T03:00:00Z",
    name: "伊藤かりん",
    nameEnglish: "Karin Itou",
    nameSpaced: "伊藤 かりん",
    uid: "17375"
  },
  {
    birthdate: "1998-11-30",
    generation: generation2,
    graduatedAt: "2021-10-04T03:00:00Z",
    name: "伊藤純奈",
    nameEnglish: "Junna Itou",
    nameSpaced: "伊藤 純奈",
    uid: "17376"
  },
  {
    birthdate: "1996-07-17",
    generation: generation2,
    graduatedAt: "2022-05-31T03:00:00Z",
    name: "北野日奈子",
    nameEnglish: "Hinako Kitano",
    nameSpaced: "北野 日奈子",
    uid: "16454"
  },
  {
    birthdate: "1997-11-26",
    generation: generation2,
    graduatedAt: "2018-07-31T03:00:00Z",
    name: "相楽伊織",
    nameEnglish: "Iori Sagara",
    nameSpaced: "相楽 伊織",
    uid: "19634"
  },
  {
    birthdate: "1998-08-28",
    generation: generation2,
    graduatedAt: "2020-04-24T03:00:00Z",
    name: "佐々木琴子",
    nameEnglish: "Kotoko Sasaki",
    nameSpaced: "佐々木 琴子",
    uid: "17377"
  },
  {
    birthdate: "1992-01-22",
    generation: generation2,
    graduatedAt: "2022-03-31T03:00:00Z",
    name: "新内眞衣",
    nameEnglish: "Mai Shinnuchi",
    nameSpaced: "新内 眞衣",
    uid: "17068"
  },
  {
    birthdate: "1999-03-05",
    generation: generation2,
    graduatedAt: "2023-04-28T03:00:00Z",
    name: "鈴木絢音",
    nameEnglish: "Ayane Suzuki",
    nameSpaced: "鈴木 絢音",
    uid: "17378"
  },
  {
    birthdate: "1998-09-23",
    generation: generation2,
    graduatedAt: "2022-02-01T03:00:00Z",
    name: "寺田蘭世",
    nameEnglish: "Ranze Terada",
    nameSpaced: "寺田 蘭世",
    uid: "17379"
  },
  {
    birthdate: "1996-10-15",
    generation: generation2,
    graduatedAt: "2021-04-26T03:00:00Z",
    name: "堀未央奈",
    nameEnglish: "Miona Hori",
    nameSpaced: "堀 未央奈",
    uid: "14470"
  },
  {
    birthdate: "1995-03-08",
    generation: generation2,
    graduatedAt: "2014-10-31T14:59:00Z",
    name: "矢田里沙子",
    nameEnglish: "Risako Yada",
    nameSpaced: "矢田 里沙子",
    uid: "17380"
  },
  {
    birthdate: "1997-05-21",
    generation: generation2,
    graduatedAt: "2022-08-22T03:00:00Z",
    name: "山崎怜奈",
    nameEnglish: "Rena Yamazaki",
    nameSpaced: "山崎 怜奈",
    uid: "17381"
  },
  {
    birthdate: "1999-04-14",
    generation: generation2,
    graduatedAt: "2014-10-31T14:59:00Z",
    name: "米徳京花",
    nameEnglish: "Kyouka Yonetoku",
    nameSpaced: "米徳 京花",
    uid: "17382"
  },
  {
    birthdate: "1999-11-01",
    generation: generation2,
    graduatedAt: "2021-10-04T03:00:00Z",
    name: "渡辺みり愛",
    nameEnglish: "Miria Watanabe",
    nameSpaced: "渡辺 みり愛",
    uid: "17383"
  },

  // 3rd generation
  {
    birthdate: "2002-10-08",
    generation: generation3,
    name: "伊藤理々杏",
    nameEnglish: "Riria Itou",
    nameSpaced: "伊藤 理々杏",
    uid: "36749"
  },
  {
    birthdate: "2004-02-02",
    generation: generation3,
    name: "岩本蓮加",
    nameEnglish: "Renka Iwamoto",
    nameSpaced: "岩本 蓮加",
    uid: "36750"
  },
  {
    birthdate: "1999-01-06",
    generation: generation3,
    name: "梅澤美波",
    nameEnglish: "Minami Umezawa",
    nameSpaced: "梅澤 美波",
    uid: "36751"
  },
  {
    birthdate: "1999-09-13",
    generation: generation3,
    graduatedAt: "2021-10-04T03:00:00Z",
    name: "大園桃子",
    nameEnglish: "Momoko Oozono",
    nameSpaced: "大園 桃子",
    uid: "36752"
  },
  {
    birthdate: "2001-07-14",
    generation: generation3,
    graduatedAt: "2025-12-26T03:00:00Z",
    name: "久保史緒里",
    nameEnglish: "Shiori Kubo",
    nameSpaced: "久保 史緒里",
    uid: "36753"
  },
  {
    birthdate: "2001-11-10",
    generation: generation3,
    graduatedAt: "2024-08-31T03:00:00Z",
    name: "阪口珠美",
    nameEnglish: "Tamami Sakaguchi",
    nameSpaced: "阪口 珠美",
    uid: "36754"
  },
  {
    birthdate: "1998-03-23",
    generation: generation3,
    graduatedAt: "2025-05-30T03:00:00Z",
    name: "佐藤楓",
    nameEnglish: "Kaede Satou",
    nameSpaced: "佐藤 楓",
    uid: "36755"
  },
  {
    birthdate: "2001-09-27",
    generation: generation3,
    graduatedAt: "2025-07-25T03:00:00Z",
    name: "中村麗乃",
    nameEnglish: "Reno Nakamura",
    nameSpaced: "中村 麗乃",
    uid: "36756"
  },
  {
    birthdate: "1999-08-23",
    generation: generation3,
    graduatedAt: "2025-01-31T03:00:00Z",
    name: "向井葉月",
    nameEnglish: "Hazuki Mukai",
    nameSpaced: "向井 葉月",
    uid: "36757"
  },
  {
    birthdate: "1999-07-26",
    generation: generation3,
    graduatedAt: "2024-07-31T03:00:00Z",
    name: "山下美月",
    nameEnglish: "Mizuki Yamashita",
    nameSpaced: "山下 美月",
    uid: "36758"
  },
  {
    birthdate: "1995-09-06",
    generation: generation3,
    name: "吉田綾乃クリスティー",
    nameEnglish: "Ayano Christie Yoshida",
    nameSpaced: "吉田 綾乃クリスティー",
    uid: "36759"
  },
  {
    birthdate: "2000-05-05",
    generation: generation3,
    graduatedAt: "2025-04-04T03:00:00Z",
    name: "与田祐希",
    nameEnglish: "Yuuki Yoda",
    nameSpaced: "与田 祐希",
    uid: "36760"
  },

  // 4th generation
  {
    birthdate: "2001-10-03",
    generation: generation4,
    name: "遠藤さくら",
    nameEnglish: "Sakura Endou",
    nameSpaced: "遠藤 さくら",
    uid: "48006"
  },
  {
    birthdate: "2001-08-08",
    generation: generation4,
    name: "賀喜遥香",
    nameEnglish: "Haruka Kaki",
    nameSpaced: "賀喜 遥香",
    uid: "48008"
  },
  {
    birthdate: "2002-11-20",
    generation: generation4,
    graduatedAt: "2024-08-31T03:00:00Z",
    name: "掛橋沙耶香",
    nameEnglish: "Sayaka Kakehashi",
    nameSpaced: "掛橋 沙耶香",
    uid: "48009"
  },
  {
    birthdate: "2001-10-31",
    generation: generation4,
    name: "金川紗耶",
    nameEnglish: "Saya Kanagawa",
    nameSpaced: "金川 紗耶",
    uid: "48010"
  },
  {
    birthdate: "2001-08-08",
    generation: generation4,
    graduatedAt: "2023-09-22T03:00:00Z",
    name: "北川悠理",
    nameEnglish: "Yuri Kitagawa",
    nameSpaced: "北川 悠理",
    uid: "48012"
  },
  {
    birthdate: "2004-01-19",
    generation: generation4,
    name: "黒見明香",
    nameEnglish: "Haruka Kuromi",
    nameSpaced: "黒見 明香",
    uid: "55383"
  },
  {
    birthdate: "2001-08-09",
    generation: generation4,
    graduatedAt: "2026-06-12T03:00:00Z",
    name: "佐藤璃果",
    nameEnglish: "Rika Satou",
    nameSpaced: "佐藤 璃果",
    uid: "55384"
  },
  {
    birthdate: "2003-03-03",
    generation: generation4,
    name: "柴田柚菜",
    nameEnglish: "Yuna Shibata",
    nameSpaced: "柴田 柚菜",
    uid: "48013"
  },
  {
    birthdate: "2003-08-01",
    generation: generation4,
    graduatedAt: "2024-08-31T03:00:00Z",
    name: "清宮レイ",
    nameEnglish: "Rei Seimiya",
    nameSpaced: "清宮 レイ",
    uid: "48014"
  },
  {
    birthdate: "1999-01-12",
    generation: generation4,
    name: "田村真佑",
    nameEnglish: "Mayu Tamura",
    nameSpaced: "田村 真佑",
    uid: "48015"
  },
  {
    birthdate: "2004-06-08",
    generation: generation4,
    name: "筒井あやめ",
    nameEnglish: "Ayame Tsutsui",
    nameSpaced: "筒井 あやめ",
    uid: "48017"
  },
  {
    birthdate: "2000-08-24",
    generation: generation4,
    graduatedAt: "2023-09-22T03:00:00Z",
    name: "早川聖来",
    nameEnglish: "Seira Hayakawa",
    nameSpaced: "早川 聖来",
    uid: "48018"
  },
  {
    birthdate: "2003-10-02",
    generation: generation4,
    name: "林瑠奈",
    nameEnglish: "Runa Hayashi",
    nameSpaced: "林 瑠奈",
    uid: "55385"
  },
  {
    birthdate: "2004-01-03",
    generation: generation4,
    graduatedAt: "2026-01-30T03:00:00Z",
    name: "松尾美佑",
    nameEnglish: "Miyu Matsuo",
    nameSpaced: "松尾 美佑",
    uid: "55386"
  },
  {
    birthdate: "2002-08-14",
    generation: generation4,
    graduatedAt: "2026-01-30T03:00:00Z",
    name: "矢久保美緒",
    nameEnglish: "Mio Yakubo",
    nameSpaced: "矢久保 美緒",
    uid: "48019"
  },
  {
    birthdate: "1999-02-03",
    generation: generation4,
    name: "弓木奈於",
    nameEnglish: "Nao Yumiki",
    nameSpaced: "弓木 奈於",
    uid: "55387"
  },

  // 5th generation
  {
    birthdate: "2005-07-29",
    generation: generation5,
    name: "五百城茉央",
    nameEnglish: "Mao Ioki",
    nameSpaced: "五百城 茉央",
    uid: "55396"
  },
  {
    birthdate: "2002-05-12",
    generation: generation5,
    name: "池田瑛紗",
    nameEnglish: "Teresa Ikeda",
    nameSpaced: "池田 瑛紗",
    uid: "55397"
  },
  {
    birthdate: "2003-05-24",
    generation: generation5,
    name: "一ノ瀬美空",
    nameEnglish: "Miku Ichinose",
    nameSpaced: "一ノ瀬 美空",
    uid: "55390"
  },
  {
    birthdate: "2005-02-17",
    generation: generation5,
    name: "井上和",
    nameEnglish: "Nagi Inoue",
    nameSpaced: "井上 和",
    uid: "55389"
  },
  {
    birthdate: "2003-12-17",
    generation: generation5,
    name: "岡本姫奈",
    nameEnglish: "Hina Okamoto",
    nameSpaced: "岡本 姫奈",
    uid: "55401"
  },
  {
    birthdate: "2007-06-27",
    generation: generation5,
    name: "小川彩",
    nameEnglish: "Aya Ogawa",
    nameSpaced: "小川 彩",
    uid: "55392"
  },
  {
    birthdate: "2005-08-20",
    generation: generation5,
    name: "奥田いろは",
    nameEnglish: "Iroha Okuda",
    nameSpaced: "奥田 いろは",
    uid: "55394"
  },
  {
    birthdate: "2003-04-17",
    generation: generation5,
    name: "川﨑桜",
    nameEnglish: "Sakura Kawasaki",
    nameSpaced: "川﨑 桜",
    uid: "55400"
  },
  {
    birthdate: "2005-10-31",
    generation: generation5,
    name: "菅原咲月",
    nameEnglish: "Satsuki Sugawara",
    nameSpaced: "菅原 咲月",
    uid: "55391"
  },
  {
    birthdate: "2006-09-18",
    generation: generation5,
    name: "冨里奈央",
    nameEnglish: "Nao Tomisato",
    nameSpaced: "冨里 奈央",
    uid: "55393"
  },
  {
    birthdate: "2003-03-17",
    generation: generation5,
    name: "中西アルノ",
    nameEnglish: "Aruno Nakanishi",
    nameSpaced: "中西 アルノ",
    uid: "55395"
  },

  // 6th generation
  {
    birthdate: "2005-09-17",
    generation: generation6,
    name: "愛宕心響",
    nameEnglish: "Kokone Atago",
    nameSpaced: "愛宕 心響",
    uid: "63101"
  },
  {
    birthdate: "2004-12-01",
    generation: generation6,
    name: "大越ひなの",
    nameEnglish: "Hinano Ookoshi",
    nameSpaced: "大越 ひなの",
    uid: "63102"
  },
  {
    birthdate: "2007-04-17",
    generation: generation6,
    name: "小津玲奈",
    nameEnglish: "Reina Ozu",
    nameSpaced: "小津 玲奈",
    uid: "63103"
  },
  {
    birthdate: "2007-02-14",
    generation: generation6,
    name: "海邉朱莉",
    nameEnglish: "Akari Kaibe",
    nameSpaced: "海邉 朱莉",
    uid: "63104"
  },
  {
    birthdate: "2011-01-14",
    generation: generation6,
    name: "川端晃菜",
    nameEnglish: "Hina Kawabata",
    nameSpaced: "川端 晃菜",
    uid: "63105"
  },
  {
    birthdate: "2006-05-18",
    generation: generation6,
    name: "鈴木佑捺",
    nameEnglish: "Yuuna Suzuki",
    nameSpaced: "鈴木 佑捺",
    uid: "63106"
  },
  {
    birthdate: "2005-07-16",
    generation: generation6,
    name: "瀬戸口心月",
    nameEnglish: "Mitsuki Setoguchi",
    nameSpaced: "瀬戸口 心月",
    uid: "63107"
  },
  {
    birthdate: "2007-05-25",
    generation: generation6,
    name: "長嶋凛桜",
    nameEnglish: "Rio Nagashima",
    nameSpaced: "長嶋 凛桜",
    uid: "63108"
  },
  {
    birthdate: "2009-11-01",
    generation: generation6,
    name: "増田三莉音",
    nameEnglish: "Mirine Masuda",
    nameSpaced: "増田 三莉音",
    uid: "63109"
  },
  {
    birthdate: "2008-10-05",
    generation: generation6,
    name: "森平麗心",
    nameEnglish: "Urumi Morihira",
    nameSpaced: "森平 麗心",
    uid: "63110"
  },
  {
    birthdate: "2008-01-27",
    generation: generation6,
    name: "矢田萌華",
    nameEnglish: "Moeka Yada",
    nameSpaced: "矢田 萌華",
    uid: "63111"
  }
]

const nonMemberList: NonMember[] = [
  { name: "運営スタッフ", nameSpaced: "運営スタッフ", uid: "40003" },
  { name: "3期生", nameSpaced: "3期生", uid: "40004" },
  { name: "4期生", nameSpaced: "4期生", uid: "40005" },
  { name: "新4期生", nameSpaced: "新4期生", uid: "40001" },
  { name: "5期生", nameSpaced: "5期生", uid: "40007" },
  { name: "6期生", nameSpaced: "6期生", uid: "40008" }
]

export const members: (Member | NonMember)[] = [...memberList, ...nonMemberList]
