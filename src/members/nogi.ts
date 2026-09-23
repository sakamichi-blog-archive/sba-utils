import type { Generation, Member } from "./_types"

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
    nameKana: "あきもと まなつ",
    nameSpaced: "秋元 真夏",
    uid: "7639"
  },
  {
    birthdate: "1997-01-22",
    generation: generation1,
    graduatedAt: "2022-02-01T03:00:00Z",
    name: "生田絵梨花",
    nameEnglish: "Erika Ikuta",
    nameKana: "いくた えりか",
    nameSpaced: "生田 絵梨花",
    uid: "253"
  },
  {
    birthdate: "1995-12-29",
    generation: generation1,
    graduatedAt: "2018-05-31T03:00:00Z",
    name: "生駒里奈",
    nameEnglish: "Rina Ikoma",
    nameKana: "いこま りな",
    nameSpaced: "生駒 里奈",
    uid: "254"
  },
  {
    birthdate: "1996-01-22",
    generation: generation1,
    graduatedAt: "2014-07-21T14:59:00Z",
    name: "市來玲奈",
    nameEnglish: "Rena Ichiki",
    nameKana: "いちき れな",
    nameSpaced: "市來 玲奈",
    uid: "255"
  },
  {
    birthdate: "1995-12-12",
    generation: generation1,
    graduatedAt: "2014-10-31T14:59:00Z",
    name: "伊藤寧々",
    nameEnglish: "Nene Itou",
    nameKana: "いとう ねね",
    nameSpaced: "伊藤 寧々",
    uid: "256"
  },
  {
    birthdate: "1996-02-20",
    generation: generation1,
    graduatedAt: "2018-01-31T03:00:00Z",
    name: "伊藤万理華",
    nameEnglish: "Marika Itou",
    nameKana: "いとう まりか",
    nameSpaced: "伊藤 万理華",
    uid: "257"
  },
  {
    birthdate: "1994-12-14",
    generation: generation1,
    graduatedAt: "2020-05-28T03:00:00Z",
    name: "井上小百合",
    nameEnglish: "Sayuri Inoue",
    nameKana: "いのうえ さゆり",
    nameSpaced: "井上 小百合",
    uid: "258"
  },
  {
    birthdate: "1990-06-12",
    generation: generation1,
    graduatedAt: "2012-11-18T14:59:00Z",
    name: "岩瀬佑美子",
    nameEnglish: "Yumiko Iwase",
    nameKana: "いわせ ゆみこ",
    nameSpaced: "岩瀬 佑美子",
    uid: "55388"
  },
  {
    birthdate: "1993-01-04",
    generation: generation1,
    graduatedAt: "2019-04-30T03:00:00Z",
    name: "衛藤美彩",
    nameEnglish: "Misa Etou",
    nameKana: "えとう みさ",
    nameSpaced: "衛藤 美彩",
    uid: "260"
  },
  {
    birthdate: "1994-08-12",
    generation: generation1,
    graduatedAt: "2013-11-17T14:59:00Z",
    name: "柏幸奈",
    nameEnglish: "Yukina Kashiwa",
    nameKana: "かしわ ゆきな",
    nameSpaced: "柏 幸奈",
    uid: "261"
  },
  {
    birthdate: "1998-03-22",
    generation: generation1,
    graduatedAt: "2018-12-31T03:00:00Z",
    name: "川後陽菜",
    nameEnglish: "Hina Kawago",
    nameKana: "かわご ひな",
    nameSpaced: "川後 陽菜",
    uid: "262"
  },
  {
    birthdate: "1995-07-23",
    generation: generation1,
    graduatedAt: "2018-04-30T03:00:00Z",
    name: "川村真洋",
    nameEnglish: "Mahiro Kawamura",
    nameKana: "かわむら まひろ",
    nameSpaced: "川村 真洋",
    uid: "263"
  },
  {
    birthdate: "1998-08-10",
    generation: generation1,
    graduatedAt: "2023-06-30T03:00:00Z",
    name: "齋藤飛鳥",
    nameEnglish: "Asuka Saito",
    nameKana: "さいとう あすか",
    nameSpaced: "齋藤 飛鳥",
    uid: "264"
  },
  {
    birthdate: "1997-02-17",
    generation: generation1,
    graduatedAt: "2018-07-31T03:00:00Z",
    name: "斎藤ちはる",
    nameEnglish: "Chiharu Saitou",
    nameKana: "さいとう ちはる",
    nameSpaced: "斎藤 ちはる",
    uid: "265"
  },
  {
    birthdate: "1993-07-20",
    generation: generation1,
    graduatedAt: "2019-07-31T03:00:00Z",
    name: "斉藤優里",
    nameEnglish: "Yuuri Saitou",
    nameKana: "さいとう ゆうり",
    nameSpaced: "斉藤 優里",
    uid: "266"
  },
  {
    birthdate: "1994-05-16",
    generation: generation1,
    graduatedAt: "2019-09-30T03:00:00Z",
    name: "桜井玲香",
    nameEnglish: "Reika Sakurai",
    nameKana: "さくらい れいか",
    nameSpaced: "桜井 玲香",
    uid: "267"
  },
  {
    birthdate: "1992-08-20",
    generation: generation1,
    graduatedAt: "2020-11-26T03:00:00Z",
    name: "白石麻衣",
    nameEnglish: "Mai Shiraishi",
    nameKana: "しらいし まい",
    nameSpaced: "白石 麻衣",
    uid: "268"
  },
  {
    birthdate: "1994-02-08",
    generation: generation1,
    graduatedAt: "2022-02-01T03:00:00Z",
    name: "高山一実",
    nameEnglish: "Kazumi Takayama",
    nameKana: "たかやま かずみ",
    nameSpaced: "高山 一実",
    uid: "269"
  },
  {
    birthdate: "1994-05-19",
    generation: generation1,
    graduatedAt: "2016-04-30T03:00:00Z",
    name: "永島聖羅",
    nameEnglish: "Seira Nagashima",
    nameKana: "ながしま せいら",
    nameSpaced: "永島 聖羅",
    uid: "272"
  },
  {
    birthdate: "1994-08-06",
    generation: generation1,
    graduatedAt: "2020-11-26T03:00:00Z",
    name: "中田花奈",
    nameEnglish: "Kana Nakada",
    nameKana: "なかだ かな",
    nameSpaced: "中田 花奈",
    uid: "270"
  },
  {
    birthdate: "1996-04-13",
    generation: generation1,
    graduatedAt: "2018-01-31T03:00:00Z",
    name: "中元日芽香",
    nameEnglish: "Himeka Nakamoto",
    nameKana: "なかもと ひめか",
    nameSpaced: "中元 日芽香",
    uid: "271"
  },
  {
    birthdate: "1994-05-25",
    generation: generation1,
    graduatedAt: "2019-02-28T03:00:00Z",
    name: "西野七瀬",
    nameEnglish: "Nanase Nishino",
    nameKana: "にしの ななせ",
    nameSpaced: "西野 七瀬",
    uid: "273"
  },
  {
    birthdate: "1994-10-18",
    generation: generation1,
    graduatedAt: "2018-12-31T03:00:00Z",
    name: "能條愛未",
    nameEnglish: "Ami Noujou",
    nameKana: "のうじょう あみ",
    nameSpaced: "能條 愛未",
    uid: "274"
  },
  {
    birthdate: "1993-02-20",
    generation: generation1,
    graduatedAt: "2017-03-31T03:00:00Z",
    name: "橋本奈々未",
    nameEnglish: "Nanami Hashimoto",
    nameKana: "はしもと ななみ",
    nameSpaced: "橋本 奈々未",
    uid: "275"
  },
  {
    birthdate: "1995-12-05",
    generation: generation1,
    graduatedAt: "2015-04-04T14:59:00Z",
    name: "畠中清羅",
    nameEnglish: "Seira Hatanaka",
    nameKana: "はたなか せいら",
    nameSpaced: "畠中 清羅",
    uid: "276"
  },
  {
    birthdate: "1998-01-31",
    generation: generation1,
    graduatedAt: "2022-11-30T03:00:00Z",
    name: "樋口日奈",
    nameEnglish: "Hina Higuchi",
    nameKana: "ひぐち ひな",
    nameSpaced: "樋口 日奈",
    uid: "277"
  },
  {
    birthdate: "1991-03-29",
    generation: generation1,
    graduatedAt: "2016-07-01T03:00:00Z",
    name: "深川麻衣",
    nameEnglish: "Mai Fukagawa",
    nameKana: "ふかがわ まい",
    nameSpaced: "深川 麻衣",
    uid: "278"
  },
  {
    birthdate: "1998-02-06",
    generation: generation1,
    graduatedAt: "2022-03-31T03:00:00Z",
    name: "星野みなみ",
    nameEnglish: "Minami Hoshino",
    nameKana: "ほしの みなみ",
    nameSpaced: "星野 みなみ",
    uid: "279"
  },
  {
    birthdate: "1992-08-27",
    generation: generation1,
    graduatedAt: "2021-08-19T03:00:00Z",
    name: "松村沙友理",
    nameEnglish: "Sayuri Matsumura",
    nameKana: "まつむら さゆり",
    nameSpaced: "松村 沙友理",
    uid: "280"
  },
  {
    birthdate: "1993-10-29",
    generation: generation1,
    graduatedAt: "2013-11-17T14:59:00Z",
    name: "宮澤成良",
    nameEnglish: "Seira Miyazawa",
    nameKana: "みやざわ せいら",
    nameSpaced: "宮澤 成良",
    uid: "281"
  },
  {
    birthdate: "1994-12-14",
    generation: generation1,
    graduatedAt: "2014-12-15T14:59:00Z",
    name: "大和里菜",
    nameEnglish: "Rina Yamato",
    nameKana: "やまと りな",
    nameSpaced: "大和 里菜",
    uid: "282"
  },
  {
    birthdate: "1994-06-27",
    generation: generation1,
    graduatedAt: "2018-12-31T03:00:00Z",
    name: "若月佑美",
    nameEnglish: "Yumi Wakatsuki",
    nameKana: "わかつき ゆみ",
    nameSpaced: "若月 佑美",
    uid: "283"
  },
  {
    birthdate: "1998-04-23",
    generation: generation1,
    graduatedAt: "2023-01-10T03:00:00Z",
    name: "和田まあや",
    nameEnglish: "Maaya Wada",
    nameKana: "わだ まあや",
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
    nameKana: "いとう かりん",
    nameSpaced: "伊藤 かりん",
    uid: "17375"
  },
  {
    birthdate: "1998-11-30",
    generation: generation2,
    graduatedAt: "2021-10-04T03:00:00Z",
    name: "伊藤純奈",
    nameEnglish: "Junna Itou",
    nameKana: "いとう じゅんな",
    nameSpaced: "伊藤 純奈",
    uid: "17376"
  },
  {
    birthdate: "1996-07-17",
    generation: generation2,
    graduatedAt: "2022-05-31T03:00:00Z",
    name: "北野日奈子",
    nameEnglish: "Hinako Kitano",
    nameKana: "きたの ひなこ",
    nameSpaced: "北野 日奈子",
    uid: "16454"
  },
  {
    birthdate: "1997-11-26",
    generation: generation2,
    graduatedAt: "2018-07-31T03:00:00Z",
    name: "相楽伊織",
    nameEnglish: "Iori Sagara",
    nameKana: "さがら いおり",
    nameSpaced: "相楽 伊織",
    uid: "19634"
  },
  {
    birthdate: "1998-08-28",
    generation: generation2,
    graduatedAt: "2020-04-24T03:00:00Z",
    name: "佐々木琴子",
    nameEnglish: "Kotoko Sasaki",
    nameKana: "ささき ことこ",
    nameSpaced: "佐々木 琴子",
    uid: "17377"
  },
  {
    birthdate: "1992-01-22",
    generation: generation2,
    graduatedAt: "2022-03-31T03:00:00Z",
    name: "新内眞衣",
    nameEnglish: "Mai Shinuchi",
    nameKana: "しんうち まい",
    nameSpaced: "新内 眞衣",
    uid: "17068"
  },
  {
    birthdate: "1999-03-05",
    generation: generation2,
    graduatedAt: "2023-04-28T03:00:00Z",
    name: "鈴木絢音",
    nameEnglish: "Ayane Suzuki",
    nameKana: "すずき あやね",
    nameSpaced: "鈴木 絢音",
    uid: "17378"
  },
  {
    birthdate: "1998-09-23",
    generation: generation2,
    graduatedAt: "2022-02-01T03:00:00Z",
    name: "寺田蘭世",
    nameEnglish: "Ranze Terada",
    nameKana: "てらだ らんぜ",
    nameSpaced: "寺田 蘭世",
    uid: "17379"
  },
  {
    birthdate: "1996-10-15",
    generation: generation2,
    graduatedAt: "2021-04-26T03:00:00Z",
    name: "堀未央奈",
    nameEnglish: "Miona Hori",
    nameKana: "ほり みおな",
    nameSpaced: "堀 未央奈",
    uid: "14470"
  },
  {
    birthdate: "1995-03-08",
    generation: generation2,
    graduatedAt: "2014-10-31T14:59:00Z",
    name: "矢田里沙子",
    nameEnglish: "Risako Yada",
    nameKana: "やだ りさこ",
    nameSpaced: "矢田 里沙子",
    uid: "17380"
  },
  {
    birthdate: "1997-05-21",
    generation: generation2,
    graduatedAt: "2022-08-22T03:00:00Z",
    name: "山崎怜奈",
    nameEnglish: "Rena Yamazaki",
    nameKana: "やまざき れな",
    nameSpaced: "山崎 怜奈",
    uid: "17381"
  },
  {
    birthdate: "1999-04-14",
    generation: generation2,
    graduatedAt: "2014-10-31T14:59:00Z",
    name: "米徳京花",
    nameEnglish: "Kyoka Yonetoku",
    nameKana: "よねとく きょうか",
    nameSpaced: "米徳 京花",
    uid: "17382"
  },
  {
    birthdate: "1999-11-01",
    generation: generation2,
    graduatedAt: "2021-10-04T03:00:00Z",
    name: "渡辺みり愛",
    nameEnglish: "Miria Watanabe",
    nameKana: "わたなべ みりあ",
    nameSpaced: "渡辺 みり愛",
    uid: "17383"
  },

  // 3rd generation
  {
    birthdate: "2002-10-08",
    generation: generation3,
    name: "伊藤理々杏",
    nameEnglish: "Riria Ito",
    nameKana: "いとう りりあ",
    nameSpaced: "伊藤 理々杏",
    uid: "36749"
  },
  {
    birthdate: "2004-02-02",
    generation: generation3,
    name: "岩本蓮加",
    nameEnglish: "Renka Iwamoto",
    nameKana: "いわもと れんか",
    nameSpaced: "岩本 蓮加",
    uid: "36750"
  },
  {
    birthdate: "1999-01-06",
    generation: generation3,
    name: "梅澤美波",
    nameEnglish: "Minami Umezawa",
    nameKana: "うめざわ みなみ",
    nameSpaced: "梅澤 美波",
    uid: "36751"
  },
  {
    birthdate: "1999-09-13",
    generation: generation3,
    graduatedAt: "2021-10-04T03:00:00Z",
    name: "大園桃子",
    nameEnglish: "Momoko Oozono",
    nameKana: "おおぞの ももこ",
    nameSpaced: "大園 桃子",
    uid: "36752"
  },
  {
    birthdate: "2001-07-14",
    generation: generation3,
    graduatedAt: "2025-12-26T03:00:00Z",
    name: "久保史緒里",
    nameEnglish: "Shiori Kubo",
    nameKana: "くぼ しおり",
    nameSpaced: "久保 史緒里",
    uid: "36753"
  },
  {
    birthdate: "2001-11-10",
    generation: generation3,
    graduatedAt: "2024-08-31T03:00:00Z",
    name: "阪口珠美",
    nameEnglish: "Tamami Sakaguchi",
    nameKana: "さかぐち たまみ",
    nameSpaced: "阪口 珠美",
    uid: "36754"
  },
  {
    birthdate: "1998-03-23",
    generation: generation3,
    graduatedAt: "2025-05-30T03:00:00Z",
    name: "佐藤楓",
    nameEnglish: "Kaede Sato",
    nameKana: "さとう かえで",
    nameSpaced: "佐藤 楓",
    uid: "36755"
  },
  {
    birthdate: "2001-09-27",
    generation: generation3,
    graduatedAt: "2025-07-25T03:00:00Z",
    name: "中村麗乃",
    nameEnglish: "Reno Nakamura",
    nameKana: "なかむら れの",
    nameSpaced: "中村 麗乃",
    uid: "36756"
  },
  {
    birthdate: "1999-08-23",
    generation: generation3,
    graduatedAt: "2025-01-31T03:00:00Z",
    name: "向井葉月",
    nameEnglish: "Hazuki Mukai",
    nameKana: "むかい はづき",
    nameSpaced: "向井 葉月",
    uid: "36757"
  },
  {
    birthdate: "1999-07-26",
    generation: generation3,
    graduatedAt: "2024-07-31T03:00:00Z",
    name: "山下美月",
    nameEnglish: "Mizuki Yamashita",
    nameKana: "やました みづき",
    nameSpaced: "山下 美月",
    uid: "36758"
  },
  {
    birthdate: "1995-09-06",
    generation: generation3,
    name: "吉田綾乃クリスティー",
    nameEnglish: "Ayanochristie Yoshida",
    nameKana: "よしだ あやのくりすてぃー",
    nameSpaced: "吉田 綾乃クリスティー",
    uid: "36759"
  },
  {
    birthdate: "2000-05-05",
    generation: generation3,
    graduatedAt: "2025-04-04T03:00:00Z",
    name: "与田祐希",
    nameEnglish: "Yuuki Yoda",
    nameKana: "よだ ゆうき",
    nameSpaced: "与田 祐希",
    uid: "36760"
  },

  // 4th generation
  {
    birthdate: "2001-10-03",
    generation: generation4,
    name: "遠藤さくら",
    nameEnglish: "Sakura Endo",
    nameKana: "えんどう さくら",
    nameSpaced: "遠藤 さくら",
    uid: "48006"
  },
  {
    birthdate: "2001-08-08",
    generation: generation4,
    name: "賀喜遥香",
    nameEnglish: "Haruka Kaki",
    nameKana: "かき はるか",
    nameSpaced: "賀喜 遥香",
    uid: "48008"
  },
  {
    birthdate: "2002-11-20",
    generation: generation4,
    graduatedAt: "2024-08-31T03:00:00Z",
    name: "掛橋沙耶香",
    nameEnglish: "Sayaka Kakehashi",
    nameKana: "かけはし さやか",
    nameSpaced: "掛橋 沙耶香",
    uid: "48009"
  },
  {
    birthdate: "2001-10-31",
    generation: generation4,
    name: "金川紗耶",
    nameEnglish: "Saya Kanagawa",
    nameKana: "かながわ さや",
    nameSpaced: "金川 紗耶",
    uid: "48010"
  },
  {
    birthdate: "2001-08-08",
    generation: generation4,
    graduatedAt: "2023-09-22T03:00:00Z",
    name: "北川悠理",
    nameEnglish: "Yuri Kitagawa",
    nameKana: "きたがわ ゆり",
    nameSpaced: "北川 悠理",
    uid: "48012"
  },
  {
    birthdate: "2004-01-19",
    generation: generation4,
    name: "黒見明香",
    nameEnglish: "Haruka Kuromi",
    nameKana: "くろみ はるか",
    nameSpaced: "黒見 明香",
    uid: "55383"
  },
  {
    birthdate: "2001-08-09",
    generation: generation4,
    graduatedAt: "2026-06-12T03:00:00Z",
    name: "佐藤璃果",
    nameEnglish: "Rika Sato",
    nameKana: "さとう りか",
    nameSpaced: "佐藤 璃果",
    uid: "55384"
  },
  {
    birthdate: "2003-03-03",
    generation: generation4,
    name: "柴田柚菜",
    nameEnglish: "Yuna Shibata",
    nameKana: "しばた ゆな",
    nameSpaced: "柴田 柚菜",
    uid: "48013"
  },
  {
    birthdate: "2003-08-01",
    generation: generation4,
    graduatedAt: "2024-08-31T03:00:00Z",
    name: "清宮レイ",
    nameEnglish: "Rei Seimiya",
    nameKana: "せいみや れい",
    nameSpaced: "清宮 レイ",
    uid: "48014"
  },
  {
    birthdate: "1999-01-12",
    generation: generation4,
    name: "田村真佑",
    nameEnglish: "Mayu Tamura",
    nameKana: "たむら まゆ",
    nameSpaced: "田村 真佑",
    uid: "48015"
  },
  {
    birthdate: "2004-06-08",
    generation: generation4,
    name: "筒井あやめ",
    nameEnglish: "Ayame Tsutsui",
    nameKana: "つつい あやめ",
    nameSpaced: "筒井 あやめ",
    uid: "48017"
  },
  {
    birthdate: "2000-08-24",
    generation: generation4,
    graduatedAt: "2023-09-22T03:00:00Z",
    name: "早川聖来",
    nameEnglish: "Seira Hayakawa",
    nameKana: "はやかわ せいら",
    nameSpaced: "早川 聖来",
    uid: "48018"
  },
  {
    birthdate: "2003-10-02",
    generation: generation4,
    name: "林瑠奈",
    nameEnglish: "Runa Hayashi",
    nameKana: "はやし るな",
    nameSpaced: "林 瑠奈",
    uid: "55385"
  },
  {
    birthdate: "2004-01-03",
    generation: generation4,
    graduatedAt: "2026-01-30T03:00:00Z",
    name: "松尾美佑",
    nameEnglish: "Miyu Matsuo",
    nameKana: "まつお みゆ",
    nameSpaced: "松尾 美佑",
    uid: "55386"
  },
  {
    birthdate: "2002-08-14",
    generation: generation4,
    graduatedAt: "2026-01-30T03:00:00Z",
    name: "矢久保美緒",
    nameEnglish: "Mio Yakubo",
    nameKana: "やくぼ みお",
    nameSpaced: "矢久保 美緒",
    uid: "48019"
  },
  {
    birthdate: "1999-02-03",
    generation: generation4,
    name: "弓木奈於",
    nameEnglish: "Nao Yumiki",
    nameKana: "ゆみき なお",
    nameSpaced: "弓木 奈於",
    uid: "55387"
  },

  // 5th generation
  {
    birthdate: "2005-07-29",
    generation: generation5,
    name: "五百城茉央",
    nameEnglish: "Mao Ioki",
    nameKana: "いおき まお",
    nameSpaced: "五百城 茉央",
    uid: "55396"
  },
  {
    birthdate: "2002-05-12",
    generation: generation5,
    name: "池田瑛紗",
    nameEnglish: "Teresa Ikeda",
    nameKana: "いけだ てれさ",
    nameSpaced: "池田 瑛紗",
    uid: "55397"
  },
  {
    birthdate: "2003-05-24",
    generation: generation5,
    name: "一ノ瀬美空",
    nameEnglish: "Miku Ichinose",
    nameKana: "いちのせ みく",
    nameSpaced: "一ノ瀬 美空",
    uid: "55390"
  },
  {
    birthdate: "2005-02-17",
    generation: generation5,
    name: "井上和",
    nameEnglish: "Nagi Inoue",
    nameKana: "いのうえ なぎ",
    nameSpaced: "井上 和",
    uid: "55389"
  },
  {
    birthdate: "2003-12-17",
    generation: generation5,
    name: "岡本姫奈",
    nameEnglish: "Hina Okamoto",
    nameKana: "おかもと ひな",
    nameSpaced: "岡本 姫奈",
    uid: "55401"
  },
  {
    birthdate: "2007-06-27",
    generation: generation5,
    name: "小川彩",
    nameEnglish: "Aya Ogawa",
    nameKana: "おがわ あや",
    nameSpaced: "小川 彩",
    uid: "55392"
  },
  {
    birthdate: "2005-08-20",
    generation: generation5,
    name: "奥田いろは",
    nameEnglish: "Iroha Okuda",
    nameKana: "おくだ いろは",
    nameSpaced: "奥田 いろは",
    uid: "55394"
  },
  {
    birthdate: "2003-04-17",
    generation: generation5,
    name: "川﨑桜",
    nameEnglish: "Sakura Kawasaki",
    nameKana: "かわさき さくら",
    nameSpaced: "川﨑 桜",
    uid: "55400"
  },
  {
    birthdate: "2005-10-31",
    generation: generation5,
    name: "菅原咲月",
    nameEnglish: "Satsuki Sugawara",
    nameKana: "すがわら さつき",
    nameSpaced: "菅原 咲月",
    uid: "55391"
  },
  {
    birthdate: "2006-09-18",
    generation: generation5,
    name: "冨里奈央",
    nameEnglish: "Nao Tomisato",
    nameKana: "とみさと なお",
    nameSpaced: "冨里 奈央",
    uid: "55393"
  },
  {
    birthdate: "2003-03-17",
    generation: generation5,
    name: "中西アルノ",
    nameEnglish: "Aruno Nakanishi",
    nameKana: "なかにし あるの",
    nameSpaced: "中西 アルノ",
    uid: "55395"
  },

  // 6th generation
  {
    birthdate: "2005-09-17",
    generation: generation6,
    name: "愛宕心響",
    nameEnglish: "Kokone Atago",
    nameKana: "あたご ここね",
    nameSpaced: "愛宕 心響",
    uid: "63101"
  },
  {
    birthdate: "2004-12-01",
    generation: generation6,
    name: "大越ひなの",
    nameEnglish: "Hinano Okoshi",
    nameKana: "おおこし ひなの",
    nameSpaced: "大越 ひなの",
    uid: "63102"
  },
  {
    birthdate: "2007-04-17",
    generation: generation6,
    name: "小津玲奈",
    nameEnglish: "Reina Ozu",
    nameKana: "おづ れいな",
    nameSpaced: "小津 玲奈",
    uid: "63103"
  },
  {
    birthdate: "2007-02-14",
    generation: generation6,
    name: "海邉朱莉",
    nameEnglish: "Akari Kaibe",
    nameKana: "かいべ あかり",
    nameSpaced: "海邉 朱莉",
    uid: "63104"
  },
  {
    birthdate: "2011-01-14",
    generation: generation6,
    name: "川端晃菜",
    nameEnglish: "Hina Kawabata",
    nameKana: "かわばた ひな",
    nameSpaced: "川端 晃菜",
    uid: "63105"
  },
  {
    birthdate: "2006-05-18",
    generation: generation6,
    name: "鈴木佑捺",
    nameEnglish: "Yuuna Suzuki",
    nameKana: "すずき ゆうな",
    nameSpaced: "鈴木 佑捺",
    uid: "63106"
  },
  {
    birthdate: "2005-07-16",
    generation: generation6,
    name: "瀬戸口心月",
    nameEnglish: "Mitsuki Setoguchi",
    nameKana: "せとぐち みつき",
    nameSpaced: "瀬戸口 心月",
    uid: "63107"
  },
  {
    birthdate: "2007-05-25",
    generation: generation6,
    name: "長嶋凛桜",
    nameEnglish: "Rio Nagashima",
    nameKana: "ながしま りお",
    nameSpaced: "長嶋 凛桜",
    uid: "63108"
  },
  {
    birthdate: "2009-11-01",
    generation: generation6,
    name: "増田三莉音",
    nameEnglish: "Mirine Masuda",
    nameKana: "ますだ みりね",
    nameSpaced: "増田 三莉音",
    uid: "63109"
  },
  {
    birthdate: "2008-10-05",
    generation: generation6,
    name: "森平麗心",
    nameEnglish: "Urumi Morihira",
    nameKana: "もりひら うるみ",
    nameSpaced: "森平 麗心",
    uid: "63110"
  },
  {
    birthdate: "2008-01-27",
    generation: generation6,
    name: "矢田萌華",
    nameEnglish: "Moeka Yada",
    nameKana: "やだ もえか",
    nameSpaced: "矢田 萌華",
    uid: "63111"
  }
]

const nonMemberList: Member[] = [
  {
    name: "運営スタッフ",
    nameSpaced: "運営スタッフ",
    uid: "40003"
  },
  {
    name: "研究生",
    nameSpaced: "研究生",
    uid: "40006"
  },
  {
    name: "3期生",
    nameSpaced: "3期生",
    uid: "40004"
  },
  {
    name: "4期生",
    nameSpaced: "4期生",
    uid: "40005"
  },
  {
    name: "新4期生",
    nameSpaced: "新4期生",
    uid: "40001"
  },
  {
    name: "5期生",
    nameSpaced: "5期生",
    uid: "40007"
  },
  {
    name: "6期生",
    nameSpaced: "6期生",
    uid: "40008"
  }
]

export const members: Member[] = [...memberList, ...nonMemberList]
