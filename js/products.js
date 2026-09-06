/* 車款資料（四語）。price 留空則顯示各語系的「售價請洽門市」 */
const PRODUCTS = {
  youth: {
    en: 'Youth', img: 'assets/img/bikes/youth.jpg', price: '',
    name:  { 'zh-TW': '青春', en: 'Youth', 'zh-CN': '青春', ja: '青春' },
    desc: {
      'zh-TW': '入門型車款，車架減震、性能穩定、收納便捷。採用直拉輪組，重心更低，城市騎行更輕鬆；配備 6 速變速與耐用的推行貨架，漲鏈器設計有效減少折疊時掉鏈風險。',
      en: 'The entry model: a comfortable frame, stable performance and easy storage. Radial wheels lower the centre of gravity for relaxed city riding; 6-speed drivetrain, durable rear rack and a chain tensioner that prevents drops when folding.',
      'zh-CN': '入门型车款，车架减震、性能稳定、收纳便捷。采用直拉轮组，重心更低，城市骑行更轻松；配备 6 速变速与耐用的推行货架，涨链器设计有效减少折叠时掉链风险。',
      ja: 'エントリーモデルながら、快適な乗り心地と安定した走行性能、扱いやすい収納性を備えています。ストレートプル仕様のホイールで重心を低くし、街中でも軽快に。6段変速、丈夫な転がし用リアキャリア、折りたたみ時のチェーン落ちを抑えるチェーンテンショナーを装備しています。',
    },
    specs: [
      ['wheel', '16"'], ['gears', '6'], ['frame', '4130 Cr-Mo'], ['fold', '—'], ['weight', '—'], ['load', '120 kg'],
    ],
    colors: [
      ['#4b5d3a', { 'zh-TW': '橄欖綠', en: 'Olive', 'zh-CN': '橄榄绿', ja: 'オリーブグリーン' }],
      ['#e9dcc3', { 'zh-TW': '奶茶', en: 'Milk Tea', 'zh-CN': '奶茶', ja: 'ミルクティーベージュ' }],
      ['#d8e63a', { 'zh-TW': '青柚', en: 'Pomelo', 'zh-CN': '青柚', ja: 'ポメログリーン' }],
      ['#2b2b2b', { 'zh-TW': '石墨黑', en: 'Graphite', 'zh-CN': '石墨黑', ja: 'グラファイトブラック' }],
      ['#ea5b2b', { 'zh-TW': '火焰橙', en: 'Flame Orange', 'zh-CN': '火焰橙', ja: 'フレイムオレンジ' }],
      ['#8a8a86', { 'zh-TW': '鈦灰', en: 'Titanium Grey', 'zh-CN': '钛灰', ja: 'チタニウムグレー' }],
      ['#f2b8bd', { 'zh-TW': '海鹽粉', en: 'Sea Salt Pink', 'zh-CN': '海盐粉', ja: 'シーソルトピンク' }],
      ['#63b34a', { 'zh-TW': '蘋果綠', en: 'Apple Green', 'zh-CN': '苹果绿', ja: 'アップルグリーン' }],
      ['#f39a1e', { 'zh-TW': '南瓜橙', en: 'Pumpkin', 'zh-CN': '南瓜橙', ja: 'パンプキンオレンジ' }],
    ],
  },
  skyline: {
    en: 'Skyline', img: 'assets/img/bikes/skyline.jpg', price: '',
    name:  { 'zh-TW': '天際 Skyline', en: 'Skyline', 'zh-CN': '天际 Skyline', ja: 'SKYLINE' },
    desc: {
      'zh-TW': '18 吋寬胎系列，輕量升級、性能卓越。碟煞制動安全穩定，碳纖前叉輕而堅固，加大楣頭、前後開檔極致折疊；鋁合金後叉與貨架輕裝上陣，獨立變速器掛耳維護無憂。',
      en: 'The 18" wide-tyre series: lighter build, superior performance. Disc brakes for confident stopping, a light and rigid carbon fork, oversized head tube and a fold that stays compact; alloy rear triangle and rack, plus a replaceable derailleur hanger.',
      'zh-CN': '18 寸宽胎系列，轻量升级、性能卓越。碟刹制动安全稳定，碳纤前叉轻而坚固，加大楣头、前后开档极致折叠；铝合金后叉与货架轻装上阵，独立变速器挂耳维护无忧。',
      ja: '18インチのワイドタイヤモデル。軽量化と高い走行性能を両立しました。ディスクブレーキが安定した制動力を生み、カーボンフォークは軽く高剛性。大径ヘッドチューブと前後の開閉構造によりコンパクトに折りたためます。アルミ製リア三角とリアキャリア、交換式ディレイラーハンガーを採用し、メンテナンス性にも配慮しています。',
    },
    specs: [
      ['wheel', '18 × 2.125'], ['gears', '7 (11–32T)'], ['frame', '4130 Cr-Mo + Carbon + Alloy'],
      ['fold', '670 × 670 × 360 mm'], ['weight', '≈ 11 kg ± 0.3'], ['load', '120 kg'], ['headset', '44 mm threadless'],
    ],
    colors: [
      ['#3c4a35', { 'zh-TW': '軍綠', en: 'Army Green', 'zh-CN': '军绿', ja: 'アーミーグリーン' }],
      ['#e6a63a', { 'zh-TW': '芥末黃', en: 'Mustard', 'zh-CN': '芥末黄', ja: 'マスタードイエロー' }],
    ],
  },
  nano: {
    en: 'NANO', img: 'assets/img/bikes/nano.jpg', price: '',
    name:  { 'zh-TW': 'NANO', en: 'NANO', 'zh-CN': 'NANO', ja: 'NANO' },
    desc: {
      'zh-TW': '14 吋小輪組、小車型，折疊後體積小巧，適合追求輕便、小戶型的小個子選手。雙節座管設計調整了車架幾何比例，身高 1.4–1.9 m 都可以騎行；4 速系統搭配中空一體牙盤有效減重。',
      en: 'A 14" compact folder that packs down tiny — ideal for small flats and smaller riders. The two-piece seatpost tunes the geometry so riders from 1.4 to 1.9 m fit; 4-speed drivetrain with a hollow one-piece crank keeps weight down.',
      'zh-CN': '14 寸小轮组、小车型，折叠后体积小巧，适合追求轻便、小户型的小个子选手。双节座管设计调整了车架几何比例，身高 1.4–1.9 m 都可以骑行；4 速系统搭配中空一体牙盘有效减重。',
      ja: '14インチの小径ホイールを備えたコンパクトモデル。折りたたむとさらに小さくなり、軽さを重視する方や限られた住空間にもぴったりです。2段式シートポストでフレームジオメトリーを最適化し、身長約140〜190cmに対応。4段変速と中空一体型クランクで軽量化を図りました。',
    },
    specs: [
      ['wheel', '14"'], ['gears', '4'], ['frame', '4130 Cr-Mo'], ['fold', '—'], ['weight', '—'], ['load', '120 kg'],
    ],
    colors: [
      ['#ea5b2b', { 'zh-TW': '火焰橙', en: 'Flame Orange', 'zh-CN': '火焰橙', ja: 'フレイムオレンジ' }],
      ['#e9dcc3', { 'zh-TW': '奶茶', en: 'Milk Tea', 'zh-CN': '奶茶', ja: 'ミルクティーベージュ' }],
      ['#2f3f4f', { 'zh-TW': '藏青', en: 'Navy', 'zh-CN': '藏青', ja: 'ネイビー' }],
      ['#8fa38a', { 'zh-TW': '青瓷綠', en: 'Celadon', 'zh-CN': '青瓷绿', ja: 'セラドングリーン' }],
      ['#9a9a96', { 'zh-TW': '全鈦', en: 'Titanium', 'zh-CN': '全钛', ja: 'チタニウム' }],
      ['#e53f7a', { 'zh-TW': '四拼色', en: 'Multicolour', 'zh-CN': '四拼色', ja: '4トーンカラー' }],
    ],
  },
  city: {
    en: 'City', img: 'assets/img/bikes/city.jpg', price: '',
    name:  { 'zh-TW': '城市', en: 'City', 'zh-CN': '城市', ja: 'CITY' },
    desc: {
      'zh-TW': '4130 鉻鉬鋼車架，剛性足、騎行穩。7 速變速系統，11–28T 後飛輪，滿足城市路面的複雜路況，適合上班通勤、休閒騎行。四層漆水工藝，防刮、防蹭、防氧化。',
      en: '4130 Cr-Mo frame with a stiff, stable ride. 7-speed 11–28T drivetrain handles every city surface — ideal for commuting and leisure. Four-layer paint resists scratches and oxidation.',
      'zh-CN': '4130 铬钼钢车架，刚性足、骑行稳。7 速变速系统，11–28T 后飞轮，满足城市路面的复杂路况，适合上班通勤、休闲骑行。四层漆水工艺，防刮、防蹭、防氧化。',
      ja: '4130クロモリ鋼フレームならではの剛性と安定した乗り心地。7段変速と11–28Tのリアスプロケットが、変化の多い街路にしなやかに対応し、通勤にも休日のライドにも適しています。4層塗装が、傷・擦れ・酸化から車体を守ります。',
    },
    specs: [
      ['wheel', '16" (349)'], ['gears', '7'], ['frame', '4130 Cr-Mo + Alloy fork'],
      ['fold', '620 × 600 × 350 mm'], ['weight', '≈ 10.5 kg ± 0.3'], ['load', '120 kg'],
    ],
    colors: [
      ['#2fa9c9', { 'zh-TW': '邁阿密藍', en: 'Miami Blue', 'zh-CN': '迈阿密蓝', ja: 'マイアミブルー' }],
      ['#2b2b2b', { 'zh-TW': '黑金', en: 'Black Gold', 'zh-CN': '黑金', ja: 'ブラックゴールド' }],
      ['#3c4a35', { 'zh-TW': '墨綠', en: 'Deep Green', 'zh-CN': '墨绿', ja: 'ディープグリーン' }],
      ['#e9dcc3', { 'zh-TW': '奶茶', en: 'Milk Tea', 'zh-CN': '奶茶', ja: 'ミルクティーベージュ' }],
      ['#1f6a4a', { 'zh-TW': '郵政綠', en: 'Postal Green', 'zh-CN': '邮政绿', ja: 'ポスタルグリーン' }],
      ['#2f3f4f', { 'zh-TW': '藏青', en: 'Navy', 'zh-CN': '藏青', ja: 'ネイビー' }],
      ['#3a2a3f', { 'zh-TW': '暗夜紫', en: 'Midnight Purple', 'zh-CN': '暗夜紫', ja: 'ミッドナイトパープル' }],
      ['#8bb35a', { 'zh-TW': '邁阿密綠', en: 'Miami Green', 'zh-CN': '迈阿密绿', ja: 'マイアミグリーン' }],
      ['#ea5b2b', { 'zh-TW': '火焰橙', en: 'Flame Orange', 'zh-CN': '火焰橙', ja: 'フレイムオレンジ' }],
    ],
  },
  travel: {
    en: 'Travel', img: 'assets/img/bikes/travel.jpg', price: '',
    name:  { 'zh-TW': '旅行', en: 'Travel', 'zh-CN': '旅行', ja: 'TRAVEL' },
    desc: {
      'zh-TW': '搭載內 3 外 5 的 15 速變速系統，無需費心切換邏輯，流暢響應，從都市通勤到山區漫遊皆可應對。大 P 把加海綿把套，端正坐姿、長途舒適；限位座管設計，一拉就到位。',
      en: 'A 15-speed drivetrain (3 internal × 5 external) that responds smoothly from city commutes to hill rambles. Large P-bar with foam grips for an upright, comfortable posture; indexed seatpost sets height in one pull.',
      'zh-CN': '搭载内 3 外 5 的 15 速变速系统，无需费心切换逻辑，流畅响应，从都市通勤到山区漫游皆可应对。大 P 把加海绵把套，端正坐姿、长途舒适；限位座管设计，一拉就到位。',
      ja: '内装3段×外装5段の15段変速を搭載。複雑な操作を意識せず、街の通勤から丘陵地のツーリングまでスムーズに対応します。大型Pハンドルとフォームグリップが自然なアップライト姿勢を支え、長距離でも快適。ストッパー付きシートポストは、引き上げるだけでいつもの高さに決まります。',
    },
    specs: [
      ['wheel', '16"'], ['gears', '15 (3 × 5)'], ['frame', '4130 Cr-Mo'], ['fold', '—'], ['weight', '≈ 12.3 kg ± 0.3'], ['load', '120 kg'],
    ],
    colors: [
      ['#e53f7a', { 'zh-TW': '四拼色', en: 'Multicolour', 'zh-CN': '四拼色', ja: '4トーンカラー' }],
      ['#8a8f6a', { 'zh-TW': '艾草綠 · 黑配', en: 'Sage / Black', 'zh-CN': '艾草绿 · 黑配', ja: 'セージグリーン／ブラック' }],
      ['#8a8f6a', { 'zh-TW': '艾草綠 · 銀配', en: 'Sage / Silver', 'zh-CN': '艾草绿 · 银配', ja: 'セージグリーン／シルバー' }],
    ],
  },
  boundless: {
    en: 'Boundless', img: 'assets/img/bikes/boundless.jpg', price: '',
    name:  { 'zh-TW': '無界', en: 'Boundless', 'zh-CN': '无界', ja: 'BOUNDLESS' },
    desc: {
      'zh-TW': '碳纖維三刀一體輪組與碳纖維坐墊等輕量化部件，整車輕盈、破風效果好，起步與加速更靈敏。採用藍圖藍牙無線電子變速，不易跳檔，可透過手機 App 調節；7 檔變速加輕量化碳輪，爬坡能力強。',
      en: 'Carbon tri-spoke wheels and carbon saddle keep the whole bike light and aero, with crisp acceleration. Wireless electronic shifting stays in tune and can be adjusted from the app; 7 speeds and light carbon wheels make climbing easy.',
      'zh-CN': '碳纤维三刀一体轮组与碳纤维坐垫等轻量化部件，整车轻盈、破风效果好，起步与加速更灵敏。采用蓝图蓝牙无线电子变速，不易跳档，可通过手机 App 调节；7 档变速加轻量化碳轮，爬坡能力强。',
      ja: 'カーボン製トライスポーク一体型ホイールやカーボンサドルなどの軽量パーツにより、軽やかな走りと優れた空力性能、鋭い発進・加速を実現。L-TWOO製Bluetooth対応ワイヤレス電子変速は変速ズレが起こりにくく、スマートフォンアプリから調整できます。7段変速と軽量カーボンホイールで、登りも力強くこなします。',
    },
    specs: [
      ['wheel', '16" carbon tri-spoke'], ['gears', '7 · wireless electronic'], ['frame', '4130 Cr-Mo'], ['fold', '—'], ['weight', '≈ 10.8 kg ± 0.3'], ['load', '120 kg'],
    ],
    colors: [
      ['#e9dcc3', { 'zh-TW': '奶茶', en: 'Milk Tea', 'zh-CN': '奶茶', ja: 'ミルクティーベージュ' }],
      ['#2f3f4f', { 'zh-TW': '藏青', en: 'Navy', 'zh-CN': '藏青', ja: 'ネイビー' }],
      ['#f0c419', { 'zh-TW': '機械師', en: 'Mechanic', 'zh-CN': '机械师', ja: 'メカニックイエロー' }],
      ['#4fd12a', { 'zh-TW': '電光綠', en: 'Electric Green', 'zh-CN': '电光绿', ja: 'エレクトリックグリーン' }],
      ['#2b2b2b', { 'zh-TW': '石墨黑', en: 'Graphite', 'zh-CN': '石墨黑', ja: 'グラファイトブラック' }],
      ['#1a1a1a', { 'zh-TW': '黑金', en: 'Black Gold', 'zh-CN': '黑金', ja: 'ブラックゴールド' }],
      ['#5a2ec7', { 'zh-TW': '電光紫', en: 'Electric Purple', 'zh-CN': '电光紫', ja: 'エレクトリックパープル' }],
    ],
  },
};

const SPEC_LABELS = {
  wheel:   { 'zh-TW': '輪徑', en: 'Wheel size', 'zh-CN': '轮径', ja: 'ホイールサイズ' },
  gears:   { 'zh-TW': '變速', en: 'Gears', 'zh-CN': '变速', ja: '変速' },
  frame:   { 'zh-TW': '車架材質', en: 'Frame', 'zh-CN': '车架材质', ja: 'フレーム素材' },
  fold:    { 'zh-TW': '折疊尺寸', en: 'Folded size', 'zh-CN': '折叠尺寸', ja: '折りたたみサイズ' },
  weight:  { 'zh-TW': '重量', en: 'Weight', 'zh-CN': '重量', ja: '重量' },
  load:    { 'zh-TW': '載重', en: 'Max load', 'zh-CN': '载重', ja: '最大積載重量' },
  headset: { 'zh-TW': '碗組', en: 'Headset', 'zh-CN': '碗组', ja: 'ヘッドセット' },
};
