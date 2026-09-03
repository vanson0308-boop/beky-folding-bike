/* 專題文章資料。blocks 類型：
   full  = 全幅橫圖        pair  = 兩張直圖並排
   single= 單張直圖置中    text  = 一句短文
   文字用 i18n key，圖片路徑直接寫 */
const JOURNALS = {
  'summer-breeze': {
    kicker: 'j.sb.kicker',
    title: 'j.sb.title',
    lead: 'j.sb.lead',
    date: '2026-09',
    product: { model: 'skyline', label: 'j.sb.product' },
    cover: 'assets/img/girl/girl-01.jpg',
    blocks: [
      // full 依原始比例不裁切；pair/single 第 4/3 個參數為比例 class（r916 / r34 / r11），只配同比例照片
      // 雙欄一律 人/景、車/景、人/車 交錯
      ['full',   'assets/img/girl/girl-01.jpg'],                                          // 人 騎行 16:9
      ['pair',   'assets/img/girl/girl-02.jpg', 'assets/img/girl/girl-18.jpg', 'r916'],   // 人 / 景
      ['full',   'assets/img/girl/girl-03.jpg'],                                          // 人 下坡 4:3
      ['text',   'j.sb.t1'],
      ['full',   'assets/img/girl/girl-09.jpg'],                                          // 車 海邊 4:3
      ['pair',   'assets/img/girl/girl-04.jpg', 'assets/img/girl/girl-10.jpg', 'r34'],    // 人 / 車
      ['full',   'assets/img/girl/girl-06.jpg'],                                          // 人 沙灘 16:9
      ['pair',   'assets/img/girl/girl-14.jpg', 'assets/img/girl/girl-16.jpg', 'r34'],    // 車 / 景
      ['text',   'j.sb.t2'],
      ['full',   'assets/img/girl/girl-15.jpg'],                                          // 景 海與向日葵 16:9
      ['pair',   'assets/img/girl/girl-11.jpg', 'assets/img/girl/girl-08.jpg', 'r34'],    // 車 / 人
      ['full',   'assets/img/girl/girl-12.jpg'],                                          // 車 藍牆 4:3
      ['pair',   'assets/img/girl/girl-05.jpg', 'assets/img/girl/girl-17.jpg', 'r11'],    // 人 / 景 1:1
      ['full',   'assets/img/girl/girl-13.jpg'],                                          // 車 山城 16:9
      ['single', 'assets/img/girl/girl-07.jpg', 'r916'],                                  // 人 坐看海 收尾
    ],
  },
};
