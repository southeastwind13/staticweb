# UTM — กติกาติดแท็กลิงก์ที่โพสต์โซเชียล

**เขียนเมื่อ:** 2 กันยายน 2569
**ใช้กับ:** ทุกลิงก์ที่โพสต์ออกจากช่องทางที่เราคุมเอง (Facebook, Instagram, TikTok,
LINE OA, Google Business Profile, อีเมลหาผู้ออกบูธ, QR บนการ์ดราคา)

เป้าหมายเดียวของเอกสารนี้: ให้ GA4 ตอบได้ว่า **โพสต์ไหนพาคนมาจอง** ตอนนี้ทราฟฟิก
โซเชียลทั้งหมดกองรวมกันเป็น `facebook / referral` ก้อนเดียว แยกไม่ออกว่ามาจากโพสต์
คอนเสิร์ต โพสต์หมาแมว หรือลิงก์ในไบโอ

---

## 1. กติกา 3 ข้อที่ห้ามพลาด

1. **ติด UTM เฉพาะลิงก์ที่ชี้ "เข้า" เว็บเราจากข้างนอก** — ห้ามติดบนลิงก์ที่เดินไปมา
   ภายในเว็บเราเอง (เช่นเมนู หรือปุ่มในหน้า) เพราะ GA4 จะตัด session เดิมทิ้งแล้ว
   นับเป็น session ใหม่ ทำให้ยอดผู้ใช้เฟ้อและ funnel ขาด
2. **ห้ามติด UTM บนลิงก์ `line.me`** — พารามิเตอร์ไม่รอดข้ามไปแอป LINE และ LINE ไม่ส่ง
   ต่อให้ ใช้ event `line_click` ใน GA4 วัดแทน (มีอยู่แล้วใน `scripts.js`)
   เช่นเดียวกับ `tel:` และลิงก์ Google Maps → วัดด้วย `phone_click` / `map_click`
3. **ตัวเล็กทั้งหมด ห้ามเว้นวรรค** — GA4 แยก `Facebook` กับ `facebook` เป็นคนละแหล่ง
   ใช้ `_` หรือ `-` คั่นคำเท่านั้น

---

## 2. ค่าที่ใช้ได้ (ห้ามคิดใหม่นอกลิสต์นี้)

### `utm_source` — มาจากแพลตฟอร์มไหน

| ค่า | ใช้เมื่อ |
|---|---|
| `facebook` | เพจ Facebook — โพสต์ คอมเมนต์ หรือปุ่มบนเพจ |
| `instagram` | Instagram — โพสต์ สตอรี่ ไบโอ |
| `tiktok` | TikTok |
| `youtube` | YouTube |
| `line_oa` | LINE Official Account (บรอดแคสต์ / rich menu) |
| `google_business` | ปุ่มและโพสต์บน Google Business Profile |
| `email` | อีเมลหาผู้ออกบูธ / บริษัท |
| `qr` | QR code บนการ์ดราคา ป้าย หรือใบปลิว |
| `partner` | โรงแรมพันธมิตร คนขับรถ วินมอเตอร์ไซค์ |

### `utm_medium` — ลิงก์อยู่ตรงไหนของแพลตฟอร์มนั้น

| ค่า | ใช้เมื่อ |
|---|---|
| `bio` | ลิงก์ในไบโอ / โปรไฟล์ (หน้า `/links.html` เท่านั้น) |
| `post` | โพสต์ปกติในฟีด |
| `story` | สตอรี่ / รีล |
| `messaging` | ข้อความบรอดแคสต์ หรือแชตตอบลูกค้า |
| `profile` | ปุ่มถาวรบนโปรไฟล์/เพจ (ไม่ใช่ไบโอลิงก์) |
| `email` | ในเนื้ออีเมล |
| `offline` | QR บนของจริง ป้าย ใบปลิว การ์ด |
| `referral` | คนอื่นแปะให้ (พันธมิตร) |

### `utm_campaign` — โพสต์ชุดไหน / เรื่องอะไร

ตั้งเป็น slug ตัวเล็ก คั่นด้วย `-` อ่านรู้เรื่องในอีก 6 เดือน:

- `linkinbio` — ลิงก์ในไบโอถาวร (ไม่ต้องเปลี่ยน)
- `event-<ชื่องานย่อ>-<เดือนปี>` เช่น `event-furniture92-sep26`
- `concert-<ศิลปิน>-<เดือนปี>` เช่น `concert-bodyslam-oct26`
- `petfriendly-evergreen` — คอนเทนต์หมาแมวที่โพสต์ซ้ำได้เรื่อย ๆ
- `exhibitor-outreach-<เดือนปี>` — อีเมลหาผู้ออกบูธ
- `promo-<ชื่อโปร>-<เดือนปี>`

---

## 3. หน้ารวมลิงก์สำหรับไบโอ — `/links.html`

หน้าเดียวใช้ได้ทุกแพลตฟอร์ม **แต่หน้าเดียวก็แยกไม่ออกว่าใครมาจากไหน** จึงใส่
`?s=<ช่องทาง>` ต่อท้าย แล้ว `scripts.js` จะอ่านค่านั้นไปประทับ `utm_source` ให้กับ
ลิงก์ภายในทุกเส้นบนหน้านั้นโดยอัตโนมัติ

**เอา URL พวกนี้ไปแปะในไบโอได้เลย:**

| แพลตฟอร์ม | URL ที่ใส่ในไบโอ |
|---|---|
| Instagram | `https://www.baanpermsook.com/links.html?s=ig` |
| Facebook | `https://www.baanpermsook.com/links.html?s=fb` |
| TikTok | `https://www.baanpermsook.com/links.html?s=tt` |
| YouTube | `https://www.baanpermsook.com/links.html?s=yt` |
| Google Business Profile | `https://www.baanpermsook.com/links.html?s=gbp` |
| LINE OA (rich menu) | `https://www.baanpermsook.com/links.html?s=li` |

