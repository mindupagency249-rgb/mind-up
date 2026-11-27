# Mind Up Free Tools (one new tool per day)

Live base: https://mindupagency249-rgb.github.io/mind-up/tools/<tool-id>/

- `kit/brand.css` + `kit/logo.png` = the fixed Mind Up identity (same as the diagnosis form). Never change colors/fonts per tool.
- `kit/engine.js` = one question per screen, gate (name, WhatsApp, business, email optional) BEFORE the result, posts to the live diagnosis /exec doPost -> Diagnosis Inbox. Rows are marked `المصدر = 🧮 أداة: <name>`.
- A tool = `tools/<id>/index.html` with `window.TOOL = {id, name, intro, questions, compute, result}`.
- Test without polluting the Inbox: open with `?test=1` (name gets prefixed «اختبار –»).

| # | Tool | Path | Offer it leads to | Date |
|---|------|------|-------------------|------|
| 1 | حاسبة قيمة العميل المحتمل (Lead Value) | tools/lead-value/ | Revenue Conversion / Client Acquisition System | 26 Nov 2026 |
| 2 | حاسبة تكلفة جلب العميل (CAC) | tools/cac/ | Client Acquisition System / Revenue Conversion System | 27 Nov 2026 |
| 3 | مقياس قيد النمو (Growth Constraint) | tools/growth-constraint/ | Business Direction Blueprint | 27 Nov 2026 |
