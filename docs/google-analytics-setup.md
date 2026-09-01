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
Admin → Data display → **Key events**:

- ✅ `booking_form_submit` ← ตัวหลัก (น่าจะติ๊กไว้แล้ว)
- ✅ `line_click`
- ✅ `phone_click`

**วิธี mark ใน UI จริง** (ตรวจกับ property `Baanpermsook - GA4` เมื่อ 2 ก.ย. 2026):

> Admin → Property settings → **Data display → Events**
> มี 2 แท็บ: **Key events** | **Recent events**
> หา event ที่ต้องการในแท็บ **Recent events** แล้ว **กดดาว ☆ หน้าชื่อ event**
> เท่านั้นเอง — ดาวทึบ ★ = เป็น key event แล้ว

> ⚠️ **อย่ากดปุ่ม "Create event"** — ปุ่มนั้นคือการ *สร้าง event ใหม่* จากเงื่อนไขของ
> event เดิม (เอาไว้ทำ event สังเคราะห์) ถ้ากดแล้วพิมพ์ `phone_click` เข้าไป จะได้
> event ซ้ำอีกตัวที่ยิงเองไม่เป็น เละกว่าเดิม เว็บเรายิง `phone_click` มาให้อยู่แล้ว
> **ต้องการแค่กดดาว**

> **ถ้ายังไม่เห็นชื่อ event ในลิสต์** — GA4 โชว์เฉพาะ event ที่ประมวลผลแล้วเท่านั้น
> (ในลิสต์นี้ "แสดง key event ทั้งหมด + event ที่เก็บได้ใน 28 วันล่าสุด")
> ของใหม่ใช้เวลาราว ๆ ไม่กี่ชั่วโมงถึง 24 ชม. **ไม่มีทางลัด** — UI เวอร์ชันนี้
> ไม่มีปุ่ม "New key event" ให้พิมพ์ชื่อล่วงหน้า (เช็คแล้วทั้งเมนู Custom configurations
> มีแค่ Custom events กับ Modifications) วิธีเดียวคือรอให้ event โผล่แล้วกดดาว

**อย่า** ติ๊ก `map_click` / `social_click` / `form_start` เป็น key event —
ไม่งั้น Ads จะเอาไปประมูลตามอีก (บทเรียนจาก "เข้าชมเกิน 3 นาที")

### 3.3 ปิดเป้าปลอมที่ทำให้ Ads หลง
Admin → Key events → หา **"เข้าชมเกิน 3 นาที"** → กดดาวออก (ยกเลิก mark as key event)
เป้าตัวนี้คือสาเหตุที่ Maximize conversions ทุ่มงบไปหา "คนอยู่บนเว็บนาน" ไม่ใช่คนจอง

**`purchase`** — ตรวจแล้วเมื่อ 2 ก.ย. 2026: ในแท็บ Key events มันขึ้น **ดาวโปร่ง ☆
คือไม่ได้ถูก mark เป็น key event อยู่แล้ว** และสถานะเป็น "No stream data detected"
(ไม่เคยยิงเลย เพราะเว็บไม่มีระบบขายของออนไลน์) — **ไม่ต้องทำอะไรกับมัน**

> ⚠️ การเอาดาวออกใน GA4 **หยุดแค่การนับต่อจากนี้** — ข้อมูลเก่ายังแสดงเป็น key event
> เหมือนเดิม และที่สำคัญกว่าคือ **มันไม่ได้ลบ conversion action ที่ import ไป
> Google Ads แล้ว** ต้องไปจัดการฝั่ง Ads เองตามข้อ 4.3 ด้วย ไม่งั้น bid strategy
> ก็ยังเรียนรู้จากของเดิมอยู่ดี

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

> **สถานะจริงหลังลงมือแก้ 2 ก.ย. 2026** — โครงสร้างในบัญชีไม่เหมือนที่ตารางข้างล่างเดาไว้
> ตอนแรก ดูสรุปที่ทำไปแล้วในหัวข้อ 7 ท้ายเอกสาร
นี่คือขั้นที่สำคัญที่สุด — bid strategy เรียนรู้จาก **Primary เท่านั้น**

