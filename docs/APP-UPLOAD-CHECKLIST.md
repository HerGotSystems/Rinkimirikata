# APP UPLOAD CHECKLIST

Use this when adding any tool, visualizer, experiment or program to RINKIMIRIKATA.

## 1. Choose placement

### Put inside RINKIMIRIKATA when:
- it is a single HTML app
- it has no backend
- it is okay as public prototype
- it is small enough to keep in the repo

Path:
/apps/tool-name/index.html

### Put in LAB when:
- it is rough
- it may be broken
- it is temporary
- it is just for testing

Path:
/lab/tool-name/index.html

### Put in separate repo when:
- it is a serious standalone project
- it will grow
- it needs Cloudflare Workers/API/backend
- it has many files/assets
- it may become product/SaaS/toolkit

Then link it from RINKIMIRIKATA.

## 2. Decide status

Use one of these:

- live
- stable
- stable-ish
- prototype
- rough
- broken-interesting
- source available
- planned
- private-local

## 3. Privacy label

Every app that uses visitor data/files should be marked clearly.

Use:

- browser-local
- uploads-to-server
- account-required
- public-data-only
- unknown-not-reviewed

Default should be browser-local.

## 4. Minimum app folder

/apps/tool-name/
    index.html
    manifest.json
    README.md

## 5. Minimum manifest.json

{
  "id": "tool-name",
  "title": "Tool Name",
  "type": "visualizer",
  "status": "prototype",
  "privacy": "browser-local",
  "entry": "./index.html",
  "description": "Short plain description.",
  "supports": ["local files", "recording"],
  "needs": ["testing", "UI polish"],
  "source": "RINKIMIRIKATA"
}

## 6. Registry entry

Add app to:
/registry/apps.json

Example:

{
  "id": "tool-name",
  "title": "Tool Name",
  "type": "visualizer",
  "status": "prototype",
  "privacy": "browser-local",
  "url": "/apps/tool-name/",
  "description": "Short description.",
  "tags": ["html", "canvas", "audio"]
}

## 7. Large files rule

Do not put big MP3, MP4, ZIP, sprite-sheet or export files directly in this repo long-term.

Use R2/CDN for:
- music
- video
- big images
- generated exports
- downloadable packs

## 8. Review before public listing

Before adding to the public registry, check:

- Does it open?
- Is there an index.html?
- Does it work on mobile enough?
- Does it say whether files stay local?
- Does it avoid exposing API keys?
- Does it avoid broken external links?
- Is status honest?

## 9. Status wording rule

Do not pretend unfinished tools are finished.

Better labels:
- prototype
- public test
- early engine
- rough lab build
- stable-ish

Honest labels make the hub stronger, not weaker.
