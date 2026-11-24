# Global markets: payments, devices, language, and how far behavioural findings travel

Researched 2026-11-07. Tags as in `domain-atlas-reference.md`. Mostly secondary summaries of commercial reports; figures are directional and the sources disagree in places.

## 1. Payments differ by country (and it decides conversion)

- **Digital wallets** were reported at about **56% of global e-commerce value in 2025** (Worldpay, now part of Global Payments, *Global Payments Report 2026*, 42 markets, released 31 March 2026) [secondary summary of the report]. Wallets overtook cards in Hong Kong for the first time.
- **Examples reported** [secondary]: Germany, wallets about 52% of online value and PayPal used by about 70% of online shoppers; Japan, cards still dominant (55% or 58%, sources differ); Switzerland, cards dominant; Canada, wallets nearly one third of online spending; **Spain: Bizum** is the most preferred; **Brazil: Pix**; **Netherlands: iDEAL**; **Belgium: Bancontact**.
- **India: UPI** [secondary reports citing NPCI; verify on npci.org.in]: a record **24.51 billion transactions in August 2026** (value about Rs 29.8 lakh crore), 23.66 billion in July, about 21.9 billion transactions across FY2025-26 per one report; UPI is described as about **85% of India's digital transactions**. App share of volume in July 2026: PhonePe about 46%, Google Pay about 32%, Paytm about 8%. For India, a UPI option is not optional.
- **Not found this session** [open items]: usage shares for Pix, iDEAL, Bancontact, Alipay and WeChat Pay (China was not searched). Pull the country sections of the Worldpay report (attribution required) before choosing a payment stack.
- **Rule:** accept the local default method of each launch market, or expect cart abandonment; the cost of adding a method is usually lower than the revenue lost without it. Cross-border purchase barriers also include delivery, customs and privacy, not only payment [practice, CSA Research].

## 2. Devices and connectivity

- **Mobile dominates the web in growth markets.** Reported mobile shares of web traffic: Africa about 82%, Asia-Pacific about 78%, global about 60.7% (StatCounter, March 2026, via a summary). India: StatCounter showed **about 67% mobile in June 2026**, while Similarweb reported about 72% for February 2026, a methodology gap [secondary].
- **Android is the main mobile platform** in these markets [practice, older data].
- **Global mobile performance baseline** (HTTP Archive *Web Almanac 2025*, CrUX data from July 2025) [primary-ish]: **48% of mobile origins pass all three Core Web Vitals** (44% in 2024, 36% in 2023) versus 56% on desktop; the mobile gap is INP (**77% pass on mobile, 97% on desktop**); the median mobile Total Blocking Time was **1,916 ms, up 58% year on year**, and JavaScript is the biggest problem on low-end devices. A secondary source citing Alex Russell puts about 30% of devices in the wild as low-end (4 cores or fewer, 4 GB RAM or fewer) [to verify].
- **Not found** [open item]: country-level pass rates for India, Brazil or Nigeria, connection speeds and median device specifications by market (use the CrUX country dashboard). Until sourced, design for a **low-end Android phone on a slow, intermittent connection** as the budget case: light pages, no layout shift, offline-tolerant, and test on a throttled device (see `domain-web-development-reference.md`).

## 3. Language and localization

- **CSA Research, *Can't Read, Won't Buy* (2020, with Kantar; 8,709 consumers in 29 countries)** [vendor-run survey, no independent replication found]: about **76% prefer to buy with product information in their own language**; about **40% say they will never buy from sites in other languages**; the preference is stronger among people who read English poorly. Earlier editions reported 72% to 75%. **These are stated preferences, not measured conversion lifts.**
- **Degree of localization** [one academic study via a trade summary, 87 participants, four site versions: English, direct translation, partial localization, high localization]: acceptance and purchase intention rose with the degree of localization; no effect sizes were available, so it is directional.
- **Right-to-left (Arabic, Hebrew, Farsi, Urdu)** [practitioner guides; no rigorous A/B tests isolating mirroring were found]: flipping the layout is not enough. **Mirror** navigation, forms, breadcrumbs, progress indicators and directional icons; **do not mirror** media controls, logos, universal-action icons or numbers (numbers read left to right even inside right-to-left text). The main bug source is **bidirectional text**: numbers, URLs and English words embedded in Arabic or Hebrew can render in a jumbled order unless direction is handled explicitly. A poorly done RTL experience is linked to higher bounce rates in guides but without controlled evidence. Test with native readers.
- Localize more than text: currency, number and date formats, address and name fields, payment methods, support hours, legal pages, imagery and examples.

## 4. Tax and pricing across borders

EU VAT applies to consumers' country; for non-EU sellers of digital services the One Stop Shop means one registration and quarterly returns, and sources say no small-seller threshold applies to non-EU sellers (see `domain-global-law-and-compliance-reference.md`). Show prices **tax-inclusive** where the local norm or law requires it, in local currency, with renewal terms clear before payment.

## 5. Do behavioural findings travel? Mostly not tested

- **WEIRD samples** (Henrich, Heine and Norenzayan, 2010): one analysis found about **96% of psychology samples came from countries holding about 12% of the world's population**; 73% of first authors were at US universities. Findings are routinely generalised to "people" from Western student samples [primary papers; secondary reporting].
- **The multi-site Many Labs 2 project** concluded setting did not substantially change replicability; a **2024 critique by Henrich and colleagues** argues its cultural analysis was exploratory and underpowered, so this is a **live dispute** [primary].
- A review of 893 cross-cultural psychology articles (2015 to 2016) found **96.7% of participants WEIRD**, over 85% American [secondary].
- **Hofstede-style "cultural dimensions"** [peer-reviewed HCI critiques, mixed]: one HCI study found the dimensions **not as widely generalizable** as the literature implies; critics call the model simplified, Western-oriented and slow to reflect cultural change. Studies linking site elements to the dimensions exist but are correlational with small samples; **no replicated experiment was found showing that adapting a site to national culture improves outcomes**. Cultural differences also affect **research method**: participants in some countries are less willing to criticise a design aloud, so a quiet usability session is not proof of success. Do not use national stereotypes to drive design; test locally and adjust facilitation.
- **Practical rule:** treat every effect size in `domain-human-behaviour-reference.md` as measured mostly in Western samples. Before relying on a persuasion or layout finding in another market, test it locally with local users, and prefer clarity, speed, familiar local payment and plain language over clever persuasion.

## 6. Market-entry order (when)

1. Choose launch markets by where the **customers already are** and the rules you can meet (`domain-global-law-and-compliance-reference.md`), not by population size.
2. For each market, in order: language and legal pages, local payment method, tax handling, performance on the typical device, support in local hours.
3. Launch one market end to end before opening a second; measure conversion by country and payment method.
4. Add markets when the previous one's unit economics are known (`domain-startup-money-and-legal-reference.md`).
