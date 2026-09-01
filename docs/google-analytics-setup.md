# Google Analytics + Google Ads Conversion — คู่มือตั้งค่า

**อัปเดต:** 2 กันยายน 2026
**GA4 Measurement ID:** `G-CG82G9GPN5` · **GTM:** `GTM-PLKLTZT` · **Google Ads:** 798-838-0532

เอกสารนี้คู่กับ `docs/google-ads-audit.md` (ผลตรวจบัญชี Ads 1 ก.ย. 2026)
ส่วนที่เป็น **โค้ด** ทำเสร็จแล้ว ส่วนที่เหลือคือ **การกดตั้งค่าในหน้าเว็บ** ซึ่งต้องล็อกอิน
บัญชีเจ้าของ

---

## 1. บั๊กที่เพิ่งแก้ — ทำไม conversion ถึงเป็น 0 มาตลอด

นี่คือคำตอบของ "Submit lead forms = Misconfigured, 0 conversions" ในไฟล์ audit

**อาการ:** ทุกหน้าโหลด `gtm.js` (GTM) ก่อน แล้วค่อยโหลด `gtag.js` (GA4) โดยใช้
`window.dataLayer` ตัวเดียวกัน → คอนเทนเนอร์ GTM ยึด "ปลายทางเริ่มต้น" ของ `gtag()` ไป
event ที่ยิงโดยไม่ระบุปลายทางจึงตกอยู่ใน GTM ซึ่งไม่มี trigger รองรับ **แล้วหายไปเฉย ๆ**

**หลักฐาน** (ทดสอบด้วย headless Chrome บน localhost, ดู network):

| ที่ยิง | ผล |
|---|---|
| `gtag('event','zz_probe')` | ❌ ไม่มี request ออกไปที่ Google เลย |
| `gtag('event','zz_probe2', { send_to:'G-CG82G9GPN5' })` | ✅ `POST /g/collect` → 204 |

**แปลว่า `line_click` และ `booking_form_submit` ไม่เคยถึง GA4 เลยตั้งแต่ติดตั้งมา**
Google Ads จึงไม่มีทางเห็นการจอง ต่อให้ import conversion แล้วก็ตาม

**การแก้:** `src/js/scripts.js` ใส่ `send_to: GA4_ID` ทุก event แล้ว (ตัวแปร `GA4_ID`)

> ⚠️ ถ้าจะเพิ่ม event ใหม่ในอนาคต **ต้องยิงผ่านฟังก์ชัน `track()` เท่านั้น**
> อย่าเรียก `gtag('event', ...)` ตรง ๆ ไม่งั้นจะหายแบบเดิม

---

## 2. Event ที่เว็บยิงอยู่ตอนนี้ (ยืนยันแล้วว่าถึง GA4 จริง)

ทุกตัวมาจาก `src/js/scripts.js` และแนบ `page_path` + `page_lang` (th/en) ไปด้วยทุกครั้ง

| Event | ยิงเมื่อ | พารามิเตอร์ | ใช้เป็น |
|---|---|---|---|
| `booking_form_submit` | เข้าหน้า `/thanks.html` (ส่งฟอร์มสำเร็จ) | — | 🎯 **Conversion หลัก** |
| `line_click` | คลิกลิงก์ `line.me` ทุกปุ่มทั้งเว็บ | `link_text`, `link_url` | 🎯 Conversion รอง |
| `phone_click` | คลิกเบอร์โทร `tel:` | `link_text`, `phone_number` | 🎯 Conversion รอง |
| `map_click` | คลิกลิงก์ Google Maps | `link_text`, `link_url` | ดูอย่างเดียว |
| `social_click` | คลิกลิงก์ Facebook | `platform`, `link_url` | ดูอย่างเดียว |
| `ota_click` | คลิกลิงก์ Agoda / Booking.com (ยังไม่มีลิงก์ในเว็บ เตรียมไว้) | `platform`, `link_url` | ดูอย่างเดียว |
| `form_start` | พิมพ์ตัวแรกในฟอร์มจอง (ยิงครั้งเดียว/หน้า) | `form_source` | ดู funnel |

