# Putting a static site online as a public showcase: reference

Learned from the Qurn Cola build (2026-11-03). Operator questions that the skills could not answer: "can I launch this so the public can see it", "I do not want my account name in the URL", "what is the difference between Pages and Workers", "why does account analytics show 3k views and web analytics 0", "did you commit that tool folder to the repo".

## Before the repo goes public
- Run `git ls-files` and read it. Tool folders (agent skills, design tools, local caches such as `.agents/`, `.claude/`, `impeccable`), notes, review files and local screenshots do not belong in a public showcase repo. Add them to `.gitignore` and remove them from the index before the first public push. Tell the operator what was excluded.
- Check history for secrets and personal data (emails, tokens, absolute local paths) before making the repo public.
- Credit CC0 or licensed assets (HDRIs, fonts) in the README.

## Hosting a static site on Cloudflare
- Cloudflare Pages: the URL is `<project-name>.pages.dev`, so the account name is not in it. Choose the project name carefully, because it is the public address. Best fit for a plain static folder, deployed from the GitHub repo with no build command and the output directory set to the folder that holds `index.html`.
- Cloudflare Workers (static assets): the default URL is `<name>.<account-subdomain>.workers.dev`, which includes the account subdomain. To avoid it, use Pages or attach a custom domain.
- Say plainly which of the two the operator is looking at when they paste a URL; the dashboards look alike.

## Reading analytics without scaring people
- Account-level traffic counts every request, including assets, bots, crawlers and link-preview fetchers, so it is far higher than real visitors. Web Analytics only counts real page views from a beacon and shows zero if the beacon is not enabled. A gap like 3k versus 0 is normal; it does not mean another site exists.
- Explain requests vs visits vs page views in one sentence each, and say where the traffic comes from (a data-centre region with many requests is usually bots).

## Cache and deploy checks
- After a push, confirm the deploy finished, then load the live URL in a fresh profile with cache disabled. Static hosts and phones cache CSS and JS; a user who "still sees the old version" needs a hard refresh, and the fix should say so.
- When verifying a CSS fix locally, reload with cache ignored before judging. A fix can be on disk and still absent from the page.

## Public showcase of a real brand
Do not publish a lookalike of a real brand (name, logo, contour shapes, ribbon) as your own product without the operator deciding explicitly. The default is a made-up brand with the same design; if they keep a shape, record that choice and keep the page clearly a demo.
