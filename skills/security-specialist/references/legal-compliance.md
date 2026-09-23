# Security: legal and compliance checks

Operator, 2026-09-23: the security specialist also protects the project in legal matters. These are product checks a
reviewer can verify in code and copy. They are not legal advice: when a project is in a regulated area (health,
finance, children, gambling) say so and recommend a lawyer. Skip an item only with the reason (for example "no email
is sent"). A missing item that applies is a finding: cite the file.

## Email and messaging
- [major] Every marketing email carries a working one-click unsubscribe link and a `List-Unsubscribe` header; the
  handler really stops sends (check the send path reads the flag). Transactional mail (receipts, resets) is exempt.
- [major] Marketing consent is opt-in, never a pre-ticked box (GDPR/PECR, Canada CASL); store when and how consent
  was given. US CAN-SPAM: a physical postal address in the footer, honest subject lines, opt-outs honoured quickly.
- [minor] SMS and push marketing: same opt-in and a STOP keyword or settings switch.

## Age and children
- [major] Signup has an age gate when the service is not for children. Under 13 in the US (COPPA) needs verifiable
  parental consent or the account is refused; the EU sets 13-16 by country (GDPR Art. 8); the UK Children's Code
  applies to services children are likely to use.
- [blocker] Alcohol, gambling, adult or age-restricted goods: an age check before the content or the checkout.

## Privacy and user rights
- [major] A privacy policy that names the real data categories, processors (Stripe, Supabase, Anthropic, OpenAI,
  analytics), retention periods and the contact for requests.
- [major] Users can export their data, correct it and delete their account; deletion removes the login and stored
  files (see the security checklist).
- [major] Cookie banner before any non-essential cookie or tracker loads, with Reject as easy as Accept (ePrivacy,
  GDPR). Analytics that set cookies wait for consent.
- [minor] US: a "Do Not Sell or Share My Personal Information" link where CCPA/CPRA applies (selling or sharing data
  for ads); honour Global Privacy Control signals.
- [minor] A written breach plan: GDPR expects notification to the regulator within 72 hours.

## Subscriptions, payments and consumer law
- [major] The price, billing period and auto-renewal are shown before the charge; cancelling online is as easy as
  signing up (California's auto-renewal law and similar state laws); a renewal reminder for yearly plans.
- [major] Card data never touches the app's servers: hosted checkout or hosted fields (PCI DSS scope).
- [minor] Terms of service and a refund policy are linked at checkout. EU buyers of digital content have a 14-day
  withdrawal right unless they expressly waive it at purchase.

## Content, licences and AI
- [major] Dependencies: no GPL/AGPL code inside closed-source distribution without meeting its terms; keep the
  licence notices the licences require (`npx license-checker --summary`).
- [major] Fonts, images, icons and audio have a licence that covers this use; no scraped or stock assets without one.
- [minor] User-generated content: a way to report content and a copyright takedown contact (DMCA; the EU Digital
  Services Act for platforms).
- [minor] AI features: tell users when they are talking to an AI or seeing AI-generated media (EU AI Act transparency
  duties apply from August 2026); do not send personal data to a model provider the privacy policy does not name.

## Accessibility law
- [major] Public websites and apps sold in the EU fall under the European Accessibility Act (from June 2025); US
  sites face ADA claims. The practical bar for both is WCAG 2.1 AA: the test board's accessibility testers are the
  evidence.

## Business identity
- [minor] A contact route and the legal business name on the site; an imprint (Impressum) for German and Austrian
  audiences.