**หาไม่เจอเพราะมันไม่ได้อยู่ในหน้าตั้งค่าของ conversion action** — ค่านี้อยู่ในระดับ
*goal* ไม่ใช่ระดับ action เส้นทางที่ถูกคือ:

> **Goals → Conversions → แท็บ "Goals"** (ไม่ใช่แท็บ Summary)
> → กด **Edit goal** ที่ goal ที่ต้องการ (เช่น Leads)
> → กางหัวข้อ **"Conversion action optimization"**
> → คอลัมน์ **"Action optimization"** เลือก **Primary** หรือ **Secondary (observe only)**
> → **Save**

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

**เรื่อง status "Needs attention" / "Misconfigured" ที่ขึ้นหลายอัน** — ไม่ต้องไปไล่ซ่อม
มันแปลว่า "ตั้งแท็กไว้แต่ไม่เคยได้รับ conversion เลย" ซึ่งก็คืออาการของบั๊ก `send_to`
ที่เพิ่งแก้ไป **ตัวที่ขึ้นเตือนส่วนใหญ่คือตัวที่อยู่ในรายการ "ลบทิ้ง" อยู่แล้ว**
เสียเวลาซ่อมไปก็ต้องลบอยู่ดี — ลบ/ปรับเป็น Secondary ตามตารางข้างบนแล้วคำเตือนจะหายไปเอง
ส่วนตัวที่ import จาก GA4 เข้ามาใหม่จะขึ้น "Awaiting conversions" อยู่ ~1–2 วัน
จนกว่าจะมีคนกดจริง ถือว่าปกติ

### 4.4 ปรับ goal ของแคมเปญ (ชั้นที่คนมองข้าม)

ถ้าแคมเปญตั้ง **campaign-specific goal** ไว้ มันจะ **ไม่สนใจค่า Primary/Secondary
ระดับบัญชีเลย** — แคมเปญ `BPS Ads` ตั้งไว้แบบนี้อยู่ (Submit lead forms + Phone call
leads + Contacts ซึ่งพังทั้งสามตัว) แก้แค่ข้อ 4.3 จึงไม่พอ

> **Campaigns → เลือก `BPS Ads` → Settings → Goals**
> เอาของเก่าออก ใส่ `booking_form_submit` + `line_click` + `phone_click` แทน

หรือจะกดใช้ **account-default goal** ไปเลยก็ได้ (Goals → แท็บ Goals → Edit goal →
กาง "Account default" → เปิด "Make this an account-default goal") แล้วลบ
campaign-specific goal ทิ้ง จะได้ไม่ต้องคุมสองที่

**ลำดับที่ถูก:** import จาก GA4 (4.2) → จัด Primary/Secondary (4.3) → แก้ goal ของ
แคมเปญ (4.4) → **ค่อยเปิดแคมเปญ** ถ้าเปิดก่อนแก้ goal เงินจะไหลไปเรียนรู้จากเป้าพังอีกรอบ

### 4.5 หลังตั้งเสร็จ
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

---

## 7. บันทึกการแก้บัญชี Google Ads — 2 กันยายน 2026

เข้าไปแก้ในบัญชี 798-838-0532 จริง สิ่งที่พบต่างจากที่เอกสารเดาไว้ตอนแรก

### 7.1 โครงสร้างจริงที่เจอ

conversion action มี 14 ตัว จัดอยู่ใน 8 goal — และ **`booking_form_submit` กับ
`line_click` ถูก import เข้ามาแล้วตั้งแต่ 1 ก.ย.** (อยู่ในกลุ่ม goal ชื่อ
"Phone call leads" ซึ่งชื่อไม่ตรงความหมาย แต่ใช้งานได้ เพราะแคมเปญเลือก goal นั้นอยู่)

**แคมเปญ `BPS Ads` ใช้ campaign-specific goal 4 ตัว:**
Contact (Website) · Phone call lead (Call from Ads) · Phone call lead (Website) ·
Submit lead form (Website)