`?s=` ที่รู้จัก: `ig` `fb` `tt` `yt` `gbp` `li` — ถ้าใส่ค่าอื่นหรือไม่ใส่เลย
จะกลายเป็น `utm_source=bio` (ยังวัดได้ แค่แยกแพลตฟอร์มไม่ออก)

ลิงก์ LINE / เบอร์โทร / Google Maps บนหน้านี้ **ไม่ถูกติดแท็กโดยตั้งใจ** ตามกติกาข้อ 2

---

## 4. ลิงก์พร้อมใช้ — ก๊อปวางได้เลย

### โพสต์ Facebook

| จะโพสต์เรื่อง | ลิงก์ที่ใช้ |
|---|---|
| หน้าแรก / โปรทั่วไป | `https://www.baanpermsook.com/?utm_source=facebook&utm_medium=post&utm_campaign=promo-general-sep26` |
| พาสัตว์เลี้ยง | `https://www.baanpermsook.com/pet-friendly.html?utm_source=facebook&utm_medium=post&utm_campaign=petfriendly-evergreen` |
| คอนเสิร์ต / อีเวนต์ | `https://www.baanpermsook.com/events.html?utm_source=facebook&utm_medium=post&utm_campaign=concert-oct26` |
| ทีมออกบูธ | `https://www.baanpermsook.com/exhibitor.html?utm_source=facebook&utm_medium=post&utm_campaign=exhibitor-outreach-sep26` |

### โพสต์ / สตอรี่ Instagram

| จะโพสต์เรื่อง | ลิงก์ที่ใช้ |
|---|---|
| สตอรี่ทั่วไป | `https://www.baanpermsook.com/?utm_source=instagram&utm_medium=story&utm_campaign=promo-general-sep26` |
| สตอรี่หมาแมว | `https://www.baanpermsook.com/pet-friendly.html?utm_source=instagram&utm_medium=story&utm_campaign=petfriendly-evergreen` |

### TikTok

| จะโพสต์เรื่อง | ลิงก์ที่ใช้ |
|---|---|
| คลิปจับเวลาไปอิมแพ็ค | `https://www.baanpermsook.com/?utm_source=tiktok&utm_medium=post&utm_campaign=drive-time-impact` |

### Google Business Profile

| ปุ่ม / โพสต์ | ลิงก์ที่ใช้ |
|---|---|
| ปุ่ม "เว็บไซต์" บนหมุด | `https://www.baanpermsook.com/?utm_source=google_business&utm_medium=profile&utm_campaign=gbp-website-button` |
| โพสต์อัปเดตบน GBP | `https://www.baanpermsook.com/?utm_source=google_business&utm_medium=post&utm_campaign=gbp-update-sep26` |

### อีเมลหาผู้ออกบูธ (หัวข้อ 06 ใน `proactive-plan.html`)

```
https://www.baanpermsook.com/exhibitor.html?utm_source=email&utm_medium=email&utm_campaign=exhibitor-outreach-sep26
```

### QR บนการ์ดราคา / ป้าย

```
https://www.baanpermsook.com/links.html?s=qr&utm_medium=offline&utm_campaign=pricecard-sep26
```

---

## 5. ดูผลที่ไหนใน GA4

Property **"Baanpermsook - GA4"** (`G-CG82G9GPN5`)

1. **Reports → Acquisition → Traffic acquisition** → เปลี่ยน dimension เป็น
   `Session source / medium` หรือ `Session campaign`
2. เทียบกับ conversion: คอลัมน์ที่ต้องดูคือ `booking_form_submit` และ `line_click`
   ไม่ใช่ users — ทราฟฟิกเยอะแต่ไม่ทักไลน์คือโพสต์ที่ต้องเลิกทำ
3. ข้อมูล UTM ใช้เวลาขึ้นรายงานราว 24 ชม. **ห้ามใช้รายงานนี้เช็คว่าติดแท็กถูกไหม**

**เช็คว่าแท็กทำงานจริงต้องดูที่ network** ตามกติกาในโปรเจกต์นี้: เปิดหน้าเว็บด้วย
ลิงก์ที่ติดแท็กแล้ว → DevTools → Network → กรอง `/g/collect` → ดูว่า request มี
`cs=` (campaign source), `cm=` (medium), `cn=` (campaign) ตรงกับที่ใส่ไว้หรือไม่
รายงานใน GA4 ไม่ใช่การตรวจสอบ เพราะมันขึ้นช้าและไม่บอกว่าอะไรหายไป

---

## 6. ข้อควรระวัง

- **Facebook/Instagram จะเติม `fbclid` มาเอง** — ไม่กระทบ UTM ปล่อยไว้ได้
- **อย่าใช้ตัวย่อกำกวมใน `utm_campaign`** เช่น `sep` อย่างเดียว อีก 6 เดือนจะไม่รู้ว่า
  ปีไหน ใส่ปีเสมอ (`sep26`)
- **ลิงก์ที่โพสต์ไปแล้วแก้ไม่ได้** — ตรวจก่อนโพสต์เสมอ โพสต์เก่าที่ไม่มีแท็กก็ปล่อยไป
  ไม่ต้องไล่แก้ย้อนหลัง
- `/links.html` และหน้า landing ทั้งหมดเป็น `noindex, follow` และไม่อยู่ใน
  `sitemap.xml` โดยตั้งใจ — เพื่อไม่ให้แย่งอันดับกับหน้าแรกในผลค้นหาปกติ