`form_start` → `booking_form_submit` = อัตรากรอกฟอร์มสำเร็จจริง ถ้าตัวเลขห่างกันมาก
แปลว่าฟอร์มยาว/พัง ไม่ใช่คนไม่สนใจ

`map_click` สำคัญกว่าที่คิด — ในบัญชี Ads "Get directions" มี **1,936 ครั้ง/30 วัน**
แต่ไม่ถูกนับเป็นเป้า ตอนนี้เราเก็บฝั่งเว็บเองได้แล้ว

---

## 3. สิ่งที่ต้องกดใน GA4 (analytics.google.com)

### 3.1 เช็คก่อนว่า event เข้าจริง
1. Admin → **DebugView** (หรือ Reports → Realtime)
2. เปิด www.baanpermsook.com ในอีกแท็บ กดปุ่มไลน์ / กดเบอร์โทร
3. ต้องเห็น `line_click`, `phone_click` โผล่ภายใน ~30 วินาที

ถ้าไม่เห็น: เคลียร์แคช CDN/เบราว์เซอร์ก่อน (Azure cache ไฟล์ `scripts.js`)

### 3.2 ตั้ง Key events
Admin → Data display → **Key events** → Mark as key event:

- ✅ `booking_form_submit` ← ตัวหลัก (น่าจะติ๊กไว้แล้ว)
- ✅ `line_click`
- ✅ `phone_click`

**อย่า** ติ๊ก `map_click` / `social_click` / `form_start` เป็น key event —
ไม่งั้น Ads จะเอาไปประมูลตามอีก (บทเรียนจาก "เข้าชมเกิน 3 นาที")

### 3.3 ปิดเป้าปลอมที่ทำให้ Ads หลง
Admin → Key events → หา **"เข้าชมเกิน 3 นาที"** → **ยกเลิก** mark as key event
เป้าตัวนี้คือสาเหตุที่ Maximize conversions ทุ่มงบไปหา "คนอยู่บนเว็บนาน" ไม่ใช่คนจอง

### 3.4 ลงทะเบียน custom dimension (ไม่บังคับ แต่แนะนำ)
Admin → Custom definitions → Create custom dimension (scope = Event):

| Dimension name | Event parameter |
|---|---|
| Page language | `page_lang` |
| Link text | `link_text` |
| Form source | `form_source` |

`form_source` จะบอกว่าลีดมาจาก landing page ไหน (Pet Friendly / Concert / Business)
GA4 เก็บย้อนหลังไม่ได้ ตั้งวันนี้ = เห็นตั้งแต่วันนี้

---

## 4. เชื่อม GA4 ↔ Google Ads แล้ว import conversion

### 4.1 เชื่อมบัญชี
GA4 → Admin → Product links → **Google Ads links** → Link → เลือก 798-838-0532
เปิด **Enable personalized advertising** และ **Enable auto-tagging**

### 4.2 Import เข้ามาเป็น conversion
Google Ads → Goals → Conversions → **+ New conversion action** → **Import** →
Google Analytics 4 properties → Web → ติ๊ก:

- `booking_form_submit`
- `line_click`
- `phone_click`

(รอ ~24 ชม. หลังเชื่อมบัญชี ชื่อ event ถึงจะโผล่ให้เลือก)

### 4.3 จัดว่าอันไหน Primary / Secondary
นี่คือขั้นที่สำคัญที่สุด — bid strategy เรียนรู้จาก **Primary เท่านั้น**

