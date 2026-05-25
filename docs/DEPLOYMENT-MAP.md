# RINKIMIRIKATA DEPLOYMENT MAP

RINKIMIRIKATA is the public hub. It should not become one giant messy repo. It should connect everything and host small standalone HTML tools when useful.

## Main rule

Use RINKIMIRIKATA for:
- public navigation
- app launcher pages
- small standalone HTML tools
- demos
- test surfaces
- documentation
- registry files

Use separate repos for:
- serious projects
- systems with their own identity
- tools that will grow
- anything with build/deploy logic
- anything with workers/API/backend

Use Cloudflare R2 or another media bucket for:
- MP3 files
- videos
- large sprite sheets
- exported recordings
- thumbnails at scale
- downloads/zips

Do not put large media directly into this repo long-term.

## Recommended folders

/apps/ = stable or semi-stable public tools
/lab/ = rough experiments and temporary tests
/projects/ = directory of all public projects
/registry/ = JSON source of truth for hub listings
/docs/ = operating notes and deployment rules
/vault/ = small downloadable files only, not huge media

## Personal/user files rule

Tools that handle visitor files should process them in the browser where possible.

Examples:
- local MP3 upload for visualizer
- local CSV upload for CDME
- local image upload for art tools

Default privacy rule:
The file stays on the user's device unless the interface clearly says it will upload somewhere.

## Music/audio tools

Every audio-reactive tool should support three input modes:

1. EMVY CHECK library
   - Load tracks from public hosted MP3 URLs.
   - Best source: Cloudflare R2/CDN playlist JSON.

2. Local file
   - User chooses their own MP3/WAV/OGG.
   - Browser reads it with File API.
   - No upload required.

3. Microphone/live input later
   - Optional.
   - Requires user permission.

Recording should be browser-side where possible:
- canvas.captureStream()
- MediaRecorder
- WebM export first
- MP4 export can come later if needed

## CDME placement

CDME should probably be its own repo if it becomes serious.

Hub route:
/apps/cdme/ or external link to deployed CDME

Data handling:
- User uploads CSV/XLSX locally.
- Parse in browser when possible.
- Export results locally.
- No server upload unless explicitly needed.

## Pi Atlas / Visualizer placement

Pi Atlas Visualizer can start inside:
/apps/pi-atlas/

If it grows into a major engine, move to its own repo later and keep RINKIMIRIKATA as the launcher.

Expected inputs:
- EMVY CHECK track picker
- local MP3 picker
- optional text/number input
- record visual output

## Project registry

All public systems should appear in:
/registry/projects.json

Runnable hub apps should appear in:
/registry/apps.json

Minimum app entry:
{
  "id": "tool-name",
  "title": "Tool Name",
  "type": "visual system",
  "status": "prototype",
  "url": "/apps/tool-name/",
  "description": "Short useful description.",
  "tags": ["html", "canvas", "audio"]
}

## Practical publishing flow

For a simple HTML tool:
1. Create /apps/tool-name/
2. Add index.html
3. Add entry to /registry/apps.json
4. Test /apps/tool-name/
5. Link from /projects/ if it is a bigger system

For a serious project:
1. Create a separate repo
2. Deploy it independently
3. Add repo/live URL to /registry/projects.json
4. Optionally add a small launcher page in /apps/
