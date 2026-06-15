import fs from "node:fs/promises";

const apiKey = "6F30E8BF706D653965BDE302661D1241F8BE9EBC";
const outputPath = new URL("../public/family-stores.json", import.meta.url);
const cities = [
  "台北市",
  "新北市",
  "桃園市",
  "台中市",
  "台南市",
  "高雄市",
  "基隆市",
  "新竹市",
  "嘉義市",
  "新竹縣",
  "苗栗縣",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義縣",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "台東縣",
  "澎湖縣",
  "金門縣",
  "連江縣",
];

function parseJsonp(text) {
  const trimmed = text.trim();
  const match = trimmed.match(/^cb\(([\s\S]*)\)$/);
  if (!match) {
    throw new Error(`Unexpected API response: ${trimmed.slice(0, 120)}`);
  }
  return JSON.parse(match[1]);
}

async function fetchCityStores(city) {
  const params = new URLSearchParams({
    searchType: "ShopList",
    city,
    area: "",
    road: "",
    type: "",
    fun: "cb",
    key: apiKey,
  });
  const response = await fetch(`https://api.map.com.tw/net/familyShop.aspx?${params}`, {
    headers: {
      Referer: "https://www.family.com.tw/Marketing/StoreMap/?v=1",
      "User-Agent": "Mozilla/5.0",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${city}: ${response.status}`);
  }
  return parseJsonp(await response.text());
}

const stores = {};

for (const city of cities) {
  const cityStores = await fetchCityStores(city);
  for (const store of cityStores) {
    const id = String(store.pkey || "").trim();
    const name = String(store.NAME || "").trim();
    const address = String(store.addr || "").trim();
    if (!/^\d{6}$/.test(id) || !name || !address) continue;
    stores[id] = { store: name, address };
  }
  console.log(`${city}: ${cityStores.length}`);
}

const sortedStores = Object.fromEntries(Object.entries(stores).sort(([a], [b]) => a.localeCompare(b)));
await fs.writeFile(outputPath, `${JSON.stringify(sortedStores, null, 0)}\n`, "utf8");
console.log(`FamilyMart stores: ${Object.keys(sortedStores).length}`);
