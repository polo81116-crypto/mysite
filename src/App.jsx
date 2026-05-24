import { useEffect, useMemo, useState } from "react";
import { Award, Bean, ChevronRight, Coffee, Filter, MapPin, Minus, Plus, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const shopeeUrl = "https://shopee.tw/caobancoffee?categoryId=100629&entryPoint=ShopByPDP&itemId=49107641936&upstream=search";
const orderApiUrl = "https://script.google.com/macros/s/AKfycbzfN28njwcJeZssEQV5HJnZ7Z9Z-dPmIVP0WNLBZNQz7VUG9VewI6hl29-0ivpJ_DiPQA/exec";
const sevenElevenStoresJsonUrl = `${import.meta.env.BASE_URL}stores.json`;
const coffeeReviewAwardImage = `${import.meta.env.BASE_URL}images/coffee-review-award.png`;
const mediumDarkOnePoundImage = `${import.meta.env.BASE_URL}images/medium-dark-1lb.jpg`;
const mediumDarkHalfPoundImage = `${import.meta.env.BASE_URL}images/medium-dark-half-lb.jpg`;

const categories = [
  {
    title: "??芷鞊?,
    subtitle: "擃?CP ?潘?蝛拙?靘?嚚撣貊?璆凋蝙??,
    description: "?拙??摨擗??極雿恕?撣詨之???桅?瘙?雓?蝛拙??????砍像銵～?,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "蝎曉??鞊?,
    subtitle: "蝎曉??嚚◢?喳像銵∴??????",
    description: "蝎暸蝎曉?????釭?Ｗ?鞊?撘瑁矽???惜甈∟?撟唾﹛憸典??,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "?鞊??",
    subtitle: "?芸振?嚚帘摰◢?喉??亙虜憟賢?",
    description: "???狡?亙虜?鞊?敺???像銵∪?祕瞈?嚗?????桃????憌脩?末??,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "?桐?璆菔?Ｗ?",
    subtitle: "??敺格甈∴?憸典?銵函嚚移???,
    description: "甇文?憿????敺??臬??亙銝?Ｗ??畾???鞊狡??,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Coffee Review閰?鞊?,
    subtitle: "Coffee Review嚚???皜穿?蝎曉?蝡嗆?",
    description: "甇文?憿????敺??臬???Coffee Review 擃?閰葫蝎曉?鞊?,
    image: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "瞈暹??",
    subtitle: "?單??喲ㄡ嚚靘踹嚚撣貉?蝯?,
    description: "?拙?銝????亙虜敹恍?瘜∴?靽?蝎曉??憸典嚗??憿找噶?拇扯?蝛拙??釭??,
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
  },
];

const commercialOnePoundOptions = [
  { label: "?葉瘛晞毀镼??拍劑摨???蝮?, price: 400 },
  { label: "?葉瘛晞???暺??澆毀", price: 400 },
  { label: "?葉瘛晞﹝蝝??嗅??芾 瘞湔?", price: 430 },
  { label: "?葉瘛晞鈭?蝎暸 AA 瘞湔?", price: 430 },
  { label: "?葉瘛晞?急?鈭?璇噸??, price: 390 },
  { label: "?葉瘛晞?曄憭?撌批??楛", price: 400 },
  { label: "?葉瘛晞毀镼?????, price: 350 },
  { label: "?葉瘛晞??圈收??敺桀凝?孵???, price: 350 },
  { label: "?葉瘛晞﹝蝝??嗅??芾 ?交", price: 450 },
  { label: "?葉瘛晞撠??潛撖?, price: 430 },
  { label: "?葉瘛晞側??皞怠?憸冽? SHG", price: 380 },
  { label: "NEW?葉瘛晞毀?輸收 撠?摨?蝝?靚?, price: 490 },
];

const commercialHalfPoundOptions = commercialOnePoundOptions.map((option) => ({
  label: option.label,
  price: Math.round(option.price / 2 + 15),
}));

const formulaBlendOptions = [
  { label: "【深】經典典藏配方", price: 350 },
  { label: "【中深】堅果小子配方", price: 400 },
  { label: "【中深】太妃糖姬配方", price: 450 },
  { label: "【中】冠軍精選配方", price: 500 },
];

const formulaBlendHalfPoundOptions = formulaBlendOptions.map((option) => ({
  label: option.label,
  price: Math.round(option.price / 2 + 15),
}));
const products = [
  {
    id: "shopee-medium-dark-1lb",
    category: "??芷鞊?,
    name: "銝剜楛???銝蝤?",
    roast: "銝剜楛??",
    taste: "銝憟賣??喋??????摰嗥???,
    packageOptions: commercialOnePoundOptions,
    grindOptions: ["銝蝤????嚗?, "2.5 蝤函? / 蝢拙?", "3 蝤函? / ?拙憯?, "8 蝤函? / ??嚗?佗?", "9 蝤函? / 瘜?"],
    weight: "銝蝤? / 454g",
    image: mediumDarkOnePoundImage,
  },
  {
    id: "shopee-medium-dark-half-lb",
    category: "??芷鞊?,
    name: "銝剜楛?????鋆?,
    roast: "銝剜楛??",
    taste: "銝憟賣??喋??????摰嗥????拙??活?岫?撣詨??ㄡ?具?,
    packageOptions: commercialHalfPoundOptions,
    grindOptions: ["??嚗??∪?鞊?", "2.5 蝤函? / 蝢拙?", "3 蝤函? / ?拙憯?, "8 蝤函? / ??嚗?佗?", "9 蝤函? / 瘜?"],
    weight: "??鋆?/ 227g",
    image: mediumDarkHalfPoundImage,
  },
  {
    id: "formula-blend-series",
    category: "配方豆專區",
    name: "配方豆專區 454g",
    roast: "中焙 / 中深焙",
    taste: "四款日常配方豆，提供順口、堅果、焦糖與厚實風味選擇。",
    packageOptions: formulaBlendOptions,
    grindOptions: ["一磅(咖啡原豆)", "2.5 磨粉 / 義式", "3 磨粉 / 摩卡壺", "8 磨粉 / 手沖（推薦）", "9 磨粉 / 法壓"],
    weight: "配方豆系列454g",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "formula-blend-series-half",
    category: "配方豆專區",
    name: "配方豆專區 227g",
    roast: "中焙 / 中深焙",
    taste: "四款日常配方豆的半磅版本，適合少量飲用或多口味並存。",
    packageOptions: formulaBlendHalfPoundOptions,
    grindOptions: ["半磅(咖啡原豆)", "2.5 磨粉 / 義式", "3 磨粉 / 摩卡壺", "8 磨粉 / 手沖（推薦）", "9 磨粉 / 法壓"],
    weight: "配方豆系列227g",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "colombia-hopes-estate-wine-sun",
    category: "蝎曉??鞊?,
    name: "?亙急?鈭?撣??? ???交??",
    roast: "瘛箇???,
    taste: "???潮?????偏?餅????拙??迭?寞??潮憸典?移???⊥?憟質?,
    packageOptions: [
      { label: "100g", price: 160 },
      { label: "200g", price: 300 },
    ],
    grindOptions: ["???", "3 蝤函? / ?拙憯?, "8 蝤函? / ??嚗?佗?", "9 蝤函? / 瘜?"],
    weight: "蝎曉?撠?鋆?,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ethiopia-yirgacheffe-banko-datatu",
    category: "蝎曉??鞊?,
    name: "銵?揣瘥? ?嗅??芸井 ?剖 ????G1 瘞湔?",
    roast: "瘛箇???,
    taste: "???梢???璈?偏?颱嗾瘛函敦蝺鳴?撅?嗅??芸井蝬瘞湔?憸典??,
    packageOptions: [
      { label: "100g", price: 145 },
      { label: "200g", price: 270 },
    ],
    grindOptions: ["???", "3 蝤函? / ?拙憯?, "8 蝤函? / ??嚗?佗?", "9 蝤函? / 瘜?"],
    weight: "蝎曉?撠?鋆?,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "golden-mandheling-drip",
    category: "瞈暹??",
    name: "暺??澆毀 瞈暹??",
    roast: "銝剜楛??",
    taste: "?祕?臬?蝟????偏??,
    packageOptions: [{ label: "?桀?", price: 15 }],
    grindOptions: [],
    weight: "瘥? / 10g",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
];

const productCategoryTabs = ["?券??", ...categories.map((category) => category.title)];
const emptyProductCategories = ["?桐?璆菔?Ｗ?", "Coffee Review閰?鞊?];
const infoSlides = [
  { title: "?祆?銵???, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80" },
  { title: "??蝯??寞?", image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1600&q=80" },
  { title: "Coffee Review 璁桃鞈?", image: coffeeReviewAwardImage },
];

const convenienceStores = [
  { id: "174536", name: "7-11 ?斤??撣?, city: "?唬葉撣?, district: "镼踹?", address: "?唬葉撣正??祉?頝?8?? },
  { id: "132214", name: "7-11 ????撣?, city: "?唬葉撣?, district: "镼踹?", address: "?唬葉撣正?銝剛?銵?83?? },
  { id: "194820", name: "7-11 撣??撣?, city: "?唬葉撣?, district: "镼踹扈?", address: "?唬葉撣正撅臬??箇憭折?銝挾99?? },
  { id: "118625", name: "7-11 ?Ｙ?撣?, city: "?唬葉撣?, district: "镼踹扈?", address: "?唬葉撣正撅臬?蝳?頝?27?? },
  { id: "105397", name: "7-11 銝銝剝?撣?, city: "?唬葉撣?, district: "??", address: "?唬葉撣??銝銝剛?98?? },
  { id: "200861", name: "7-11 ?啣?蝡??撣?, city: "?啣?撣?, district: "銝剜迤?", address: "?啣?撣葉甇??敹?镼輯楝銝畾?9?? },
  { id: "221093", name: "7-11 靽∠儔?撣?, city: "?啣?撣?, district: "靽∠儔?", address: "?啣?撣縑蝢拙??曉ˊ頝?1?? },
  { id: "186503", name: "7-11 擃?蝢?撜園?撣?, city: "擃?撣?, district: "?啗??", address: "擃?撣??銝剖控銝頝?15?? },
];

function currency(value) {
  return new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 }).format(value);
}

function makeCartId(productId, packageLabel, grindLabel = "銝??ㄗ") {
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
    .map((item) => `${item.name}嚚?{item.packageLabel}嚚?{item.grindLabel}嚚?{item.quantity}隞塚??桀${currency(item.price)}嚚?閮?{currency(item.price * item.quantity)}`)
    .join("\n");
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
  const premiumCoffeeProductsExist = products.filter((product) => product.category === "蝎曉??鞊?).length === 2;
  const formulaBlendProductsExist =
    products.filter((product) => product.category === "?鞊??").length === 2 &&
    products.find((product) => product.id === "formula-blend-series")?.packageOptions.length === 4 &&
    products.find((product) => product.id === "formula-blend-series-half")?.packageOptions.length === 4;
  return Boolean(
    categoryFieldsValid &&
      productFieldsValid &&
      productIdsUnique &&
      productCategoriesExist &&
      dripOnlySinglePack &&
      categories.length === 6 &&
      products.length >= 8 &&
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
console.assert(makeCartId("bean", "A", "??") !== makeCartId("bean", "A", "??"), "Different grind options should have different cart IDs.");
console.assert(products.filter((product) => product.category === "Coffee Review閰?鞊?).length === 0, "Coffee Review閰?鞊?should be temporarily empty.");
console.assert(products.some((product) => product.id === "shopee-medium-dark-half-lb" && product.weight === "??鋆?/ 227g"), "Half-pound commercial bean product should exist.");
console.assert(products.filter((product) => product.category === "蝎曉??鞊?).length === 2, "Premium coffee bean category should contain two products.");
console.assert(products.filter((product) => product.category === "?鞊??").length === 2, "Formula blend category should contain two grouped products.");
console.assert(products.find((product) => product.id === "formula-blend-series")?.packageOptions.length === 4, "Formula blend one-pound grouped product should contain four options.");
console.assert(products.find((product) => product.id === "formula-blend-series-half")?.packageOptions.length === 4, "Formula blend half-pound grouped product should contain four options.");
console.assert(infoSlides.length === 3, "Info carousel should contain three slides.");
console.assert(commercialHalfPoundOptions[0].price === 215, "Half-pound price should be half of one-pound price plus 15.");
console.assert(buildOrderItemsText([{ name: "皜祈岫??", packageLabel: "100g", grindLabel: "???", quantity: 1, price: 100 }]).includes("皜祈岫??"), "Order items text should include product names.");
console.assert(buildOrderItemsText([{ name: "A", packageLabel: "100g", grindLabel: "??", quantity: 1, price: 100 }, { name: "B", packageLabel: "200g", grindLabel: "??", quantity: 2, price: 200 }]).includes("\n"), "Multiple order items should be separated by newline escape.");
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
    { title: "93", text: "撟唾﹛摨西???銵函?芰" },
    { title: "94", text: "蝎曉?撅斗活?偏?駁?摨西摰?, highlight: true },
    { title: "5+", text: "蝛拙???????鞈芸??? },
  ];
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1f120b] via-[#5b351d] to-[#c08a49] p-8 text-white shadow-2xl ring-1 ring-[#d8c1a1] md:p-12">
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#f3c178]/20 blur-3xl" />
      <div className="relative z-10">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-[#f3c178]/30 bg-black/20 shadow-2xl">
          <img src={coffeeReviewAwardImage} alt="Coffee Review 擃?閰?璁株" className="h-auto w-full object-cover" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#f3c178]/60 bg-[#f3c178]/10 shadow-xl">
            <Award className="h-10 w-10 text-[#f3c178]" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-[0.4em] text-[#f3c178]">COFFEE REVIEW</p>
            <h3 className="mt-2 text-4xl font-black md:text-5xl">Coffee Review 閰?璁株</h3>
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
          <h4 className="mt-4 text-2xl font-bold md:text-3xl">銝?臬??∴?銝?舀?蟡???暑鋆∪?摰?蝭憟?/h4>
          <p className="mt-5 leading-8 text-[#fff1df]">?芣?????訾縑嚗?甇?末???∴?銝?摰?銝????蝎曉????鞈芾???蝛拙??改?撣園脫?銝雿撣詨???犖?暑鋆～?/p>
          <p className="mt-4 leading-8 text-[#fff1df]">敺??典?貉??移???對???Coffee Review 擃?閰葫鞊狡嚗????◢?喳像銵～嗾瘛函??????改?霈?銝甈⊥??桅?賣????迤?澈摨艾?/p>
        </div>
      </div>
    </div>
  );
}

export default function CaobanCoffeeHomepage() {
  const [cart, setCart] = useState([]);
  const [pickupMethod, setPickupMethod] = useState("7-11 鞈?疏靘?);
  const [selectedProductCategory, setSelectedProductCategory] = useState("?券??");
  const [selectedPackages, setSelectedPackages] = useState(() => Object.fromEntries(products.map((product) => [product.id, product.packageOptions[0]])));
  const [selectedGrinds, setSelectedGrinds] = useState(() => Object.fromEntries(products.map((product) => [product.id, product.grindOptions[0] || "銝??ㄗ"])));
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
  const filteredProducts = selectedProductCategory === "?券??" ? products : products.filter((product) => product.category === selectedProductCategory);
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
        if (!response.ok) throw new Error("?撣????亙仃??);
        const data = await response.json();
        const stores = Object.entries(data).map(([id, value]) => {
          const raw = value || {};
          const storeName = raw.store || raw.name || "";
          const address = raw.address || "";
          const cityMatch = address.match(/^(?啣?撣?啣?撣獢?撣?唬葉撣?啣?撣擃?撣?粹?撣?啁姘撣?儔撣?啁姘蝮ㄍ??蝮ㄍ敶啣?蝮ㄍ??蝮ㄍ?脫?蝮ㄍ?儔蝮ㄍ撅蝮ㄍ摰蝮ㄍ?梯蝮ㄍ?唳蝮ㄍ瞉?蝮ㄍ??蝮ㄍ???蝮?/);
          return {
            id,
            name: storeName.startsWith("7-11") ? storeName : `7-11 ${storeName}?撣,
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
      ["recipient", "隢‵撖急隞嗡犖憪?"],
      ["phone", "隢‵撖急?璈?蝣?],
      ["email", "隢‵撖?Email"],
      ["pickupStore", "隢??憛怠神頞??撣?],
    ];
    const errors = Object.fromEntries(
      requiredFields.filter(([field]) => !checkoutForm[field].trim()).map(([field, message]) => [field, message])
    );

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
    const selectedGrind = selectedGrinds[productId] || "銝??ㄗ";
    if (!selectedPackage) return 0;
    const cartId = makeCartId(productId, selectedPackage.label, selectedGrind);
    return cart.find((item) => item.cartId === cartId)?.quantity ?? 0;
  }

  function addToCart(product) {
    const selectedPackage = selectedPackages[product.id] || product.packageOptions[0];
    const selectedGrind = selectedGrinds[product.id] || "銝??ㄗ";
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
    const storeText = `${store.name}嚚?{store.id}嚚?{store.address}`;
    handleCheckoutForm("pickupStore", storeText);
    setStoreKeyword(`${store.name} ${store.address}`);
  }

  function openOrderConfirm() {
    if (cart.length === 0) return;
    if (!validateCheckoutForm()) return;
    setOrderSubmitStatus("idle");
    setShowOrderConfirm(true);
  }

  function buildOrderPayload() {
    const items = buildOrderItemsText(cart);
    const lineItems = buildOrderLineItems(cart);
    const itemSummary = cart.map((item) => `${item.name} ${item.packageLabel} ${item.grindLabel} x${item.quantity}`).join("嚗?);
    const [storeName = "", storeId = "", storeAddress = ""] = checkoutForm.pickupStore.split("嚚?).map((text) => text.trim());
    const orderTime = new Date().toLocaleString("zh-TW", { hour12: false });
    const shippingText = shippingFee === 0 ? "??" : currency(shippingFee);
    const productNote = `${itemSummary}${checkoutForm.note ? `嚚?閮鳴?${checkoutForm.note}` : ""}`;

    return {
      "???唾?": orderTime,
      "?餃??萎辣?啣?": checkoutForm.email,
      "?辣鈭箏???: checkoutForm.recipient,
      "?辣鈭箸?璈?: checkoutForm.phone,
      "Email": checkoutForm.email,
      "?辣?撣?: checkoutForm.pickupStore,
      "蝯曹?蝺刻?": checkoutForm.taxId,
      "?砍?祇": checkoutForm.companyTitle,
      "皞怠惜": "撣豢澈",
      "閮??": cartTotal,
      "?酉": checkoutForm.note,
      "??": items,
      "?祥??": shippingFee,
      "鞎瑕振銝??交?": orderTime,
      "???酉": productNote,
      "?嗡?鞈?(FB/LINE/IG撣唾?)": checkoutForm.socialAccount,
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2a1a10] via-[#4b2d1a] to-[#8a603b] text-[#fff8ec]">
        <FloatingIcons />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm tracking-[0.35em] text-[#e8c89d]">CAOBAN COFFEE</p>
            <h1 className="text-xl font-semibold">?芣????</h1>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <a href="#cart" className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white"><ShoppingCart className="mr-2 h-4 w-4" /> 鞈潛頠?{cartCount}</a>
            <a href={shopeeUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#f3c178] px-5 py-2 text-sm font-semibold text-[#2a1a10] shadow-lg transition hover:scale-105">???衣??</a>
          </div>
        </nav>
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 inline-flex rounded-full border border-[#f3c178]/40 px-4 py-2 text-sm text-[#f3c178]">撠惇 7-11 鞈?疏靘輯???鞎冽獢?/p>
            <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">?芰???鋆∴?銋澆?銝?舐?甇??摰?????/h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f8e7cf]">?芰?嚗??芣瘛勗?嚗瘥?雿??函?暑憟郭?犖????∪?銵??銝?舐帘摰?撖艾?皞怠漲???∴??芯撈瘥??典???脩????/p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#products" className="inline-flex items-center justify-center rounded-full bg-[#f3c178] px-7 py-4 font-bold text-[#2a1a10] shadow-xl transition hover:scale-105">???貉頃 <ChevronRight className="ml-2 h-5 w-5" /></a>
              <a href="#cart" className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 font-semibold text-white transition hover:bg-white/10">?亦?鞈潛頠?/a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-[#f3c178]/20 blur-2xl" />
            <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80" alt="?鞊?蝎曉???冽?" className="relative h-[420px] w-full rounded-[2.5rem] object-cover shadow-2xl" />
          </motion.div>
        </div>
      </section>

      <section className="bg-[#efe2cf] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-bold tracking-[0.3em] text-[#8a603b]">COFFEE REVIEW AWARDS</p>
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">Coffee Review 閰?璁株</h2>
              <p className="mt-6 text-lg leading-9 text-[#5c4531]">Coffee Review ?臬???移???∟?皜砍像?堆??賜敺?90 ?誑銝?隞?”??函??嗾瘛典漲?像銵∟?撅斗活銵函銝?撌脤???蝎曉?蝑???/p>
              <p className="mt-5 text-lg leading-9 text-[#5c4531]">?芣????蝝舐?憭活 93??4 擃?閰葫?臬?嚗???餈賣??漲?舫?嚗撠釣?潭?銝甈⊥??桅?賢??曄帘摰?????園??◢?喋?/p>
              <p className="mt-5 text-lg leading-9 text-[#5c4531]">撣?霈憭犖?典???潘?銋?亥孛?迤?瑟???蝎曉?瘞湔????⊿?撽?/p>
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
                <button type="button" onClick={() => setCurrentInfoSlide((current) => (current === 0 ? infoSlides.length - 1 : current - 1))} className="rounded-full border border-white/30 bg-black/20 px-5 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/10">銝?撘?/button>
                <div className="flex gap-2">
                  {infoSlides.map((slide, index) => (
                    <button key={slide.title} type="button" onClick={() => setCurrentInfoSlide(index)} aria-label={`????${slide.title}`} className={`h-2.5 rounded-full transition-all ${currentInfoSlide === index ? "w-10 bg-white" : "w-2.5 bg-white/40"}`} />
                  ))}
                </div>
                <button type="button" onClick={() => setCurrentInfoSlide((current) => (current === infoSlides.length - 1 ? 0 : current + 1))} className="rounded-full border border-white/30 bg-black/20 px-5 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/10">銝?撘?/button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold tracking-[0.3em] text-[#8a603b]">SHOP BY CATEGORY</p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">?????貉頃</h2>
          </div>
          <a href={shopeeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center font-bold text-[#7a4c2b]">?亦??衣?? <ChevronRight className="ml-1 h-5 w-5" /></a>
        </div>
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-[#dccbb2] transition hover:-translate-y-1 hover:shadow-xl">
              <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <p className="text-sm font-semibold text-[#8a603b]">{item.subtitle}</p>
                <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
                <p className="mt-4 leading-7 text-[#66513f]">{item.description}</p>
                <a href="#featured-products" className="mt-6 inline-flex items-center rounded-full bg-[#2a1a10] px-5 py-3 text-sm font-bold text-white">?脣?? <ShoppingBag className="ml-2 h-4 w-4" /></a>
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
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">?豢??鞊?/h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#dcc7ad]">?靽∴?銝?舐?甇?末???∴??府?函洵銝???撠梯?鈭箄?雿???∪?銵移?訾????啁移???∟?嚗??亙虜???葉瘛梁?嚗?瑟??梢????餉??寞??潮憸典?移??甈橘??誑蝛拙????嗾瘛券◢?喟?詨???券?憪鞈潘??撅祆雿?憸典??/p>
            </div>
            <div className="rounded-full bg-[#f3c178]/10 px-5 py-3 text-sm font-bold text-[#f3c178]">{cartCount} 隞塚??芣?敺?{currency(cartTotal)}</div>
          </div>
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
            {productCategoryTabs.map((category) => (
              <button key={category} type="button" onClick={() => setSelectedProductCategory(category)} className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition ${selectedProductCategory === category ? "bg-[#f3c178] text-[#2a1a10]" : "bg-white/10 text-[#fff8ec] hover:bg-white/15"}`}>{category}</button>
            ))}
          </div>
          {filteredProducts.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-[#3a2518] p-10 text-center text-[#dcc7ad]">甇文?憿???蝛綽?敺??臬??交????/div>
          ) : (
            <div className="overflow-hidden rounded-[2rem] bg-[#3a2518] shadow-2xl ring-1 ring-white/10">
              <div className="hidden grid-cols-[180px_1.3fr_0.8fr_0.75fr_0.8fr] gap-5 border-b border-white/10 bg-white/5 px-6 py-4 text-sm font-bold tracking-[0.15em] text-[#dcc7ad] md:grid"><span>??</span><span>?? / 閬</span><span>?? / ??</span><span>?寞</span><span className="text-right">?貉頃</span></div>
              <div className="divide-y divide-white/10">
                {filteredProducts.map((product) => {
                  const selectedPackage = selectedPackages[product.id] || product.packageOptions[0];
                  const selectedGrind = selectedGrinds[product.id] || "銝??ㄗ";
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
                          <p className="mb-3 text-xs font-bold tracking-[0.15em] text-[#dcc7ad]">??????/p>
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
                            <label className="mb-2 block text-xs font-bold tracking-[0.15em] text-[#dcc7ad]">{product.category === "瞈暹??" ? "銝?? : product.weight.includes("??") ? "?? / ???詨" : product.weight.includes("銝蝤?) ? "銝蝤?/ ???詨" : "?? / ???詨"}</label>
                            <select value={selectedPackage.label} onChange={(event) => handlePackageChange(product.id, event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f3c178]">
                              {product.packageOptions.map((option) => (<option key={option.label} value={option.label} className="text-black">{option.label}嚚currency(option.price)}</option>))}
                            </select>
                          </div>
                          {product.grindOptions.length > 0 && (
                            <div>
                              <label className="mb-2 block text-xs font-bold tracking-[0.15em] text-[#dcc7ad]">?ㄗ?孵?</label>
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
                            <button type="button" onClick={() => updateQuantity(cartId, quantity - 1)} className="rounded-full bg-white p-2 text-[#2a1a10]" aria-label={`皜? ${product.name} ?賊?`}><Minus className="h-4 w-4" /></button>
                            <span className="w-8 text-center font-bold">{quantity}</span>
                            <button type="button" onClick={() => updateQuantity(cartId, quantity + 1)} className="rounded-full bg-[#f3c178] p-2 text-[#2a1a10]" aria-label={`憓? ${product.name} ?賊?`}><Plus className="h-4 w-4" /></button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => addToCart(product)} className="inline-flex items-center justify-center rounded-full bg-[#f3c178] px-5 py-3 font-bold text-[#2a1a10] transition hover:scale-[1.02]">? <Plus className="ml-2 h-4 w-4" /></button>
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
            <div className="mb-8 flex items-center justify-between"><div><p className="text-sm font-bold tracking-[0.3em] text-[#8a603b]">CART</p><h2 className="mt-2 text-3xl font-bold">鞈潛頠?/h2></div><div className="rounded-full bg-[#efe2cf] px-4 py-2 text-sm font-bold text-[#7a4c2b]">{cartCount} 隞嗅???/div></div>
            {cart.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#cdb99e] bg-[#f6efe4] p-8 text-center text-[#66513f]">?桀?鞈潛頠蝛箇?嚗???刻????鞊?瞈暹????/div>
            ) : (
              <div className="space-y-5">
                {cart.map((item) => (
                  <div key={item.cartId} className="grid gap-4 rounded-3xl bg-[#f6efe4] p-4 md:grid-cols-[96px_1fr_auto] md:items-center">
                    <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                    <div><h3 className="font-bold">{item.name}</h3><p className="mt-1 text-sm text-[#66513f]">{item.taste}</p><p className="mt-1 text-xs font-bold text-[#8a603b]">{item.packageLabel}</p><p className="mt-1 text-xs text-[#66513f]">{item.grindLabel}</p><p className="mt-2 font-bold text-[#7a4c2b]">{currency(item.price)}</p></div>
                    <div className="flex items-center gap-3"><button type="button" onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="rounded-full bg-white p-2 shadow-sm" aria-label="皜??賊?"><Minus className="h-4 w-4" /></button><span className="w-8 text-center font-bold">{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="rounded-full bg-white p-2 shadow-sm" aria-label="憓??賊?"><Plus className="h-4 w-4" /></button><button type="button" onClick={() => updateQuantity(item.cartId, 0)} className="rounded-full bg-white p-2 text-[#8a3d2b] shadow-sm" aria-label="蝘駁??"><Trash2 className="h-4 w-4" /></button></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] bg-[#8a603b] p-7 text-white shadow-xl md:p-10">
            <p className="text-sm font-bold tracking-[0.3em] text-[#f3c178]">CHECKOUT</p><h2 className="mt-2 text-3xl font-bold">頞??疏蝯董</h2>
            <div className="mt-5 rounded-2xl border border-[#f3c178]/30 bg-[#f3c178]/10 p-4 text-[#fff1df]"><p className="text-sm font-bold text-[#f3c178]">?芣?瘣餃?</p><ul className="mt-2 space-y-1 text-sm leading-7"><li>???券尹?? 9 ???/li><li>??7-11 鞈?疏靘輸?鞎?38 ??/li><li>???敺遛 1,000 ?澈??</li></ul></div>
            <div className="mt-8 space-y-4">
              {["7-11 鞈?疏靘?].map((method) => (<button key={method} type="button" onClick={() => setPickupMethod(method)} className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left font-bold transition ${pickupMethod === method ? "border-[#f3c178] bg-[#f3c178] text-[#2a1a10]" : "border-white/20 bg-white/10 text-white hover:bg-white/15"}`}><span className="inline-flex items-center"><MapPin className="mr-2 h-5 w-5" />{method}</span><ChevronRight className="h-5 w-5" /></button>))}
            </div>
            <div className="mt-8 rounded-3xl bg-white/10 p-6">
              <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#f3c178]">?嗡辣?蟡刻?閮?/p>
              <div className="space-y-4">
                <input type="text" required aria-invalid={Boolean(checkoutErrors.recipient)} placeholder="?嗡辣鈭箏???敹‵嚗? value={checkoutForm.recipient} onChange={(event) => handleCheckoutForm("recipient", event.target.value)} className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none ${checkoutErrors.recipient ? "border-[#ffb4a8]" : "border-white/20"}`} />
                {checkoutErrors.recipient && <p className="-mt-2 text-sm font-bold text-[#ffcfca]">{checkoutErrors.recipient}</p>}
                <input type="text" required aria-invalid={Boolean(checkoutErrors.phone)} placeholder="???Ⅳ嚗?憛恬?" value={checkoutForm.phone} onChange={(event) => handleCheckoutForm("phone", event.target.value)} className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none ${checkoutErrors.phone ? "border-[#ffb4a8]" : "border-white/20"}`} />
                {checkoutErrors.phone && <p className="-mt-2 text-sm font-bold text-[#ffcfca]">{checkoutErrors.phone}</p>}
                <input type="email" required aria-invalid={Boolean(checkoutErrors.email)} placeholder="Email嚗?憛恬?" value={checkoutForm.email} onChange={(event) => handleCheckoutForm("email", event.target.value)} className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none ${checkoutErrors.email ? "border-[#ffb4a8]" : "border-white/20"}`} />
                {checkoutErrors.email && <p className="-mt-2 text-sm font-bold text-[#ffcfca]">{checkoutErrors.email}</p>}
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <div><p className="font-bold text-[#f3c178]">頞??撣?/p><p className="mt-1 text-xs leading-6 text-[#fff1df]">?航撓?仿?撣?蝔晞???撣??啣??摮?蝟餌絞??撠??7-11 ?撣??蒂?芸?撣嗅?啣???/p><p className="mt-1 text-xs leading-6 text-[#f3c178]">{storeDataStatus === "loading" ? "?撣????乩葉?? : storeDataStatus === "ready" ? `撌脰???${remoteStores.length.toLocaleString("zh-TW")} ??撣?? : "?桀?雿輻??撣??殷??交銝?舀?冽憭??萄?????}</p></div>
                  <input type="text" placeholder="???撣?蝔?/ 摨? / ?啣?嚗?憒??斤??銝准正?" value={storeKeyword} onChange={(event) => setStoreKeyword(event.target.value)} className="mt-4 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none" />
                  <div className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-2xl bg-black/10 p-3">
                    {filteredStores.length === 0 ? (<p className="px-3 py-2 text-sm text-[#fff1df]">?桀??曆??啁泵???撣?隢?摨????楝??蝮???摮?撠?/p>) : filteredStores.map((store) => (<button key={store.id} type="button" onClick={() => selectStore(store)} className="w-full rounded-xl bg-white/10 px-4 py-3 text-left transition hover:bg-[#f3c178] hover:text-[#2a1a10]"><span className="block text-sm font-bold">{store.name}嚚store.id}</span><span className="mt-1 block text-xs leading-5">{store.address}</span></button>))}
                  </div>
                  <input type="text" required aria-invalid={Boolean(checkoutErrors.pickupStore)} placeholder="撌脤?撣?/ 摨? / ?啣?嚗?憛恬?" value={checkoutForm.pickupStore} onChange={(event) => handleCheckoutForm("pickupStore", event.target.value)} className={`mt-3 w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none ${checkoutErrors.pickupStore ? "border-[#ffb4a8]" : "border-white/20"}`} />
                  {checkoutErrors.pickupStore && <p className="mt-2 text-sm font-bold text-[#ffcfca]">{checkoutErrors.pickupStore}</p>}
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4"><p className="text-sm font-bold text-[#f3c178]">?潛巨鞈?</p><p className="mt-1 text-xs leading-6 text-[#fff1df]">?桀??臬??函絞銝?潛巨嚗??閬?隢?銝絞銝蝺刻???哨??鞎券?銝?/p></div>
                <div className="grid gap-4 md:grid-cols-2"><input type="text" placeholder="蝯曹?蝺刻?" value={checkoutForm.taxId} onChange={(event) => handleCheckoutForm("taxId", event.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none" /><input type="text" placeholder="?砍?祇" value={checkoutForm.companyTitle} onChange={(event) => handleCheckoutForm("companyTitle", event.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none" /></div>
                <input type="text" placeholder="?嗡?鞈?嚗B / LINE / IG 撣唾?嚗?征嚗? value={checkoutForm.socialAccount} onChange={(event) => handleCheckoutForm("socialAccount", event.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none" />
                <textarea placeholder="閮?酉" value={checkoutForm.note} onChange={(event) => handleCheckoutForm("note", event.target.value)} rows={4} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-[#e8d7bf] outline-none" />
              </div>
              <div className="mt-8 border-t border-white/20 pt-5"><div className="flex justify-between text-[#fff1df]"><span>???賊?</span><span>{cartCount} 隞?/span></div><div className="mt-4 flex justify-between text-[#fff1df]"><span>???</span><span>{currency(cartSubtotal)}</span></div><div className="mt-4 flex justify-between font-bold text-[#7CFFB2]"><span>?券尹 9 ???/span><span>- {currency(cartSubtotal - discountedSubtotal)}</span></div><div className="mt-4 flex justify-between text-[#fff1df]"><span>?敺?閮?/span><span>{currency(discountedSubtotal)}</span></div><div className="mt-4 flex justify-between text-[#fff1df]"><span>頞??祥</span><span>{shippingFee === 0 ? "??" : currency(shippingFee)}</span></div><div className="mt-4 border-t border-white/20 pt-4 text-sm leading-7 text-[#fff1df]">7-11 鞈?疏靘踵?蝑??桅?鞎?38 ???敺遛 1,000 ?澈???芣??擗典???澈 9 ??暑??/div><div className="mt-5 flex justify-between text-2xl font-bold"><span>蝮質?</span><span>{currency(cartTotal)}</span></div></div>
            </div>
            <button type="button" onClick={openOrderConfirm} disabled={cart.length === 0} className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-4 font-bold transition ${cart.length === 0 ? "cursor-not-allowed bg-white/30 text-white/60" : "bg-white text-[#5a341d] hover:scale-[1.02]"}`}>蝡銝</button>
            <a href={shopeeUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/25 px-6 py-4 font-bold text-white transition hover:bg-white/10">??啗?桀?????/a>
          </aside>
        </div>
      </section>

      {showOrderConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-[#fff8ec] p-6 text-[#2a1a10] shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#dccbb2] pb-5"><div><p className="text-sm font-bold tracking-[0.3em] text-[#8a603b]">{orderSubmitStatus === "success" ? "ORDER COMPLETE" : "ORDER CONFIRM"}</p><h2 className="mt-2 text-3xl font-bold">{orderSubmitStatus === "success" ? "閮頃摰?" : "隢Ⅱ隤??桀摰?}</h2><p className="mt-2 text-sm leading-6 text-[#66513f]">{orderSubmitStatus === "success" ? "雓??函?閮頃嚗??歇?嗅?函??閮嚗銝??敹?冽???銝隞賡?瘞?? : "蝣箄????隞嗉????疏?撣隤文?嚗??閮??}</p></div><button type="button" onClick={orderSubmitStatus === "success" ? closeOrderComplete : () => setShowOrderConfirm(false)} className="rounded-full bg-[#efe2cf] px-4 py-2 text-sm font-bold text-[#5a341d]">??</button></div>
            <div className="mt-6 space-y-4">{cart.map((item) => (<div key={item.cartId} className="rounded-2xl bg-[#f6efe4] p-4"><div className="flex justify-between gap-4"><div><p className="font-bold">{item.name}</p><p className="mt-1 text-sm text-[#66513f]">{item.packageLabel}</p><p className="mt-1 text-sm text-[#66513f]">{item.grindLabel}</p></div><div className="text-right"><p className="font-bold">{currency(item.price)} ? {item.quantity}</p><p className="mt-1 text-sm text-[#8a603b]">{currency(item.price * item.quantity)}</p></div></div></div>))}</div>
            <div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-[#dccbb2] bg-white p-5"><p className="font-bold text-[#8a603b]">?嗡辣鞈?</p><div className="mt-3 space-y-2 text-sm leading-6 text-[#5c4531]"><p>?嗡辣鈭綽?{checkoutForm.recipient || "撠憛怠神"}</p><p>??嚗checkoutForm.phone || "撠憛怠神"}</p><p>Email嚗checkoutForm.email || "撠憛怠神"}</p><p>?疏?撣?{checkoutForm.pickupStore || "撠?豢?"}</p></div></div><div className="rounded-2xl border border-[#dccbb2] bg-white p-5"><p className="font-bold text-[#8a603b]">?潛巨??閮?/p><div className="mt-3 space-y-2 text-sm leading-6 text-[#5c4531]"><p>蝯曹?蝺刻?嚗checkoutForm.taxId || "??}</p><p>?砍?祇嚗checkoutForm.companyTitle || "??}</p><p>?酉嚗checkoutForm.note || "??}</p><p>?嗡?鞈?嚗checkoutForm.socialAccount || "??}</p></div></div></div>
            <div className="mt-6 rounded-2xl bg-[#2a1a10] p-5 text-white"><div className="flex justify-between text-sm text-[#fff1df]"><span>???</span><span>{currency(cartSubtotal)}</span></div><div className="mt-3 flex justify-between text-sm font-bold text-[#7CFFB2]"><span>?券尹 9 ???/span><span>- {currency(cartSubtotal - discountedSubtotal)}</span></div><div className="mt-3 flex justify-between text-sm text-[#fff1df]"><span>?敺?閮?/span><span>{currency(discountedSubtotal)}</span></div><div className="mt-3 flex justify-between text-sm text-[#fff1df]"><span>頞??祥</span><span>{shippingFee === 0 ? "??" : currency(shippingFee)}</span></div><div className="mt-4 flex justify-between border-t border-white/20 pt-4 text-2xl font-bold"><span>蝮質?</span><span>{currency(cartTotal)}</span></div></div>
            {orderSubmitStatus === "success" && <div className="mt-6 rounded-[2rem] border border-[#b8d8ba] bg-[#e8f5e9] p-6 text-center text-[#2e7d32]"><p className="text-2xl font-black">閮撌脤??拚</p><p className="mt-3 text-sm font-bold leading-7">???冽?隞予???⊥??漱蝯行???∪?銵??格?蝝啣?撖?函? Email嚗?????甇交?圈銝衣敹怎?典??鞎具?/p><p className="mt-3 text-sm leading-7 text-[#3d6b40]">憿遢?嚗?菟??冽?銝剜?嚗?憟賣??箇?瘣餉ㄐ?????畾菟?瘞??/p></div>}
            {orderSubmitStatus === "error" && <div className="mt-6 rounded-2xl bg-[#fff0f0] p-4 text-sm font-bold leading-7 text-[#9f2a2a]">閮?憭望?嚗?蝔??岫嚗??寧?衣??銝??/div>}
            {orderSubmitStatus === "success" ? (
              <div className="mt-6 flex justify-center">
                <button type="button" onClick={closeOrderComplete} className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-[#8a603b] px-6 py-4 font-bold text-white transition hover:scale-[1.02]">??閬?</button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => setShowOrderConfirm(false)} className="inline-flex flex-1 items-center justify-center rounded-full border border-[#8a603b]/30 px-6 py-4 font-bold text-[#5a341d]">餈?靽格</button><button type="button" onClick={submitOrder} disabled={orderSubmitStatus === "submitting"} className={`inline-flex flex-1 items-center justify-center rounded-full px-6 py-4 font-bold text-white transition ${orderSubmitStatus === "submitting" ? "bg-[#8a603b]/60" : "bg-[#8a603b] hover:scale-[1.02]"}`}>{orderSubmitStatus === "submitting" ? "閮?銝凌? : "蝣箄??閮"}</button></div>
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-[#dccbb2] px-6 py-10 text-center text-sm text-[#66513f]"><p className="text-lg font-semibold text-[#4b2d1a]">?芰? WEIMIAN COFFEE</p><p className="mt-3 leading-7">?券鈭?瘝??舐?憭?嚗?雿?銝剔??嚗??箸??瘣餌?銝暺???/p><p className="mt-4 text-xs tracking-[0.25em] text-[#8a603b]">穢 ?芣???? CAOBAN COFFEE嚚移???∟??餃??∪?頞??疏?寞?</p></footer>
    </main>
  );
}