ข่าวดีคือ **ไม่มีเป้าขยะตัวไหนอยู่ใน goal ของแคมเปญเลย** — Store visits / Page views /
Get directions / เข้าชมเกิน 3 นาที ทั้งหมดขึ้นว่า "Campaigns 0 of 1" คือไม่ถูกใช้ประมูล
สิ่งที่แคมเปญเรียนรู้จริงมีแค่ Call clicks + booking_form_submit + line_click
(ที่เหลือคือแท็กพังที่ยิง 0 ครั้ง จึงไม่มีผลต่อ bidding)

### 7.2 สิ่งที่แก้ไปแล้ว (Primary → Secondary observe only)

| Goal | Conversion action | เหตุผล |
|---|---|---|
| Engagements | `Baanpermsook - GA4 (web) คนที่เข้าชมเกิน 3 นาที` | เป้าปลอมตัวหลัก — ยังเป็น Primary + account-default อยู่ |
| Contacts | `Contact us (All Web Site Data)` | มาจาก Universal Analytics ที่ปิดตายแล้ว |
| Contacts | `Line` | แท็กเว็บตัวเก่า สถานะ Misconfigured — มี `line_click` จาก GA4 แทนแล้ว |
| Downloads | `Android installs (all other apps)` | ไม่มีแอป Android |

ก่อนบันทึกได้กด **Review campaign impact** ทุกครั้ง — Google ยืนยันว่า goal ของแคมเปญ
`BPS Ads` **ไม่เปลี่ยนเลย** (Changes to conversions counted for optimization = None)

**ผลลัพธ์:** Contacts และ Engagements เปลี่ยนจาก "Needs attention" เป็น **Active** ✅

### 7.3 ที่แก้ไม่ได้ / ยังค้าง

- **Store visits** — dropdown ถูก disable (เป็น action ที่ Google โฮสต์เอง แก้ไม่ได้)
  ไม่กระทบแคมเปญเพราะไม่ได้อยู่ใน goal ของแคมเปญ
- **Downloads** ตอนนี้เหลือ Primary 0 ตัว เลยขึ้นป้ายแดง "Misconfigured" — เป็นแค่ป้าย
  ไม่มีผลอะไร (ไม่มีแคมเปญใช้ goal นี้) จะให้หายจริงต้อง **ลบ** action
  `Android installs` ทิ้ง ซึ่งลบแล้วข้อมูลย้อนหลังหายด้วย จึงยังไม่ได้ทำ
- **`contact form`** ใน goal "Submit lead forms" ยัง Misconfigured และเป็น Primary ตัวเดียว
  ของ goal นั้น — ถ้าลดเป็น Secondary goal จะเหลือ 0 primary ทั้งที่แคมเปญใช้ goal นี้อยู่
  ปล่อยไว้ปลอดภัยกว่า (มันยิง 0 ครั้ง จึงไม่หลอก bidding)
- **`phone_click`** ยังไม่ได้ import เข้า Ads — ต้องรอให้มันโผล่ในลิสต์ Recent events
  ของ GA4 ก่อน (ดูข้อ 3.2 — ไม่มีทางลัด) แล้วกดดาว จากนั้นค่อย import ตามข้อ 4.2
  สถานะ ณ 2 ก.ย.: Recent events มี 10 ตัว — `form_start` กับ `line_click` ขึ้นแล้ว
  ส่วน `phone_click` / `map_click` / `social_click` ยังไม่ขึ้น (เพิ่ง deploy วันนี้)

### 7.4 ⚠️ แคมเปญกำลังวิ่งอยู่

`BPS Ads` สถานะ **Enabled** (ไม่ใช่ Paused แล้ว) — ฿300/วัน · Maximize clicks ·
"Bid strategy learning 99%" แปลว่าเงินกำลังไหลอยู่ตอนนี้ ข่าวดีคือบั๊ก `send_to`
แก้และ deploy แล้ววันนี้ ทราฟฟิกตั้งแต่นี้ไปจะถูกนับ conversion จริงเป็นครั้งแรก
