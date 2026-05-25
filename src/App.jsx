import { useEffect, useMemo, useState } from "react";
import { Award, Bean, ChevronRight, Coffee, Filter, MapPin, Minus, Plus, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const shopeeUrl = "https://shopee.tw/caobancoffee?categoryId=100629&entryPoint=ShopByPDP&itemId=49107641936&upstream=search";
const orderApiUrl = "https://script.google.com/macros/s/AKfycbzfN28njwcJeZssEQV5HJnZ7Z9Z-dPmIVP0WNLBZNQz7VUG9VewI6hl29-0ivpJ_DiPQA/exec";
const minimumCheckoutTotal = 100;
const sevenElevenStoresJsonUrl = `${import.meta.env.BASE_URL}stores.json`;
const coffeeReviewAwardImage = `${import.meta.env.BASE_URL}images/coffee-review-award.png`;
const mediumDarkOnePoundImage = `${import.meta.env.BASE_URL}images/medium-dark-1lb.jpg`;
const mediumDarkHalfPoundImage = `${import.meta.env.BASE_URL}images/medium-dark-half-lb.jpg`;

const categories = [
  {
    title: "商用優選豆",
    subtitle: "高 CP 值｜穩定供應｜日常營業使用",
    description: "適合咖啡店、早餐店、工作室與日常大量沖煮需求，講求穩定、耐喝與成本平衡。",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "精品咖啡豆",
    subtitle: "精品配方｜風味平衡｜成熟口感",
    description: "精選精品配方與高品質產區豆，強調甜感、層次與平衡風味。",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "配方豆專區",
    subtitle: "自家配方｜穩定風味｜日常好喝",
    description: "提供四款日常配方豆，從順口平衡到厚實濃郁，適合不同沖煮習慣與飲用偏好。",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "單一極致產區",
    subtitle: "限量微批次｜風土表現｜精品收藏",
    description: "此分類暫時保留，後續可加入單一產區與特殊處理法豆款。",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Coffee Review評分豆",
    subtitle: "Coffee Review｜高分評測｜精品競標",
    description: "此分類暫時保留，後續可加入 Coffee Review 高分評測精品豆。",
    image: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "濾掛咖啡",
    subtitle: "即沖即飲｜通勤便利｜日常補給",
    description: "適合上班、露營與日常快速沖泡，保留精品咖啡風味，同時兼顧便利性與穩定品質。",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
  },
];

const commercialOnePoundOptions = [
  { label: "【中深】巴西 摩羯座 甜濃縮", price: 400 },
  { label: "【中深】經典 黃金曼巴", price: 400 },
  { label: "【中深】衣索 耶加雪菲 水洗", price: 430 },
  { label: "【中深】肯亞 精選 AA 水洗", price: 430 },
  { label: "【中深】哥倫比亞 梅德琳", price: 390 },
  { label: "【中深】薩爾瓦多 巧克情深", price: 400 },
  { label: "【中深】巴西 喜拉朵", price: 350 },
  { label: "【中深】瓜地馬拉 微微特南果", price: 350 },
  { label: "【中深】衣索 耶加雪菲 日曬", price: 450 },
  { label: "【中深】印尼 曼特寧", price: 430 },
  { label: "【中深】尼加 溫和風情 SHG", price: 380 },
  { label: "NEW【中深】巴拿馬 射手座 紅玉谷", price: 490 },
];

const commercialHalfPoundOptions = commercialOnePoundOptions.map((option) => ({
  label: option.label,
  price: Math.round(option.price / 2 + 15),
}));

const formulaBlendOptions = [
  { label: "【深】經典典藏配方", price: 350 },
  { label: "【中深】堅果小子配方", price: 400 },
  { label: "【中深】太妏糖姬配方", price: 450 },
  { label: "【中】冠軍精選配方", price: 500 },
];

const formulaBlendHalfPoundOptions = formulaBlendOptions.map((option) => ({
  label: option.label,
  price: Math.round(option.price / 2 + 15),
}));

const products = [
  {
    id: "shopee-medium-dark-1lb",
    category: "商用優選豆",
    name: "中深焙推薦 一磅裝",
    roast: "中深烘焙",
    taste: "不酸好滋味、濃郁堅果香、自家烘焙",
    packageOptions: commercialOnePoundOptions,
    grindOptions: ["一磅（咖啡原豆）", "2.5 磨粉 / 義式", "3 磨粉 / 摩卡壺", "8 磨粉 / 手沖（推薦）", "9 磨粉 / 法壓"],
    weight: "一磅裝 / 454g",
    image: mediumDarkOnePoundImage,
  },
  {
    id: "shopee-medium-dark-half-lb",
    category: "商用優選豆",
    name: "中深焙推薦 半磅裝",
    roast: "中深烘焙",
    taste: "不酸好滋味、濃郁堅果香、自家烘焙，適合初次嘗試與日常少量飲用。",
    packageOptions: commercialHalfPoundOptions,
    grindOptions: ["半磅（咖啡原豆）", "2.5 磨粉 / 義式", "3 磨粉 / 摩卡壺", "8 磨粉 / 手沖（推薦）", "9 磨粉 / 法壓"],
    weight: "半磅裝 / 227g",
    image: mediumDarkHalfPoundImage,
  },
  {
    id: "formula-blend-series",
    category: "配方豆專區",
    name: "配方豆專區",
    roast: "中焙 / 中深焙",
    taste: "四款日常配方豆，提供順口、堅果、焦糖與厚實風味選擇。",
    packageOptions: [
      { label: "【深】經典典藏配方", price: 350 },
      { label: "【中深】堅果小子配方", price: 400 },
      { label: "【中深】太妃糖姬配方", price: 450 },
      { label: "【中】冠軍精選配方", price: 500 },
    ],
    grindOptions: ["一磅(咖啡原豆)", "2.5 磨粉 / 義式", "3 磨粉 / 摩卡壺", "8 磨粉 / 手沖（推薦）", "9 磨粉 / 法壓"],
    weight: "配方豆系列454g",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "formula-blend-series-half",
    category: "配方豆專區",
    name: "配方豆專區 227g",
    roast: "中深 / 中深咖啡",
    taste: "險果、藍蔚、糖果感明顯，甘碧平衡。",
    packageOptions: formulaBlendHalfPoundOptions,
    grindOptions: ["半磅(咖啡原豆)", "2.5 磅粉 / 義式", "3 磅粉 / 摩卡壶", "8 磅粉 / 手沖", "9 磅粉 / 法壘"],
    weight: "配方豆糸列 227g",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "colombia-hopes-estate-wine-sun",
    category: "精品咖啡豆",
    name: "哥倫比亞 希望莊園 酒香日曬處理",
    roast: "淺烘焙",
    taste: "酒香發酵、莓果甜感、尾韻濃郁，適合喜歡特殊發酵風味的精品咖啡愛好者。",
    packageOptions: [
      { label: "100g", price: 160 },
      { label: "200g", price: 300 },
    ],
    grindOptions: ["咖啡原豆", "3 磨粉 / 摩卡壺", "8 磨粉 / 手沖（推薦）", "9 磨粉 / 法壓"],
    weight: "精品小包裝",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ethiopia-yirgacheffe-banko-datatu",
    category: "精品咖啡豆",
    name: "衣索比亞 耶加雪夫 班可 達達圖 G1 水洗",
    roast: "淺烘焙",
    taste: "茉莉花香、柑橘酸甜、尾韻乾淨細緻，展現耶加雪夫經典水洗風味。",
    packageOptions: [
      { label: "100g", price: 145 },
      { label: "200g", price: 270 },
    ],
    grindOptions: ["咖啡原豆", "3 磨粉 / 摩卡壺", "8 磨粉 / 手沖（推薦）", "9 磨粉 / 法壓"],
    weight: "精品小包裝",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "golden-mandheling-drip",
    category: "濾掛咖啡",
    name: "黃金曼巴 濾掛咖啡",
    roast: "中深烘焙",
    taste: "厚實可可、焦糖甜感、滑順尾韻",
    packageOptions: [{ label: "單包", price: 15 }],
    grindOptions: [],
    weight: "每包 / 10g",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
];

const productCategoryTabs = ["全部商品", ...categories.map((category) => category.title)];
const emptyProductCategories = ["單一極致產區", "Coffee Review評分豆"];
const infoSlides = [
  { title: "本月行事曆", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80" },
  { title: "商品組合特惠", image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1600&q=80" },
  { title: "Coffee Review 榮獲資訊", image: coffeeReviewAwardImage },
];

const convenienceStores = [
  { id: "174536", name: "7-11 勤美門市", city: "台中市", district: "西區", address: "台中市西區公益路68號" },
  { id: "132214", name: "7-11 草悟道門市", city: "台中市", district: "西區", address: "台中市西區中興街183號" },
  { id: "194820", name: "7-11 市府門市", city: "台中市", district: "西屯區", address: "台中市西屯區臺灣大道三段99號" },
  { id: "118625", name: "7-11 逢甲門市", city: "台中市", district: "西屯區", address: "台中市西屯區福星路427號" },
  { id: "105397", name: "7-11 一中門市", city: "台中市", district: "北區", address: "台中市北區一中街98號" },
  { id: "200861", name: "7-11 台北站前門市", city: "台北市", district: "中正區", address: "台北市中正區忠孝西路一段49號" },
  { id: "221093", name: "7-11 信義門市", city: "台北市", district: "信義區", address: "台北市信義區松壽路11號" },
  { id: "186503", name: "7-11 高雄美麗島門市", city: "高雄市", district: "新興區", address: "高雄市新興區中山一路115號" },
];

function currency(value) {
  return new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 }).format(value);
}

function makeCartId(productId, packageLabel, grindLabel = "不需研磨") {
  return `${productId}__${packageLabel}__${grindLabel}`;
}

function buildOrderLineItems(cart) {
  return cart.map((item) => ({
    productId: item.id,
    name: item.name,
    packageLabel: item.packageLabel,
    grindLabel: item.grindLabel,
    quantity: item.quantity,
    unitPrice: item.price,
    lineTotal: item.price * item.quantity,
  }));
}

function buildOrderItemsText(cart) {
  return cart
    .map((item) => `${item.name}｜${item.packageLabel}｜${item.grindLabel}｜${item.quantity}件｜單價${currency(item.price)}｜小計${currency(item.price * item.quantity)}`)
    .join("\n");
}

function parsePickupStore(value) {
  const [storeName = "", storeId = "", storeAddress = ""] = value.split("｜").map((text) => text.trim());
  return { storeName, storeId, storeAddress };
}

function isValidStoreId(storeId) {
  return /^\d{6}$/.test(storeId);
}

function validateStoreData() {
  const categoryFieldsValid = categories.every((category) => ["title", "subtitle", "description", "image"].every((field) => Boolean(category[field])));
  const productFieldsValid = products.every(
    (product) =>
      ["id", "category", "name", "roast", "taste", "packageOptions", "grindOptions", "weight", "image"].every(
        (field) => product[field] !== undefined && product[field] !== null && product[field] !== ""
      ) &&
      Array.isArray(product.packageOptions) &&
      product.packageOptions.length > 0 &&
      product.packageOptions.every((option) => Boolean(option.label) && Number.isFinite(option.price) && option.price > 0) &&
      Array.isArray(product.grindOptions)
  );
  const productIdsUnique = new Set(products.map((product) => product.id)).size === products.length;
  const productCategoriesExist = products.every((product) => categories.some((category) => category.title === product.category));
  const dripOnlySinglePack = products.find((product) => product.id === "golden-mandheling-drip")?.packageOptions.length === 1;
  const commercialBeanHasTwelveOptions = products.find((product) => product.id === "shopee-medium-dark-1lb")?.packageOptions.length === 12;
  const halfPoundCommercialBeanHasTwelveOptions = products.find((product) => product.id === "shopee-medium-dark-half-lb")?.packageOptions.length === 12;
  const halfPoundPricesAreCorrect = products
    .find((product) => product.id === "shopee-medium-dark-half-lb")
    ?.packageOptions.every((option, index) => option.price === Math.round(commercialOnePoundOptions[index].price / 2 + 15));
  const clearedTemporaryCategories = products.every((product) => !emptyProductCategories.includes(product.category));
  const premiumCoffeeProductsExist = products.filter((product) => product.category === "精品咖啡豆").length === 2;
  const formulaBlendProductsExist =
    products.filter((product) => product.category === "配方豆專區").length === 2 &&
    products.find((product) => product.id === "formula-blend-series")?.packageOptions.length === 4 &&
    products.find((product) => product.id === "formula-blend-series-half")?.packageOptions.length === 4;
  return Boolean(
    categoryFieldsValid &&
      productFieldsValid &&
      productIdsUnique &&
      productCategoriesExist &&
      dripOnlySinglePack &&
      categories.length === 6 &&
      products.length >= 7 &&
      commercialBeanHasTwelveOptions &&
      halfPoundCommercialBeanHasTwelveOptions &&
      halfPoundPricesAreCorrect &&
      clearedTemporaryCategories &&
      premiumCoffeeProductsExist &&
      formulaBlendProductsExist
  );
}

console.assert(validateStoreData(), "Store data validation failed: categories or products are missing required fields.");
console.assert(currency(15) === "$15", "Currency formatter should display TWD without decimals.");
console.assert(makeCartId("bean", "A", "原豆") !== makeCartId("bean", "A", "手沖"), "Different grind options should have different cart IDs.");
console.assert(products.filter((product) => product.category === "Coffee Review評分豆").length === 0, "Coffee Review評分豆 should be temporarily empty.");
console.assert(products.some((product) => product.id === "shopee-medium-dark-half-lb" && product.weight === "半磅裝 / 227g"), "Half-pound commercial bean product should exist.");
console.assert(products.filter((product) => product.category === "精品咖啡豆").length === 2, "Premium coffee bean category should contain two products.");
console.assert(products.filter((product) => product.category === "配方豆專區").length === 2, "Formula blend category should contain two grouped products.");
console.assert(products.find((product) => product.id === "formula-blend-series")?.packageOptions.length === 4, "Formula blend grouped product should contain four options.");
console.assert(products.find((product) => product.id === "formula-blend-series-half")?.packageOptions.length === 4, "Formula blend half-pound grouped product should contain four options.");
console.assert(infoSlides.length === 3, "Info carousel should contain three slides.");
console.assert(commercialHalfPoundOptions[0].price === 215, "Half-pound price should be half of one-pound price plus 15.");
console.assert(buildOrderItemsText([{ name: "測試商品", packageLabel: "100g", grindLabel: "咖啡原豆", quantity: 1, price: 100 }]).includes("測試商品"), "Order items text should include product names.");
console.assert(buildOrderItemsText([{ name: "A", packageLabel: "100g", grindLabel: "原豆", quantity: 1, price: 100 }, { name: "B", packageLabel: "200g", grindLabel: "手沖", quantity: 2, price: 200 }]).includes("\n"), "Multiple order items should be separated by newline escape.");
console.assert(new URLSearchParams({ payload: JSON.stringify({ test: true }) }).toString().includes("payload="), "Order submit body should include payload field for Apps Script.");

function FloatingIcons() {
  const items = [
    { icon: Bean, className: "left-[6%] top-[18%]" },
    { icon: Coffee, className: "right-[8%] top-[22%]" },
    { icon: Filter, className: "left-[16%] bottom-[16%]" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
      {items.map(({ icon: Icon, className }, index) => (
        <motion.div key={index} animate={{ y: [0, -12, 0] }} transition={{ duration: 5 + index, repeat: Infinity }} className={`absolute ${className}`}>
          <Icon className="h-20 w-20 text-[#3b2415] md:h-28 md:w-28" />
        </motion.div>
      ))}
    </div>
  );
}

function CoffeeReviewAwardCard() {
  const awards = [
    { title: "93", text: "平衡度與甜感表現優異" },
    { title: "94", text: "精品層次與尾韻高度肯定", highlight: true },
    { title: "5+", text: "穩定烘焙與品牌品質堅持" },
  ];
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1f120b] via-[#5b351d] to-[#c08a49] p-8 text-white shadow-2xl ring-1 ring-[#d8c1a1] md:p-12">
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#f3c178]/20 blur-3xl" />
      <div className="relative z-10">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-[#f3c178]/30 bg-black/20 shadow-2xl">
          <img src={coffeeReviewAwardImage} alt="Coffee Review 高分評鑑榮耀" className="h-auto w-full object-cover" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#f3c178]/60 bg-[#f3c178]/10 shadow-xl">
            <Award className="h-10 w-10 text-[#f3c178]" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-[0.4em] text-[#f3c178]">COFFEE REVIEW</p>
            <h3 className="mt-2 text-4xl font-black md:text-5xl">Coffee Review 評鑑榮耀</h3>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {awards.map((item) => (
            <div key={item.title} className={`rounded-3xl border p-6 text-center ${item.highlight ? "border-[#f3c178]/40 bg-[#f3c178]/10" : "border-white/10 bg-white/10"}`}>
              <p className="text-sm tracking-[0.25em] text-[#f3c178]">COFFEE REVIEW</p>
              <p className={`mt-3 text-5xl font-black ${item.highlight ? "text-[#f3c178]" : ""}`}>{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#fff1df]">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-[2rem] border border-white/10 bg-black/10 p-6 md:p-8">
          <p className="text-sm font-bold tracking-[0.3em] text-[#f3c178]">BRAND PHILOSOPHY</p>
          <h4 className="mt-4 text-2xl font-bold md:text-3xl">一杯咖啡，不只是提神，而是生活裡安定的節奏。</h4>
          <p className="mt-5 leading-8 text-[#fff1df]">攪拌咖啡商行相信，真正好的咖啡，不一定遙不可及。我們將精品咖啡的品質與烘焙穩定性，帶進每一位日常喝咖啡的人生活裡。</p>
          <p className="mt-4 leading-8 text-[#fff1df]">從商用優選豆、精品配方，到 Coffee Review 高分評測豆款，我們堅持風味平衡、乾淨甜感與耐喝性，讓每一次沖煮都能感受到咖啡真正的溫度。</p>
        </div>
      </div>
    </div>
  );
}

export default function CaobanCoffeeHomepage() {
  const [cart, setCart] = useState([]);
  const [pickupMethod, setPickupMethod] = useState("7-11 賣貨便");
  const [selectedProductCategory, setSelectedProductCategory] = useState("全部商品");
  const [selectedPackages, setSelectedPackages] = useState(() => Object.fromEntries(products.map((product) => [product.id, product.packageOptions[0]])));
  const [selectedGrinds, setSelectedGrinds] = useState(() => Object.fromEntries(products.map((product) => [product.id, product.grindOptions[0] || "不需研磨"])));
  const [checkoutForm, setCheckoutForm] = useState({ pickupStore: "", recipient: "", phone: "", email: "", taxId: "", companyTitle: "", note: "", socialAccount: "" });
  const [currentInfoSlide, setCurrentInfoSlide] = useState(0);
  const [storeKeyword, setStoreKeyword] = useState("");
  const [remoteStores, setRemoteStores] = useState([]);
  const [storeDataStatus, setStoreDataStatus] = useState("loading");
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [orderSubmitStatus, setOrderSubmitStatus] = useState("idle");
  const [checkoutErrors, setCheckoutErrors] = useState({});

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const discountedSubtotal = useMemo(() => Math.round(cartSubtotal * 0.9), [cartSubtotal]);
  const shippingFee = useMemo(() => (cart.length === 0 ? 0 : discountedSubtotal >= 1000 ? 0 : 38), [cart.length, discountedSubtotal]);
  const cartTotal = useMemo(() => discountedSubtotal + shippingFee, [discountedSubtotal, shippingFee]);
  const isCheckoutBelowMinimum = cart.length > 0 && cartTotal < minimumCheckoutTotal;
  const checkoutDisabled = cart.length === 0 || isCheckoutBelowMinimum;
  const filteredProducts = selectedProductCategory === "全部商品" ? products : products.filter((product) => product.category === selectedProductCategory);
  const currentSlide = infoSlides[currentInfoSlide];
  const storeSource = remoteStores.length > 0 ? remoteStores : convenienceStores;
  const filteredStores = useMemo(() => {
    const keyword = storeKeyword.trim().toLowerCase();
    if (!keyword) return storeSource.slice(0, 8);
    return storeSource
      .filter((store) => `${store.name} ${store.id} ${store.city || ""} ${store.district || ""} ${store.address}`.toLowerCase().includes(keyword))
      .slice(0, 12);
  }, [storeKeyword, storeSource]);

  useEffect(() => {
    let isMounted = true;
    async function loadSevenElevenStores() {
      try {
        setStoreDataStatus("loading");
        const response = await fetch(sevenElevenStoresJsonUrl);
        if (!response.ok) throw new Error("門市資料載入失敗");
        const data = await response.json();
        const stores = Object.entries(data).map(([id, value]) => {
          const raw = value || {};
          const storeName = raw.store || raw.name || "";
          const address = raw.address || "";
          const cityMatch = address.match(/^(台北市|新北市|桃園市|台中市|台南市|高雄市|基隆市|新竹市|嘉義市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣)/);
          return {
            id,
            name: storeName.startsWith("7-11") ? storeName : `7-11 ${storeName}門市`,
            city: cityMatch?.[0] || "",
            district: "",
            address,
          };
        });
        if (isMounted) {
          setRemoteStores(stores);
          setStoreDataStatus("ready");
        }
      } catch {
        if (isMounted) {
          setRemoteStores([]);
          setStoreDataStatus("fallback");
        }
      }
    }
    loadSevenElevenStores();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleCheckoutForm(field, value) {
    setCheckoutForm((current) => ({ ...current, [field]: value }));
    setCheckoutErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validateCheckoutForm() {
    const requiredFields = [
      ["recipient", "請填寫收件人姓名"],
      ["phone", "請填寫手機號碼"],
      ["email", "請填寫 Email"],
      ["pickupStore", "請選擇或填寫超商門市"],
    ];
    const errors = Object.fromEntries(
      requiredFields.filter(([field]) => !checkoutForm[field].trim()).map(([field, message]) => [field, message])
    );
    const { storeId } = parsePickupStore(checkoutForm.pickupStore);

    if (checkoutForm.pickupStore.trim() && !isValidStoreId(storeId)) {
      errors.pickupStore = "請從門市清單選擇有效的 7-11 門市，避免賣貨便店號空白";
    }

    setCheckoutErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handlePackageChange(productId, selectedLabel) {
    const product = products.find((item) => item.id === productId);
    const selectedOption = product?.packageOptions.find((option) => option.label === selectedLabel);
    if (!selectedOption) return;
    setSelectedPackages((current) => ({ ...current, [productId]: selectedOption }));
  }

  function handleGrindChange(productId, selectedGrind) {
    setSelectedGrinds((current) => ({ ...current, [productId]: selectedGrind }));
  }

  function getCartQuantity(productId) {
    const selectedPackage = selectedPackages[productId];
    const selectedGrind = selectedGrinds[productId] || "不需研磨";
    if (!selectedPackage) return 0;
    const cartId = makeCartId(productId, selectedPackage.label, selectedGrind);
    return cart.find((item) => item.cartId === cartId)?.quantity ?? 0;
  }

  function addToCart(product) {
    const selectedPackage = selectedPackages[product.id] || product.packageOptions[0];
    const selectedGrind = selectedGrinds[product.id] || "不需研磨";
    const cartId = makeCartId(product.id, selectedPackage.label, selectedGrind);
    setCart((current) => {
      const exists = current.find((item) => item.cartId === cartId);
      if (exists) {
        return current.map((item) => (item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [
        ...current,
        {
          ...product,
          cartId,
          packageLabel: selectedPackage.label,
          grindLabel: selectedGrind,
          price: selectedPackage.price,
          quantity: 1,
        },
      ];
    });
  }

  function updateQuantity(cartId, nextQuantity) {
    if (nextQuantity <= 0) {
      setCart((current) => current.filter((item) => item.cartId !== cartId));
      return;
    }
    setCart((current) => current.map((item) => (item.cartId === cartId ? { ...item, quantity: nextQuantity } : item)));
  }

  function selectStore(store) {
    const storeText = `${store.name}｜${store.id}｜${store.address}`;
    handleCheckoutForm("pickupStore", storeText);
    setStoreKeyword(`${store.name} ${store.address}`);
  }

  function openOrderConfirm() {
    if (cart.length === 0) return;
    if (cartTotal < minimumCheckoutTotal) return;
    if (!validateCheckoutForm()) return;
    setOrderSubmitStatus("idle");
    setShowOrderConfirm(true);
  }

  function buildOrderPayload() {
    const items = buildOrderItemsText(cart);
    const lineItems = buildOrderLineItems(cart);
    const itemSummary = cart.map((item) => `${item.name} ${item.packageLabel} ${item.grindLabel} x${item.quantity}`).join("；");
    const { storeName, storeId, storeAddress } = parsePickupStore(checkoutForm.pickupStore);
    const orderTime = new Date().toLocaleString("zh-TW", { hour12: false });
    const shippingText = shippingFee === 0 ? "免運" : currency(shippingFee);
    const productNote = `${itemSummary}${checkoutForm.note ? `｜備註：${checkoutForm.note}` : ""}`;

    return {
      "時間戳記": orderTime,
      "電子郵件地址": checkoutForm.email,
      "取件人姓名": checkoutForm.recipient,
      "取件人手機": checkoutForm.phone,
      "Email": checkoutForm.email,
      "取件門市": checkoutForm.pickupStore,
      "統一編號": checkoutForm.taxId,
      "公司抬頭": checkoutForm.companyTitle,
      "溫層": "常溫",
      "訂單金額": cartTotal,
      "備註": checkoutForm.note,
      "商品": items,
      "運費金額": shippingFee,
      "買家下訂日期": orderTime,
      "商品備註": productNote,
      "其他資訊(FB/LINE/IG帳號)": checkoutForm.socialAccount,
      orderTime,
      recipient: checkoutForm.recipient,
      phone: checkoutForm.phone,
      email: checkoutForm.email,
      pickupStore: checkoutForm.pickupStore,
      storeName,
      storeId,
      storeAddress,
      items,
      itemSummary,
      lineItems,
      subtotal: currency(cartSubtotal),
      discount: currency(cartSubtotal - discountedSubtotal),
      shippingFee: shippingText,
      total: currency(cartTotal),
      totalNumber: cartTotal,
      taxId: checkoutForm.taxId,
      companyTitle: checkoutForm.companyTitle,
      note: checkoutForm.note,
      socialAccount: checkoutForm.socialAccount,
      myshipRecipientName: checkoutForm.recipient,
      myshipRecipientPhone: checkoutForm.phone,
      myshipStoreId: storeId,
      myshipStoreName: storeName,
      myshipStoreAddress: storeAddress,
      myshipRemark: productNote,
    };
  }

  function closeOrderComplete() {
    setShowOrderConfirm(false);
    setCart([]);
    setOrderSubmitStatus("idle");
  }

  async function submitOrder() {
    if (cart.length === 0 || orderSubmitStatus === "submitting") return;
    if (cartTotal < minimumCheckoutTotal) return;
    try {
      setOrderSubmitStatus("submitting");
      const formBody = new URLSearchParams();
      formBody.append("payload", JSON.stringify(buildOrderPayload()));
      await fetch(orderApiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: formBody.toString(),
      });
      setOrderSubmitStatus("success");
    } catch {
      setOrderSubmitStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-[#f6efe4] text-[#2a1a10]">
      {cart.length > 0 && !showOrderConfirm && (
        <aside
          aria-label="已選購商品"
          className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md rounded-2xl border border-[#dccbb2] bg-[#fff8ec]/95 p-4 text-[#2a1a10] shadow-2xl backdrop-blur md:inset-x-auto md:bottom-auto md:right-6 md:top-24 md:w-96"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-[#8a603b]">SELECTED</p>
              <h2 className="mt-1 text-lg font-bold">已選購商品</h2>
            </div>
            <div className="rounded-full bg-[#efe2cf] px-3 py-1 text-sm font-bold text-[#7a4c2b]">
              {cartCount} 件
            </div>
          </div>

          <div className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.cartId} className="grid grid-cols-[56px_1fr_auto] gap-3 rounded-xl bg-[#f6efe4] p-2">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg bg-white object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{item.name}</p>
                  <p className="mt-1 truncate text-xs text-[#66513f]">{item.packageLabel}</p>
                  <p className="mt-1 text-sm font-bold text-[#7a4c2b]">{currency(item.price * item.quantity)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                    className="rounded-full bg-white p-1.5 text-[#2a1a10] shadow-sm"
                    aria-label={`減少 ${item.name} 數量`}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                    className="rounded-full bg-[#f3c178] p-1.5 text-[#2a1a10] shadow-sm"
                    aria-label={`增加 ${item.name} 數量`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.cartId, 0)}
                    className="rounded-full bg-white p-1.5 text-[#8a3d2b] shadow-sm"
                    aria-label={`移除 ${item.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-[#dccbb2] pt-3">
            <div className="flex items-center justify-between text-sm text-[#66513f]">
              <span>優惠後含運</span>
              <span className="text-lg font-black text-[#2a1a10]">{currency(cartTotal)}</span>
            </div>
            <a
              href="#cart"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#2a1a10] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#4b2d1a]"
            >
              前往結帳 <ShoppingCart className="ml-2 h-4 w-4" />
            </a>
          </div>
        </aside>
      )}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2a1a10] via-[#4b2d1a] to-[#8a603b] text-[#fff8ec]">
        <FloatingIcons />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm tracking-[0.35em] text-[#e8c89d]">CAOBAN COFFEE</p>
            <h1 className="text-xl font-semibold">攪拌咖啡商行</h1>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <a href="#cart" className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white"><ShoppingCart className="mr-2 h-4 w-4" /> 購物車 {cartCount}</a>
            <a href={shopeeUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#f3c178] px-5 py-2 text-sm font-semibold text-[#2a1a10] shadow-lg transition hover:scale-105">前往蝦皮商城</a>
          </div>
        </nav>
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 inline-flex rounded-full border border-[#f3c178]/40 px-4 py-2 text-sm text-[#f3c178]">專屬 7-11 賣貨便超商取貨方案</p>
            <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">未眠的夜裡，也值得一杯真正安定你的咖啡</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f8e7cf]">未眠，不只是深夜，而是每一位仍在為生活奔波的人。攪拌咖啡商行希望用一杯穩定、真實、有溫度的咖啡，陪伴每個還在努力前進的時刻。</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#products" className="inline-flex items-center justify-center rounded-full bg-[#f3c178] px-7 py-4 font-bold text-[#2a1a10] shadow-xl transition hover:scale-105">開始選購 <ChevronRight className="ml-2 h-5 w-5" /></a>
              <a href="#cart" className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 font-semibold text-white transition hover:bg-white/10">查看購物車</a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-[#f3c178]/20 blur-2xl" />
            <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80" alt="咖啡豆與精品咖啡器材" className="relative h-[420px] w-full rounded-[2.5rem] object-cover shadow-2xl" />
          </motion.div>
        </div>
      </section>

      <section className="bg-[#efe2cf] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-bold tracking-[0.3em] text-[#8a603b]">COFFEE REVIEW AWARDS</p>
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">Coffee Review 評鑑榮耀</h2>
              <p className="mt-6 text-lg leading-9 text-[#5c4531]">Coffee Review 是國際知名精品咖啡評測平台，能獲得 90 分以上，代表咖啡在甜感、乾淨度、平衡與層次表現上，已達國際精品等級。</p>
              <p className="mt-5 text-lg leading-9 text-[#5c4531]">攪拌咖啡商行累積多次 93、94 高分評測肯定，我們不追求過度華麗，而是專注於每一次沖煮都能呈現穩定、耐喝、具有記憶點的風味。</p>
              <p className="mt-5 text-lg leading-9 text-[#5c4531]">希望讓更多人用合理價格，也能接觸真正具有國際精品水準的咖啡體驗。</p>
            </div>
            <CoffeeReviewAwardCard />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f7efe3] px-6 py-16">
        <div className="relative mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl ring-1 ring-[#dccbb2]">
            <motion.div key={currentSlide.title} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="relative min-h-[420px] overflow-hidden md:min-h-[620px]">
              <img src={currentSlide.image} alt={currentSlide.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 px-6 pb-8 pt-24 md:px-10">
                <button type="button" onClick={() => setCurrentInfoSlide((current) => (current === 0 ? infoSlides.length - 1 : current - 1))} className="rounded-full border border-white/30 bg-black/20 px-5 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/10">上一張</button>
                <div className="flex gap-2">
                  {infoSlides.map((slide, index) => (
                    <button key={slide.title} type="button" onClick={() => setCurrentInfoSlide(index)} aria-label={`切換到 ${slide.title}`} className={`h-2.5 rounded-full transition-all ${currentInfoSlide === index ? "w-10 bg-white" : "w-2.5 bg-white/40"}`} />
                  ))}
                </div>
                <button type="button" onClick={() => setCurrentInfoSlide((current) => (current === infoSlides.length - 1 ? 0 : current + 1))} className="rounded-full border border-white/30 bg-black/20 px-5 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/10">下一張</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold tracking-[0.3em] text-[#8a603b]">SHOP BY CATEGORY</p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">商品分類選購</h2>
          </div>
          <a href={shopeeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center font-bold text-[#7a4c2b]">查看蝦皮商城 <ChevronRight className="ml-1 h-5 w-5" /></a>
        </div>
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-[#dccbb2] transition hover:-translate-y-1 hover:shadow-xl">
              <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <p className="text-sm font-semibold text-[#8a603b]">{item.subtitle}</p>
                <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
                <p className="mt-4 leading-7 text-[#66513f]">{item.description}</p>
                <a href="#featured-products" className="mt-6 inline-flex items-center rounded-full bg-[#2a1a10] px-5 py-3 text-sm font-bold text-white">進入商品 <ShoppingBag className="ml-2 h-4 w-4" /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="featured-products" className="bg-[#2a1a10] px-6 py-20 text-[#fff8ec]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold tracking-[0.3em] text-[#f3c178]">COFFEE ORDER LIST</p>
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">選擇咖啡豆</h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#dcc7ad]">我們相信，一杯真正好的咖啡，應該在第一口，就讓人記住。攪拌咖啡商行精選世界各地精品咖啡豆，從日常耐喝的中深焙，到具有花香、果韻與特殊發酵風味的精品豆款，皆以穩定烘焙與乾淨風味為核心。現在開始選購，挑選屬於你的風味。</p>
            </div>
            <div className="rounded-full bg-[#f3c178]/10 px-5 py-3 text-sm font-bold text-[#f3c178]">{cartCount} 件｜優惠後 {currency(cartTotal)}</div>
          </div>
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
            {productCategoryTabs.map((category) => (
              <button key={category} type="button" onClick={() => setSelectedProductCategory(category)} className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition ${selectedProductCategory === category ? "bg-[#f3c178] text-[#2a1a10]" : "bg-white/10 text-[#fff8ec] hover:bg-white/15"}`}>{category}</button>
            ))}
          </div>
          {filteredProducts.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-[#3a2518] p-10 text-center text-[#dcc7ad]">此分類目前暫時清空，後續可加入新品項。</div>
          ) : (
            <div className="overflow-hidden rounded-[2rem] bg-[#3a2518] shadow-2xl ring-1 ring-white/10">
              <div className="hidden grid-cols-[180px_1.3fr_0.8fr_0.75fr_0.8fr] gap-5 border-b border-white/10 bg-white/5 px-6 py-4 text-sm font-bold tracking-[0.15em] text-[#dcc7ad] md:grid"><span>圖片</span><span>品項 / 規格</span><span>分類 / 烘焙</span><span>價格</span><span className="text-right">選購</span></div>
              <div className="divide-y divide-white/10">
                {filteredProducts.map((product) => {
                  const selectedPackage = selectedPackages[product.id] || product.packageOptions[0];
                  const selectedGrind = selectedGrinds[product.id] || "不需研磨";
                  const cartId = makeCartId(product.id, selectedPackage.label, selectedGrind);
                  const quantity = getCartQuantity(product.id);
                  return (
                    <article key={product.id} className="grid gap-5 px-5 py-6 transition hover:bg-white/5 md:grid-cols-[180px_1.3fr_0.8fr_0.75fr_0.8fr] md:items-center md:px-6">
                      <img src={product.image} alt={product.name} className="h-56 w-full rounded-2xl bg-white object-contain p-2 shadow-lg md:h-52 md:w-[180px]" />
                      <div>
                        <div className="mb-2 inline-flex rounded-full bg-[#f3c178]/10 px-3 py-1 text-xs font-bold text-[#f3c178] md:hidden">{product.category}</div>
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#f3c178]">{product.taste}</p>
                        <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                          <p className="mb-3 text-xs font-bold tracking-[0.15em] text-[#dcc7ad]">各品項條列</p>
                          <div className="max-h-52 overflow-y-auto rounded-xl bg-white/5 p-3">
                            <ul className="space-y-2 text-sm text-[#fff1df]">
                              {product.packageOptions.map((option) => (
                                <li key={option.label} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 transition ${selectedPackage.label === option.label ? "bg-[#f3c178] text-[#2a1a10]" : "bg-white/5 hover:bg-white/10"}`} onClick={() => handlePackageChange(product.id, option.label)}>
                                  <span>{option.label}</span><span className="shrink-0 font-bold">{currency(option.price)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-xs font-bold tracking-[0.15em] text-[#dcc7ad]">{product.category === "濾掛咖啡" ? "一包" : product.weight.includes("半磅") ? "半磅 / 品項選單" : product.weight.includes("一磅") ? "一磅 / 品項選單" : "包裝 / 品項選單"}</label>
                            <select value={selectedPackage.label} onChange={(event) => handlePackageChange(product.id, event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f3c178]">
                              {product.packageOptions.map((option) => (<option key={option.label} value={option.label} className="text-black">{option.label}｜{currency(option.price)}</option>))}
                            </select>
                          </div>
                          {product.grindOptions.length > 0 && (
                            <div>
                              <label className="mb-2 block text-xs font-bold tracking-[0.15em] text-[#dcc7ad]">研磨方式</label>
                              <select value={selectedGrind} onChange={(event) => handleGrindChange(product.id, event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f3c178]">
                                {product.grindOptions.map((option) => (<option key={option} value={option} className="text-black">{option}</option>))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-[#dcc7ad]"><p className="font-bold text-[#fff8ec]">{product.category}</p><p className="mt-2">{product.roast}</p><p className="mt-1">{product.weight}</p></div>
                      <div><p className="text-2xl font-bold text-[#f3c178]">{currency(selectedPackage.price)}</p><p className="mt-1 text-xs text-[#dcc7ad]">{selectedPackage.label}</p>{product.grindOptions.length > 0 && <p className="mt-1 text-xs text-[#dcc7ad]">{selectedGrind}</p>}</div>
                      <div className="flex items-center justify-start gap-3 md:justify-end">
                        {quantity > 0 ? (
                          <div className="flex items-center gap-2 rounded-full bg-white/10 p-1">
                            <button type="button" onClick={() => updateQuantity(cartId, quantity - 1)} className="rounded-full bg-white p-2 text-[#2a1a10]" aria-label={`減少 ${product.name} 數量`}><Minus className="h-4 w-4" /></button>
                            <span className="w-8 text-center font-bold">{quantity}</span>
                            <button type="button" onClick={() => updateQuantity(cartId, quantity + 1)} className="rounded-full bg-[#f3c178] p-2 text-[#2a1a10]" aria-label={`增加 ${product.name} 數量`}><Plus className="h-4 w-4" /></button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => addToCart(product)} className="inline-flex items-center justify-center rounded-full bg-[#f3c178] px-5 py-3 font-bold text-[#2a1a10] transition hover:scale-[1.02]">加入 <Plus className="ml-2 h-4 w-4" /></button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="cart" className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-[#dccbb2] md:p-10">
            <div className="mb-8 flex items-center justify-between"><div><p className="text-sm font-bold tracking-[0.3em] text-[#8a603b]">CART</p><h2 className="mt-2 text-3xl font-bold">購物車</h2></div><div className="rounded-full bg-[#efe2cf] px-4 py-2 text-sm font-bold text-[#7a4c2b]">{cartCount} 件商品</div></div>
            {cart.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#cdb99e] bg-[#f6efe4] p-8 text-center text-[#66513f]">目前購物車是空的，請先到推薦商品加入咖啡豆或濾掛咖啡。</div>
            ) : (
              <div className="space-y-5">
                {cart.map((item) => (
                  <div key={item.cartId} className="grid gap-4 rounded-3xl bg-[#f6efe4] p-4 md:grid-cols-[96px_1fr_auto] md:items-center">
                    <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                    <div><h3 className="font-bold">{item.name}</h3><p className="mt-1 text-sm text-[#66513f]">{item.taste}</p><p className="mt-1 text-xs font-bold text-[#8a603b]">{item.packageLabel}</p><p className="mt-1 text-xs text-[#66513f]">{item.grindLabel}</p><p className="mt-2 font-bold text-[#7a4c2b]">{currency(item.price)}</p></div>
                    <div className="flex items-center gap-3"><button type="button" onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="rounded-full bg-white p-2 shadow-sm" aria-label="減少數量"><Minus className="h-4 w-4" /></button><span className="w-8 text-center font-bold">{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="rounded-full bg-white p-2 shadow-sm" aria-label="增加數量"><Plus className="h-4 w-4" /></button><button type="button" onClick={() => updateQuantity(item.cartId, 0)} className="rounded-full bg-white p-2 text-[#8a3d2b] shadow-sm" aria-label="移除商品"><Trash2 className="h-4 w-4" /></button></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] bg-[#8a603b] p-7 text-white shadow-xl md:p-10">
            <p className="text-sm font-bold tracking-[0.3em] text-[#f3c178]">CHECKOUT</p><h2 className="mt-2 text-3xl font-bold">超商取貨結帳</h2>
            <div className="mt-5 rounded-2xl border border-[#f3c178]/30 bg-[#f3c178]/10 p-4 text-[#fff1df]"><p className="text-sm font-bold text-[#f3c178]">優惠活動</p><ul className="mt-2 space-y-1 text-sm leading-7"><li>• 全館商品 9 折優惠</li><li>• 7-11 賣貨便運費 38 元</li><li>• 折扣後滿 1,000 元享免運</li><li>7-11 賣貨便為貨到付款，取貨時再付款。</li></ul></div>
            <div className="mt-8 space-y-4">
              {["7-11 賣貨便"].map((method) => (<button key={method} type="button" onClick={() => setPickupMethod(method)} className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left font-bold transition ${pickupMethod === method ? "border-[#f3c178] bg-[#f3c178] text-[#2a1a10]" : "border-white/20 bg-white/10 text-white hover:bg-white/15"}`}><span className="inline-flex items-center"><MapPin className="mr-2 h-5 w-5" />{method}</span><ChevronRight className="h-5 w-5" /></button>))}
            </div>
            <div className="mt-8 rounded-3xl bg-white/10 p-6">
              <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#f3c178]">收件與發票資訊</p>
              <div className="space-y-4">
                <input type="text" required aria-invalid={Boolean(checkoutErrors.recipient)} placeholder="收件人姓名（必填）" value={checkoutForm.recipient} onChange={(event) => handleCheckoutForm("recipient", event.target.value)} className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none ${checkoutErrors.recipient ? "border-[#ffb4a8]" : "border-white/20"}`} />
                {checkoutErrors.recipient && <p className="-mt-2 text-sm font-bold text-[#ffcfca]">{checkoutErrors.recipient}</p>}
                <input type="text" required aria-invalid={Boolean(checkoutErrors.phone)} placeholder="手機號碼（必填）" value={checkoutForm.phone} onChange={(event) => handleCheckoutForm("phone", event.target.value)} className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none ${checkoutErrors.phone ? "border-[#ffb4a8]" : "border-white/20"}`} />
                {checkoutErrors.phone && <p className="-mt-2 text-sm font-bold text-[#ffcfca]">{checkoutErrors.phone}</p>}
                <input type="email" required aria-invalid={Boolean(checkoutErrors.email)} placeholder="Email（必填）" value={checkoutForm.email} onChange={(event) => handleCheckoutForm("email", event.target.value)} className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none ${checkoutErrors.email ? "border-[#ffb4a8]" : "border-white/20"}`} />
                {checkoutErrors.email && <p className="-mt-2 text-sm font-bold text-[#ffcfca]">{checkoutErrors.email}</p>}
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <div><p className="font-bold text-[#f3c178]">超商門市</p><p className="mt-1 text-xs leading-6 text-[#fff1df]">可輸入門市名稱、店號、城市或地址關鍵字，系統會搜尋全台 7-11 門市資料並自動帶入地址。</p><p className="mt-1 text-xs leading-6 text-[#f3c178]">{storeDataStatus === "loading" ? "門市資料載入中…" : storeDataStatus === "ready" ? `已載入 ${remoteStores.length.toLocaleString("zh-TW")} 間門市資料` : "目前使用備用門市清單，若查不到可改用更多關鍵字搜尋。"}</p></div>
                  <input type="text" placeholder="搜尋門市名稱 / 店號 / 地址，例如：勤美、台中、西區" value={storeKeyword} onChange={(event) => setStoreKeyword(event.target.value)} className="mt-4 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none" />
                  <div className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-2xl bg-black/10 p-3">
                    {filteredStores.length === 0 ? (<p className="px-3 py-2 text-sm text-[#fff1df]">目前找不到符合的門市，請換店名、店號、路名或縣市關鍵字搜尋。</p>) : filteredStores.map((store) => (<button key={store.id} type="button" onClick={() => selectStore(store)} className="w-full rounded-xl bg-white/10 px-4 py-3 text-left transition hover:bg-[#f3c178] hover:text-[#2a1a10]"><span className="block text-sm font-bold">{store.name}｜{store.id}</span><span className="mt-1 block text-xs leading-5">{store.address}</span></button>))}
                  </div>
                  <input type="text" required aria-invalid={Boolean(checkoutErrors.pickupStore)} placeholder="已選門市 / 店號 / 地址（必填）" value={checkoutForm.pickupStore} onChange={(event) => handleCheckoutForm("pickupStore", event.target.value)} className={`mt-3 w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none ${checkoutErrors.pickupStore ? "border-[#ffb4a8]" : "border-white/20"}`} />
                  {checkoutErrors.pickupStore && <p className="mt-2 text-sm font-bold text-[#ffcfca]">{checkoutErrors.pickupStore}</p>}
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4"><p className="text-sm font-bold text-[#f3c178]">發票資訊</p><p className="mt-1 text-xs leading-6 text-[#fff1df]">目前是免用統一發票，有需要的請留下統一編號及抬頭，會隨貨附上。</p></div>
                <div className="grid gap-4 md:grid-cols-2"><input type="text" placeholder="統一編號" value={checkoutForm.taxId} onChange={(event) => handleCheckoutForm("taxId", event.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none" /><input type="text" placeholder="公司抬頭" value={checkoutForm.companyTitle} onChange={(event) => handleCheckoutForm("companyTitle", event.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none" /></div>
                <input type="text" placeholder="其他資訊（FB / LINE / IG 帳號，可留空）" value={checkoutForm.socialAccount} onChange={(event) => handleCheckoutForm("socialAccount", event.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none" />
                <textarea placeholder="訂單備註" value={checkoutForm.note} onChange={(event) => handleCheckoutForm("note", event.target.value)} rows={4} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none" />
              </div>
              <div className="mt-8 border-t border-white/20 pt-5"><div className="flex justify-between text-[#fff1df]"><span>商品數量</span><span>{cartCount} 件</span></div><div className="mt-4 flex justify-between text-[#fff1df]"><span>商品原價</span><span>{currency(cartSubtotal)}</span></div><div className="mt-4 flex justify-between font-bold text-[#7CFFB2]"><span>全館 9 折優惠</span><span>- {currency(cartSubtotal - discountedSubtotal)}</span></div><div className="mt-4 flex justify-between text-[#fff1df]"><span>折扣後小計</span><span>{currency(discountedSubtotal)}</span></div><div className="mt-4 flex justify-between text-[#fff1df]"><span>超商運費</span><span>{shippingFee === 0 ? "免運" : currency(shippingFee)}</span></div><div className="mt-4 border-t border-white/20 pt-4 text-sm leading-7 text-[#fff1df]">7-11 賣貨便每筆訂單運費 38 元，折扣後滿 1,000 元享免運優惠。全館商品目前享 9 折優惠活動。</div><div className="mt-5 flex justify-between text-2xl font-bold"><span>總計</span><span>{currency(cartTotal)}</span></div></div>
            </div>
            {isCheckoutBelowMinimum && <p className="mt-4 rounded-2xl border border-[#ffcfca]/40 bg-[#ffcfca]/10 px-4 py-3 text-sm font-bold leading-6 text-[#ffcfca]">結帳最低消費為 {currency(minimumCheckoutTotal)}，目前還差 {currency(minimumCheckoutTotal - cartTotal)}。</p>}
            <button type="button" onClick={openOrderConfirm} disabled={checkoutDisabled} className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-4 font-bold transition ${checkoutDisabled ? "cursor-not-allowed bg-white/30 text-white/60" : "bg-white text-[#5a341d] hover:scale-[1.02]"}`}>立即下單</button>
            <a href={shopeeUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/25 px-6 py-4 font-bold text-white transition hover:bg-white/10">或改到蝦皮商城下單</a>
          </aside>
        </div>
      </section>

      {showOrderConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-[#fff8ec] p-6 text-[#2a1a10] shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#dccbb2] pb-5"><div><p className="text-sm font-bold tracking-[0.3em] text-[#8a603b]">{orderSubmitStatus === "success" ? "ORDER COMPLETE" : "ORDER CONFIRM"}</p><h2 className="mt-2 text-3xl font-bold">{orderSubmitStatus === "success" ? "訂購完成" : "請確認訂單內容"}</h2><p className="mt-2 text-sm leading-6 text-[#66513f]">{orderSubmitStatus === "success" ? "謝謝您的訂購，我們已收到您的咖啡訂單，接下來會用心為您準備每一份香氣。" : "確認商品、收件資料與取貨門市無誤後，再送出訂單。"}</p></div><button type="button" onClick={orderSubmitStatus === "success" ? closeOrderComplete : () => setShowOrderConfirm(false)} className="rounded-full bg-[#efe2cf] px-4 py-2 text-sm font-bold text-[#5a341d]">關閉</button></div>
            <div className="mt-6 space-y-4">{cart.map((item) => (<div key={item.cartId} className="rounded-2xl bg-[#f6efe4] p-4"><div className="flex justify-between gap-4"><div><p className="font-bold">{item.name}</p><p className="mt-1 text-sm text-[#66513f]">{item.packageLabel}</p><p className="mt-1 text-sm text-[#66513f]">{item.grindLabel}</p></div><div className="text-right"><p className="font-bold">{currency(item.price)} × {item.quantity}</p><p className="mt-1 text-sm text-[#8a603b]">{currency(item.price * item.quantity)}</p></div></div></div>))}</div>
            <div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-[#dccbb2] bg-white p-5"><p className="font-bold text-[#8a603b]">收件資料</p><div className="mt-3 space-y-2 text-sm leading-6 text-[#5c4531]"><p>收件人：{checkoutForm.recipient || "尚未填寫"}</p><p>手機：{checkoutForm.phone || "尚未填寫"}</p><p>Email：{checkoutForm.email || "尚未填寫"}</p><p>取貨門市：{checkoutForm.pickupStore || "尚未選擇"}</p><p className="mt-3 rounded-xl bg-[#f6efe4] px-3 py-2 text-xs font-bold text-[#8a603b]">7-11 賣貨便為貨到付款，取貨時再付款。</p></div></div><div className="rounded-2xl border border-[#dccbb2] bg-white p-5"><p className="font-bold text-[#8a603b]">發票與備註</p><div className="mt-3 space-y-2 text-sm leading-6 text-[#5c4531]"><p>統一編號：{checkoutForm.taxId || "無"}</p><p>公司抬頭：{checkoutForm.companyTitle || "無"}</p><p>備註：{checkoutForm.note || "無"}</p><p>其他資訊：{checkoutForm.socialAccount || "無"}</p></div></div></div>
            <div className="mt-6 rounded-2xl bg-[#2a1a10] p-5 text-white"><div className="flex justify-between text-sm text-[#fff1df]"><span>商品原價</span><span>{currency(cartSubtotal)}</span></div><div className="mt-3 flex justify-between text-sm font-bold text-[#7CFFB2]"><span>全館 9 折優惠</span><span>- {currency(cartSubtotal - discountedSubtotal)}</span></div><div className="mt-3 flex justify-between text-sm text-[#fff1df]"><span>折扣後小計</span><span>{currency(discountedSubtotal)}</span></div><div className="mt-3 flex justify-between text-sm text-[#fff1df]"><span>超商運費</span><span>{shippingFee === 0 ? "免運" : currency(shippingFee)}</span></div><div className="mt-4 flex justify-between border-t border-white/20 pt-4 text-2xl font-bold"><span>總計</span><span>{currency(cartTotal)}</span></div></div>
            {orderSubmitStatus === "success" && <div className="mt-6 rounded-[2rem] border border-[#b8d8ba] bg-[#e8f5e9] p-6 text-center text-[#2e7d32]"><p className="text-2xl font-black">訂單已順利送出</p><p className="mt-3 text-sm font-bold leading-7">感謝您把今天的咖啡時光交給攪拌咖啡商行。訂單明細將寄到您的 Email，我們也會同步收到通知並盡快為您安排出貨。</p><p className="mt-3 text-sm leading-7 text-[#3d6b40]">願這份咖啡，在抵達您手中時，剛好成為生活裡最舒服的一段香氣。</p></div>}
            {orderSubmitStatus === "error" && <div className="mt-6 rounded-2xl bg-[#fff0f0] p-4 text-sm font-bold leading-7 text-[#9f2a2a]">訂單送出失敗，請稍後再試，或改用蝦皮商城下單。</div>}
            {orderSubmitStatus === "success" ? (
              <div className="mt-6 flex justify-center">
                <button type="button" onClick={closeOrderComplete} className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-[#8a603b] px-6 py-4 font-bold text-white transition hover:scale-[1.02]">關閉視窗</button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => setShowOrderConfirm(false)} className="inline-flex flex-1 items-center justify-center rounded-full border border-[#8a603b]/30 px-6 py-4 font-bold text-[#5a341d]">返回修改</button><button type="button" onClick={submitOrder} disabled={orderSubmitStatus === "submitting"} className={`inline-flex flex-1 items-center justify-center rounded-full px-6 py-4 font-bold text-white transition ${orderSubmitStatus === "submitting" ? "bg-[#8a603b]/60" : "bg-[#8a603b] hover:scale-[1.02]"}`}>{orderSubmitStatus === "submitting" ? "訂單送出中…" : "確認送出訂單"}</button></div>
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-[#dccbb2] px-6 py-10 text-center text-sm text-[#66513f]"><p className="text-lg font-semibold text-[#4b2d1a]">未眠 WEIMIAN COFFEE</p><p className="mt-3 leading-7">在那些還沒休息的夜晚，願你手中的咖啡，成為支撐生活的一點光。</p><p className="mt-4 text-xs tracking-[0.25em] text-[#8a603b]">© 攪拌咖啡商行 CAOBAN COFFEE｜精品咖啡豆・咖啡器材・超商取貨方案</p></footer>
    </main>
  );
}
