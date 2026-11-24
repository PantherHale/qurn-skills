# Law and compliance outside the US: where to look and what is moving

Researched 2026-11-07. **Not legal advice; every item below needs a qualified local professional before action.** Many sources are law-firm and vendor commentary; where they conflict the conflict is stated, because a wrong date is the main risk in this file. Rule of thumb for scope: laws usually attach to **where your users are**, not where your company is registered. Tags as in `domain-atlas-reference.md`.

## 1. Quick scope table

| If you have users in | Check first | Status of the date or rule |
|---|---|---|
| EU | GDPR and the ePrivacy cookie rule; accessibility (EAA); DSA/consumer law on dark patterns; VAT One Stop Shop; AI Act if you ship AI features | see sections 2 to 5 |
| UK | UK GDPR; consumer law (DMCC Act 2024: subscriptions, fake reviews, drip pricing); accessibility under the Equality Act | section 3 |
| India | DPDP Act and Rules 2025; consumer dark-patterns guidelines | section 4 |
| Canada, Quebec | PIPEDA; Quebec Law 25 (stricter) | section 6 |
| Brazil | LGPD | section 6 |
| China | PIPL (data export assessment) | section 6 |
| Japan, Singapore, Australia | APPI; PDPA; Privacy Act | section 6 (thin) |
| US | state privacy laws, FTC/ROSCA, ADA | `domain-human-behaviour-reference.md`, `domain-web-development-reference.md` |

## 2. European Union

- **GDPR and cookies.** Current obligations stay in force. The Commission's **Digital Omnibus** (published 19 Nov 2025) proposes moving the cookie/terminal-equipment consent rule into the GDPR as Article 88a and adding exemptions (for example for first-party aggregated audience measurement). Reports on the Council's position **conflict** (different draft dates; one says the proposed browser-signal article was dropped) and the package was still in negotiation with a final vote expected later in 2026 [to verify against EUR-Lex]. The separate AI part was reported approved by the Council on 29 June 2026. **Plan to today's rules** and watch the outcome. Enforcement-fine trends were not retrieved [open item].
- **Dark patterns.** The **Digital Services Act Article 25** bars online platforms from dark patterns; the Commission's planned **Digital Fairness Act** would target dark patterns, subscription traps, addictive design and influencer marketing; sources disagree on timing (a draft reported as expected around 11 Nov 2026, or Q4 2026) and one claimed it had been unveiled, which other sources contradict [to verify]. Enforcement actions under Article 25 were not found [open item].
- **Withdrawal button (in force 19 June 2026).** Directive (EU) 2023/2673 adds Article 11a to the Consumer Rights Directive: a **withdrawal function** for distance contracts concluded online where a right of withdrawal exists [law-firm and vendor reports]. Described as a two-step flow with an automatic confirmation sent by email, and it must not sit behind unreasonable barriers such as forcing a login the purchase did not need. Member states were due to transpose by 19 December 2025 but **not all had**: Belgium and Ireland were reported as not yet transposed in mid-2026. Penalties are national (one German source cites fines up to EUR 2 million or 4% of annual turnover; do not treat that as EU-wide). Confirm national rules and exceptions with counsel; the directive's own text was not read.
- **Accessibility.** European Accessibility Act enforceable since 28 June 2025 (see the web development brief); EN 301 549 update to WCAG 2.2 reported as pending citation around October to November 2026 [to verify].
- **AI Act.** [primary-ish via law-firm reports] Article 50 **transparency obligations (for example telling people they are talking to an AI) stay on the original date of 2 August 2026**; general-purpose AI obligations have applied since 2 August 2025; the Digital Omnibus on AI **delays high-risk obligations** to 2 December 2027 (standalone high-risk systems) and 2 August 2028 (AI inside regulated products). Check the Official Journal for the final text.
- **VAT.** [practice, conflicting vendor sources] Non-EU sellers of B2C digital services use the **Non-Union One Stop Shop**: register in one member state and file quarterly; the EUR 10,000 distance-selling threshold is generally described as applying to EU-established sellers only, so assume **VAT applies from the first sale** and confirm with an adviser. **IOSS** covers imported goods of EUR 150 or less. Reforms (ViDA) phase in through 2028.
- **Consumer rights to design for:** clear total price and renewal terms before payment, easy cancellation, and the standard withdrawal period for distance sales (confirm the current rules for your product type).

