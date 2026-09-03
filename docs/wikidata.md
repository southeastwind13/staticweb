# Wikidata item — ร่างพร้อมสร้าง

ทำไม: `docs/ai-search.md` §5.4 — LLM หลายตัวใช้ Wikidata เป็นแหล่งยืนยัน entity
ตอนนี้โรงแรมยังไม่มี item ทำให้โมเดลไม่มีจุดอ้างอิงกลางที่เป็นกลาง

ฟรี · ใช้เวลาราว 20 นาที · ต้องมีบัญชี Wikidata (สมัครฟรี ใช้อีเมลอย่างเดียว)

สร้างที่ https://www.wikidata.org/wiki/Special:NewItem

---

## ⚠️ อ่านก่อนสร้าง

**Wikidata มีเกณฑ์ความโดดเด่น (notability)** ข้อที่เราเข้าเกณฑ์คือข้อ 2 —
*"refers to an instance of a clearly identifiable conceptual or material entity
that can be described using serious and publicly available references"*
โรงแรมที่เปิดจริง มีที่อยู่ตรวจสอบได้ มีหน้า Google Business และมีหน้าบน OTA
เข้าเกณฑ์นี้ แต่**บรรณาธิการบางคนเข้มกับธุรกิจขนาดเล็ก** ถ้าถูกเสนอลบ อย่าโต้กลับ
ให้เพิ่มแหล่งอ้างอิงแทน (P854 reference URL ชี้ไปหน้า OTA และ Google Maps)

**เขียนแบบข้อเท็จจริงล้วน ห้ามใส่คำโฆษณา** — ไม่มี "เงียบสงบ" "คุ้มค่า" "อบอุ่น"
Wikidata รับเฉพาะข้อมูลที่ตรวจสอบได้ ถ้าใส่ภาษาการตลาดจะถูกลบและเสียเครดิต

---

## Label / Description / Aliases

| ช่อง | ภาษาอังกฤษ | ภาษาไทย |
| --- | --- | --- |
| Label | `Baan Perm Sook Hotel` | `โรงแรมบ้านเพิ่มสุข` |
| Description | `hotel in Pak Kret District, Nonthaburi Province, Thailand` | `โรงแรมในอำเภอปากเกร็ด จังหวัดนนทบุรี ประเทศไทย` |

**Aliases** (ใส่ได้หลายอัน คั่นด้วยการกด Enter):
- อังกฤษ: `Baanpermsook` · `Baanpermsook Impact Muang Thong` · `Baan Perm Sook`
- ไทย: `บ้านเพิ่มสุข` · `บ้านเพิ่มสุข อิมแพ็ค เมืองทอง` · `โรงแรมบ้านเพิ่มสุข อิมแพ็ค เมืองทองธานี`

---

## Statements

### ยืนยัน QID แล้ว ใส่ได้เลย

| Property | ค่า |
| --- | --- |
| `P31` instance of | `Q27686` (hotel) |
| `P17` country | `Q869` (Thailand) |
| `P625` coordinate location | `13.9256010055542, 100.52959442138672` |
| `P856` official website | `https://www.baanpermsook.com/` |
| `P1329` phone number | `+66 94 962 5955` |
| `P968` email address | `mailto:baanpermsook@gmail.com` |
| `P2013` Facebook ID | `baan.permsook.2024` |
| `P6375` street address (th) | `51/44 ซอยติวานนท์-ปากเกร็ด 34 ต.บางพูด อ.ปากเกร็ด จ.นนทบุรี 11120` |
| `P281` postal code | `11120` |

พิกัดชุดนี้คือชุดเดียวกับที่อยู่ใน Agoda Partner Portal และใน JSON-LD บนเว็บ —
ตรวจแล้วเมื่อ 4 ก.ย. 2569 ว่าตรงกันทั้งสามที่

### 🔎 ต้องค้น QID ก่อนใส่ — อย่าเดา

ใส่ผิดแล้วโรงแรมจะไปโผล่ผิดจังหวัด แก้ยากกว่าไม่ใส่ ค้นในช่องของ Wikidata
เองตอนกรอก มันจะ autocomplete ให้:

| Property | ค้นคำว่า | หมายเหตุ |
| --- | --- | --- |
| `P131` located in the administrative territorial entity | `Pak Kret District` | ต้องเป็น**อำเภอปากเกร็ด** ไม่ใช่เทศบาลนครปากเกร็ด และ**ไม่ใช่กรุงเทพฯ** |
| `P131` (ชั้นที่สอง ถ้าต้องการ) | `Nonthaburi Province` | |

> **ระวังจุดนี้เป็นพิเศษ** — Agoda จัดโรงแรมไว้ใต้ city = Bangkok ซึ่งผิด
> (ดู `agoda_improve.md`) ถ้าเราไปใส่ Bangkok ใน Wikidata ด้วย จะกลายเป็นการ
> ยืนยันข้อมูลผิดให้ LLM อีกแหล่ง **ที่ถูกคือปากเกร็ด นนทบุรี**

### ใส่เพิ่มได้ถ้าอยากให้ครบ

| Property | ค่า |
| --- | --- |
| `P1174` visitor count / `P2695`… | ข้ามไป ไม่มีข้อมูลที่อ้างอิงได้ |
| `P137` operated by | ข้ามไป ถ้ายังไม่มีนิติบุคคลที่ตรวจสอบได้ |
| `P571` inception | ข้ามไป ยังไม่ยืนยันปีที่เปิด — **ถามเจ้าของก่อน** |

จำนวนห้อง (21) ไม่มี property มาตรฐานที่เหมาะกับโรงแรมโดยตรง ข้ามไปได้

---

## แหล่งอ้างอิง (ใส่ใต้ statement สำคัญ)

กด "add reference" ใต้ `P31` และ `P625` แล้วใส่:

- `P854` reference URL → `https://www.baanpermsook.com/`
- `P854` reference URL → `https://www.agoda.com/baanpermsook/hotel/bangkok-th.html`
- `P813` retrieved → วันที่ที่สร้าง item

การมีแหล่งอ้างอิงคือสิ่งที่กันไม่ให้ item ถูกเสนอลบ อย่าข้าม

---

## หลังสร้างเสร็จ

1. **จด QID ที่ได้** (จะเป็น `Q` ตามด้วยตัวเลข) กลับมาเติมในเอกสารนี้
2. เพิ่ม QID เข้า `sameAs` ของ `Hotel` JSON-LD ใน `src/index.html` และ
   `src/en/index.html` เป็น `https://www.wikidata.org/wiki/Q<เลข>`
   (ตอนนี้ `sameAs` มี 6 ลิงก์ จะกลายเป็น 7)
3. เพิ่มลิงก์เดียวกันในบล็อก **Official profiles** ของ `src/llms.txt`
4. รอ 2–4 สัปดาห์ แล้วลองถาม LLM ว่า "บ้านเพิ่มสุข อยู่จังหวัดอะไร" —
   ถ้าตอบนนทบุรีถูกโดยไม่สับสนกับกรุงเทพฯ แปลว่า entity ติดแล้ว

**QID ที่ได้:** _(ยังไม่ได้สร้าง — เติมตรงนี้)_
