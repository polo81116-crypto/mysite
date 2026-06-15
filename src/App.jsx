import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  ClipboardList,
  Coffee,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { grindOptions, products } from "./products";

const orderApiUrl =
  "https://script.google.com/macros/s/AKfycbzfN28njwcJeZssEQV5HJnZ7Z9Z-dPmIVP0WNLBZNQz7VUG9VewI6hl29-0ivpJ_DiPQA/exec";
const shopeeUrl =
  "https://shopee.tw/caobancoffee?categoryId=100629&entryPoint=ShopByPDP&itemId=49107641936&upstream=search";
const initialForm = {
  name: "",
  phone: "",
  email: "",
  store: "",
  invoice: "雲端發票",
  taxId: "",
  companyTitle: "",
  social: "",
  note: "",
};

function currency(value) {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(value);
}

function lineId(productId, optionLabel, grind) {
  return `${productId}__${optionLabel}__${grind}`;
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitState, setSubmitState] = useState("idle");

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 38;
  const total = subtotal + shipping;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const visibleProducts = products.filter((product) => product.status !== "hidden");

  function addItem(product, option, grind) {
    const id = lineId(product.id, option.label, grind);
    setCart((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...current,
        {
          id,
          productId: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          option: option.label,
          grind,
          price: option.price,
          quantity: 1,
        },
      ];
    });
  }

  function updateQuantity(id, quantity) {
    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validate() {
    const next = {};
    if (cart.length === 0) next.cart = "請先選擇商品。";
    if (!form.name.trim()) next.name = "請填寫收件人姓名。";
    if (!/^09\d{8}$/.test(form.phone.trim())) next.phone = "手機請填 09 開頭共 10 碼。";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "請填寫正確 Email。";
    if (!form.store.trim()) next.store = "請填寫 7-11 門市名稱或店號。";
    if (form.invoice === "公司統編" && !/^\d{8}$/.test(form.taxId.trim())) {
      next.taxId = "統一編號請填 8 碼數字。";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function openConfirm() {
    if (validate()) {
      setSubmitState("idle");
      setConfirmOpen(true);
    }
  }

  function buildPayload() {
    const items = cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      packageLabel: item.option,
      grindLabel: item.grind,
      quantity: item.quantity,
      unitPrice: item.price,
      lineTotal: item.price * item.quantity,
    }));
    const itemText = cart
      .map(
        (item) =>
          `${item.name}｜${item.option}｜${item.grind}｜${item.quantity} 件｜${currency(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    return {
      "電子郵件地址": form.email,
      "取件人姓名": form.name,
      "取件人手機": form.phone,
      Email: form.email,
      "取件門市": form.store,
      "統一編號": form.taxId,
      "公司抬頭": form.companyTitle,
      "訂購商品": itemText,
      "商品小計": subtotal,
      "運費": shipping,
      "訂單總額": total,
      "發票類型": form.invoice,
      "備註": form.note,
      "其他資訊(FB/LINE/IG帳號)": form.social,
      recipient: form.name,
      phone: form.phone,
      email: form.email,
      pickupStore: form.store,
      taxId: form.taxId,
      companyTitle: form.companyTitle,
      note: form.note,
      socialAccount: form.social,
      items,
      subtotal,
      shippingFee: shipping,
      total,
    };
  }

  async function submitOrder() {
    if (!validate()) return;
    setSubmitState("submitting");
    try {
      await fetch(orderApiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams({ payload: JSON.stringify(buildPayload()) }),
      });
      setSubmitState("success");
      setCart([]);
      setForm(initialForm);
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] pb-28 text-[#24211d] lg:pb-0">
      <header className="border-b border-[#e6e0d5] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#8b6b3f]">自家烘焙精品咖啡｜7-11 取貨付款</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-[#1f1b16] md:text-5xl">
              草本咖啡訂購單
            </h1>
          </div>
          <a
            href={shopeeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#c9b89a] bg-white px-4 py-3 text-sm font-bold text-[#5d4727] hover:bg-[#f5efe5]"
          >
            蝦皮賣場
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-4">
          <div className="rounded-md border border-[#e6e0d5] bg-white p-4">
            <div className="flex items-center gap-3">
              <Coffee className="h-5 w-5 text-[#8b6b3f]" />
              <div>
                <h2 className="text-xl font-black">選擇咖啡豆</h2>
                <p className="mt-1 text-sm text-[#73695d]">選規格與研磨度後按加入，右側會即時整理訂單。</p>
              </div>
            </div>
          </div>

          {visibleProducts.map((product) => (
            <ProductRow key={product.id} product={product} onAdd={addItem} />
          ))}

          <section className="rounded-md border border-[#e6e0d5] bg-white p-4 md:p-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-[#8b6b3f]" />
              <h2 className="text-xl font-black">收件資料</h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="收件人姓名" error={errors.name}>
                <input value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
              </Field>
              <Field label="手機號碼" hint="09 開頭，共 10 碼" error={errors.phone}>
                <input value={form.phone} inputMode="tel" onChange={(e) => updateForm("phone", e.target.value)} />
              </Field>
              <Field label="Email" hint="收出貨通知與電子發票" error={errors.email}>
                <input value={form.email} type="email" onChange={(e) => updateForm("email", e.target.value)} />
              </Field>
              <Field label="7-11 取貨門市" hint="可填店名、店號或地址" error={errors.store}>
                <input value={form.store} onChange={(e) => updateForm("store", e.target.value)} />
              </Field>
              <Field label="發票">
                <select value={form.invoice} onChange={(e) => updateForm("invoice", e.target.value)}>
                  <option>雲端發票</option>
                  <option>手機載具</option>
                  <option>公司統編</option>
                  <option>捐贈發票</option>
                </select>
              </Field>
              <Field label="其他聯絡資訊" hint="FB / LINE / IG，可留空">
                <input value={form.social} onChange={(e) => updateForm("social", e.target.value)} />
              </Field>
              {form.invoice === "公司統編" && (
                <>
                  <Field label="統一編號" error={errors.taxId}>
                    <input value={form.taxId} inputMode="numeric" onChange={(e) => updateForm("taxId", e.target.value)} />
                  </Field>
                  <Field label="公司抬頭">
                    <input value={form.companyTitle} onChange={(e) => updateForm("companyTitle", e.target.value)} />
                  </Field>
                </>
              )}
              <Field label="備註" className="md:col-span-2">
                <textarea rows={4} value={form.note} onChange={(e) => updateForm("note", e.target.value)} />
              </Field>
            </div>
          </section>
        </div>

        <aside className="sticky top-4 hidden rounded-md border border-[#d8cbb5] bg-white p-4 shadow-sm lg:block">
          <CartSummary
            cart={cart}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            error={errors.cart}
            onQuantity={updateQuantity}
            onCheckout={openConfirm}
          />
        </aside>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ded4c4] bg-white p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[#73695d]">{cartCount} 件商品</p>
            <p className="text-xl font-black">{currency(total)}</p>
          </div>
          <button
            type="button"
            onClick={openConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2d2418] px-5 py-3 font-bold text-white"
          >
            確認訂單
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {confirmOpen && (
        <OrderConfirm
          cart={cart}
          form={form}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          submitState={submitState}
          onClose={() => setConfirmOpen(false)}
          onSubmit={submitOrder}
        />
      )}
    </main>
  );
}

function ProductRow({ product, onAdd }) {
  const [optionLabel, setOptionLabel] = useState(product.options[0].label);
  const [grind, setGrind] = useState(product.noGrind ? "不需研磨" : grindOptions[0]);
  const option = product.options.find((item) => item.label === optionLabel) ?? product.options[0];
  const isSoldOut = product.status === "soldout";

  return (
    <article className="grid gap-4 rounded-md border border-[#e6e0d5] bg-white p-4 md:grid-cols-[96px_1fr]">
      <img src={product.image} alt={product.name} className="h-24 w-24 rounded-md object-cover" />
      <div className="grid gap-4 md:grid-cols-[1fr_180px_180px_104px] md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold text-[#8b6b3f]">{product.category}</p>
            {isSoldOut && (
              <span className="rounded-md bg-[#efe8dc] px-2 py-1 text-xs font-bold text-[#7a4b27]">
                已售完
              </span>
            )}
          </div>
          <h3 className="mt-1 text-lg font-black">{product.name}</h3>
          <p className="mt-1 text-sm leading-6 text-[#73695d]">{product.note}</p>
        </div>
        <select value={optionLabel} onChange={(e) => setOptionLabel(e.target.value)} className="field">
          {product.options.map((item) => (
            <option key={item.label}>{item.label}</option>
          ))}
        </select>
        <select
          value={grind}
          disabled={product.noGrind}
          onChange={(e) => setGrind(e.target.value)}
          className="field disabled:bg-[#f2eee7] disabled:text-[#9b9288]"
        >
          {(product.noGrind ? ["不需研磨"] : grindOptions).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onAdd(product, option, grind)}
          disabled={isSoldOut}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2d2418] px-4 text-sm font-bold text-white hover:bg-[#463821] disabled:cursor-not-allowed disabled:bg-[#c8bbaa] disabled:text-white"
        >
          {!isSoldOut && <Plus className="h-4 w-4" />}
          {isSoldOut ? "售完" : currency(option.price)}
        </button>
      </div>
    </article>
  );
}

function Field({ label, hint, error, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-bold text-[#2d2418]">{label}</span>
      {hint && <span className="ml-2 text-xs text-[#82786d]">{hint}</span>}
      <div className="mt-2 [&>input]:field [&>select]:field [&>textarea]:field">{children}</div>
      {error && <p className="mt-2 text-sm font-bold text-[#b3261e]">{error}</p>}
    </label>
  );
}

function CartSummary({ cart, cartCount, subtotal, shipping, total, error, onQuantity, onCheckout }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#8b6b3f]">購物車</p>
          <h2 className="text-2xl font-black">訂單摘要</h2>
        </div>
        <ShoppingBag className="h-6 w-6 text-[#8b6b3f]" />
      </div>

      <div className="mt-4 space-y-3">
        {cart.length === 0 ? (
          <p className="rounded-md border border-dashed border-[#d8cbb5] bg-[#f8f4ed] p-4 text-sm text-[#73695d]">
            尚未加入商品。
          </p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="rounded-md bg-[#f8f4ed] p-3">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="mt-1 text-xs text-[#73695d]">
                    {item.option}｜{item.grind}
                  </p>
                </div>
                <button type="button" onClick={() => onQuantity(item.id, 0)} aria-label="移除商品">
                  <Trash2 className="h-4 w-4 text-[#9a3b2f]" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => onQuantity(item.id, item.quantity - 1)} className="qty-btn">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-black">{item.quantity}</span>
                  <button type="button" onClick={() => onQuantity(item.id, item.quantity + 1)} className="qty-btn">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="font-black">{currency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 space-y-3 border-t border-[#e6e0d5] pt-4 text-sm">
        <Row label="商品件數" value={`${cartCount} 件`} />
        <Row label="商品小計" value={currency(subtotal)} />
        <Row label="7-11 運費" value={shipping === 0 ? "免運" : currency(shipping)} />
        <div className="flex items-center justify-between pt-2 text-xl font-black">
          <span>總計</span>
          <span>{currency(total)}</span>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#73695d]">滿 $1,000 免運。7-11 取貨付款，取貨時付款。</p>
      {error && <p className="mt-3 text-sm font-bold text-[#b3261e]">{error}</p>}
      <button
        type="button"
        onClick={onCheckout}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2d2418] px-5 py-4 font-bold text-white hover:bg-[#463821]"
      >
        確認訂單
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#73695d]">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function OrderConfirm({ cart, form, subtotal, shipping, total, submitState, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/55 px-4 py-6">
      <div className="mx-auto max-w-2xl rounded-md bg-white p-5 shadow-2xl md:p-6">
        {submitState === "success" ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f4df] text-[#2e7d32]">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl font-black">訂單已送出</h2>
            <p className="mt-2 text-[#73695d]">我們已收到訂單，會依資料準備出貨。</p>
            <button type="button" onClick={onClose} className="mt-6 rounded-md bg-[#2d2418] px-6 py-3 font-bold text-white">
              完成
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-[#e6e0d5] pb-4">
              <div>
                <p className="text-sm font-bold text-[#8b6b3f]">送出前確認</p>
                <h2 className="text-2xl font-black">請確認訂單內容</h2>
              </div>
              <button type="button" onClick={onClose} className="rounded-md border border-[#d8cbb5] px-3 py-2 text-sm font-bold">
                返回修改
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 rounded-md bg-[#f8f4ed] p-3">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="mt-1 text-sm text-[#73695d]">
                      {item.option}｜{item.grind}｜{item.quantity} 件
                    </p>
                  </div>
                  <p className="font-black">{currency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-md border border-[#e6e0d5] p-4 text-sm leading-7">
                <p className="font-black">取貨資料</p>
                <p>姓名：{form.name}</p>
                <p>手機：{form.phone}</p>
                <p>Email：{form.email}</p>
                <p>門市：{form.store}</p>
              </div>
              <div className="rounded-md border border-[#e6e0d5] p-4 text-sm leading-7">
                <p className="font-black">發票與備註</p>
                <p>發票：{form.invoice}</p>
                <p>統編：{form.taxId || "無"}</p>
                <p>備註：{form.note || "無"}</p>
              </div>
            </div>

            <div className="mt-5 rounded-md bg-[#2d2418] p-4 text-white">
              <Row label="商品小計" value={currency(subtotal)} />
              <Row label="運費" value={shipping === 0 ? "免運" : currency(shipping)} />
              <div className="mt-3 flex justify-between border-t border-white/20 pt-3 text-2xl font-black">
                <span>總計</span>
                <span>{currency(total)}</span>
              </div>
            </div>
            {submitState === "error" && (
              <p className="mt-4 rounded-md bg-[#fff0ee] p-3 text-sm font-bold text-[#b3261e]">
                送出失敗，請稍後再試或改用蝦皮賣場聯絡。
              </p>
            )}
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitState === "submitting"}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2d2418] px-5 py-4 font-bold text-white disabled:opacity-60"
            >
              {submitState === "submitting" ? "訂單送出中..." : "確認送出訂單"}
              <Send className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
