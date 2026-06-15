const imageBase = import.meta.env.BASE_URL;

export const grindOptions = ["咖啡豆不研磨", "義式/摩卡壺", "手沖/濾杯", "法壓壺", "冷萃"];

// 商品上下架只需要改這個檔案：
// status: "active" 會顯示並可下單
// status: "soldout" 會顯示售完，但不能加入購物車
// status: "hidden" 不會顯示在頁面上
export const products = [
  {
    id: "medium-dark-1lb",
    status: "active",
    category: "常規豆",
    name: "中深焙配方豆",
    note: "厚實堅果、可可、尾韻甜感，適合拿鐵與日常黑咖啡。",
    image: `${imageBase}images/medium-dark-1lb.jpg`,
    options: [
      { label: "一磅 454g", price: 400 },
      { label: "半磅 227g", price: 215 },
    ],
  },
  {
    id: "formula-blend",
    status: "active",
    category: "配方豆",
    name: "精品配方系列",
    note: "穩定乾淨、甜感明確，適合想固定回購的客人。",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
    options: [
      { label: "半磅 227g", price: 215 },
      { label: "一磅 454g", price: 400 },
    ],
  },
  {
    id: "premium-100g",
    status: "active",
    category: "特選豆",
    name: "當季特選單品",
    note: "果香、花香與明亮酸甜，批次少量烘焙。",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    options: [
      { label: "100g", price: 160 },
      { label: "200g", price: 300 },
    ],
  },
  {
    id: "drip-bag",
    status: "active",
    category: "濾掛",
    name: "中深焙濾掛咖啡",
    note: "出差、辦公室與送禮方便沖泡。",
    image: `${imageBase}images/medium-dark-half-lb.jpg`,
    options: [
      { label: "單包", price: 15 },
      { label: "10 包", price: 150 },
    ],
    noGrind: true,
  },
  {
    id: "sample-soldout",
    status: "hidden",
    category: "範例",
    name: "已下架商品範例",
    note: "要重新上架時，把 status 改成 active。",
    image: `${imageBase}images/medium-dark-half-lb.jpg`,
    options: [{ label: "100g", price: 120 }],
  },
];