| Conversion action | ตั้งเป็น |
|---|---|
| `booking_form_submit` (GA4) | **Primary** ✅ |
| `line_click` (GA4) | **Primary** ✅ |
| `phone_click` (GA4) | **Primary** ✅ |
| Clicks to call (Google hosted) | **Primary** ✅ (มี 83 ครั้ง/เดือนอยู่แล้ว) |
| Get directions (Local actions) | Secondary (ดูอย่างเดียว — 1,936 ครั้งเยอะเกินจะเอาไปประมูล) |
| **Baanpermsook GA4 — เข้าชมเกิน 3 นาที** | **Secondary หรือลบ** ❌ |
| **Page views** (Google hosted) | **Secondary** ❌ |
| **Store visits** | Secondary |
| **Contacts** (Universal Analytics — ตายแล้ว) | **ลบทิ้ง** |
| **Downloads** (Google Play — ไม่มีแอป) | **ลบทิ้ง** |
| **Submit lead forms** ตัวเก่าที่ Misconfigured | **ลบทิ้ง** (ตัวใหม่จาก GA4 แทน) |
| **Line** ตัวเก่าที่ Misconfigured | **ลบทิ้ง** (ตัวใหม่จาก GA4 แทน) |

### 4.4 หลังตั้งเสร็จ
- อย่าเพิ่งเปลี่ยน bid strategy ทันที — ปล่อยเก็บ conversion จริง **2 สัปดาห์**
  แล้วค่อยตั้ง Target CPA (ตั้งที่ ~฿250–350/ลีด เป็นจุดเริ่ม)
- ระหว่างนี้ใช้ **Maximize clicks** พร้อมกำหนด max CPC หรือคง Maximize conversions ไว้
  ก็ได้ แต่ต้องแน่ใจว่า Primary เหลือแต่ของจริงตามตารางข้างบน

---

## 5. (ทางเลือก) เปิด Google Ads tag ตรง ๆ บนเว็บ

ปกติ **import จาก GA4 ก็พอแล้ว** และแม่นกว่าเพราะมีข้อมูลเดียวไม่ซ้ำซ้อน
จะเปิดตัวนี้ต่อเมื่อต้องการ conversion แบบเรียลไทม์กว่า หรือทำ Enhanced conversions

1. Google Ads → Goals → Conversions → เลือก action → **Tag setup → Install the tag yourself**
2. คัดลอกเลข `AW-xxxxxxxxx` และ label (ส่วนที่อยู่หลัง `/` ใน `send_to`)
3. ใส่ใน `src/js/scripts.js` บล็อก `ADS`:

```js
var ADS = {
  id: 'AW-123456789',
  labels: {
    booking_form_submit: 'AbC-D_efG12345',
    line_click: '',
    phone_click: ''
  }
};
```

ตราบใดที่ `id` ยังว่าง โค้ดจะไม่ส่งอะไรเพิ่ม (GA4 ยังทำงานปกติ) — ปลอดภัยที่จะ deploy

⚠️ ถ้าเปิดตัวนี้ **ห้าม** import conversion ตัวเดียวกันจาก GA4 ด้วย ไม่งั้นจะนับซ้ำ 2 เท่า

---

## 6. เช็กลิสต์ยืนยันว่าใช้ได้จริง

- [ ] Deploy ขึ้น production แล้ว (push `main` → Azure)
- [ ] เปิดเว็บจริง → DevTools → Network → filter `collect` → กดปุ่มไลน์
      ต้องเห็น request `en=line_click` ตอบ **204**
- [ ] GA4 Realtime เห็น `line_click` / `phone_click`
- [ ] Mark key events 3 ตัว + ยกเลิก "เข้าชมเกิน 3 นาที"
- [ ] เชื่อม GA4 ↔ Ads
- [ ] Import conversion 3 ตัว + จัด Primary/Secondary ตามตาราง 4.3
- [ ] ลบ conversion action ที่ตายแล้ว 5 ตัว
- [ ] ผ่านไป 7 วัน: กลับมาดูว่า `booking_form_submit` > 0 หรือยัง