## 3. United Kingdom

- **DMCC Act 2024.** The regulator (CMA) has had **direct consumer-law fining powers since 6 April 2025**; penalties can reach a share of global turnover [practice]. The new **subscription contracts regime**: reports **conflict** on the start (January 2027 reported as the brought-forward target; one firm still says spring 2027; it has slipped twice before). Treat as "arrives within about a year; design cancellation to be as easy as signup now". The CMA opened a subscription-related case against a large software vendor in July 2026 before the regime starts, showing enforcement does not wait [practice].
- **Fake reviews and drip pricing are already in force** (the DMCC Act's consumer provisions started 6 April 2025) [law-firm reports]: it is banned to submit, commission or facilitate fake or misleading reviews, or to hide that a review was paid for or incentivised, and traders must take "reasonable and proportionate steps" to stop fake reviews appearing on their sites; **all mandatory charges must be included in the headline price** (no drip pricing). Both are "banned practices" presumed unfair, so the regulator does not have to argue they misled anyone. The regulator signalled a support-first period at the start; the later status of its drip-pricing guidance was not checked [to verify]. Interaction with the Data (Use and Access) Act, and UK accessibility under the Equality Act: not retrieved [open items].

## 4. India

- **DPDP Act and Rules 2025** [primary-ish: multiple law-firm summaries]: Rules notified in **November 2025** with a staggered start. The Data Protection Board provisions took effect immediately; **consent-manager provisions about 12 months later (reported as 14 Nov 2026)**; the **main duties for data fiduciaries about 18 months after notification (reported as 13 or 14 May 2027; sources differ by a day)**. Verifiable parental consent is required for children's data with listed exemptions; penalties up to Rs 250 crore. Confirm dates in the Gazette.
- **Dark patterns.** The Central Consumer Protection Authority's **2023 guidelines list 13 specific dark patterns** (drip pricing, bait and switch, forced disclosure, nagging and others) and apply to platforms, sellers and advertisers; in 2025 the authority asked e-commerce platforms to self-audit. A dark pattern can also breach DPDP consent rules. The full list of 13 was not retrieved [open item].

## 5. Accessibility beyond the EU

- Common technical benchmark worldwide: **WCAG 2.1 AA, with 2.2 AA the safer target** [practice].
- **US:** a 2024 DOJ rule requires WCAG 2.1 AA for state and local government web content and apps, with compliance dates **extended by an interim final rule dated 20 April 2026** [to verify]; nearly **4,000 federal web-accessibility suits were reported for 2024** (no 2026 count found) [secondary].
- **Canada:** Accessible Canada Act (federal, goal of 2040) and Ontario's AODA described as one of the toughest provincial laws. **Australia:** Disability Discrimination Act, WCAG 2.2 AA recommended but not legislated (low-quality source). UK Equality Act and India's RPwD Act: not retrieved [open items].

## 6. Other privacy regimes (comparison is thin; read the regulators)

- **Canada:** federal PIPEDA still applies (Bill C-27 died in January 2025; a successor was reported introduced in June 2026). **Quebec Law 25** is stricter, with GDPR-scale penalties (reported CAD 25 million or 4% of worldwide turnover) and opt-in for sensitive data.
- **Brazil LGPD:** modelled on GDPR with ten legal bases and a data protection officer required.
- **China PIPL:** exporting personal data needs a government security assessment, a standard contract or certification; **localization is the main design impact**.
- **Japan APPI:** permits opt-out third-party provision for non-sensitive data (secondary blog; verify). **Singapore PDPA:** consent-based without a GDPR-style legal-basis list (secondary). **Australia:** recent amendments on breach notification and children's privacy; no substantive comparison found [open item].
- Primary sources: EU (EUR-Lex, EDPB), Brazil's ANPD, China's CAC, Japan's PPC, Singapore's PDPC, Australia's OAIC, Quebec's CAI, India's MeitY gazette.

## 7. How Qurn uses this

At the start checkpoint, list the countries the users are in and run section 1. Every "check" becomes an ASK to a professional with the exact question; every date marked [to verify] goes into the risk register with an owner and a re-check date. Consent, cancellation and pricing design follow the strictest regime you serve, because it is cheaper than building per-country variants.
