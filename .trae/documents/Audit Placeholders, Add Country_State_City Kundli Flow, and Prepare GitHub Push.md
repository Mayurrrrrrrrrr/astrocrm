## Goals
- Replace direct lat/lon input with country → state → city selection that resolves lat/lon and timezone, then generates Kundli.
- Audit and complete current placeholders without breaking code.
- Prepare repository for pushing to GitHub `https://github.com/Mayurrrrrrrrrr/astrocrm` with proper ignore and structure.

## Audit & Fixes (No Breaking Changes)
- Consultation helpers: keep existing `consultation/utlis.py` and add a compatibility `utils.py` shim to avoid future typos (optional; retain current imports).
- Empty Django files: populate `consultation/urls.py` and `views.py` minimally (health endpoint) to ensure app doesn’t appear half-built; no changes to routing unless explicitly used.
- Channels: already implemented `ChatConsumer`, routing and ASGI wiring.
- Kundli app: serializers, views, urls are implemented; extend to support new location flow without removing existing API.
- Frontend placeholders:
  - Live Chat: switched to functional WebSocket component.
  - Schedule tab: now uses Vastu Compass with Places and grid overlay.
  - History/Earnings: retain placeholders but ensure they render stable content.

## Kundli: Country/State/City Flow (Frontend-first + API stays as-is)
### Approach
- Implement cascading selectors using Google Places Autocomplete:
  - Country input: Autocomplete with `(regions)` and type ‘country’.
  - State input: Autocomplete `(regions)` restricted by selected country (componentRestrictions).
  - City input: Autocomplete `(cities)` restricted by selected country; final selection provides geometry for lat/lon.
- Compute timezone via Google Time Zone API on the frontend using the selected city and the entered date/time:
  - `tzone = (rawOffset + dstOffset)/3600` using `timestamp = UTC seconds for provided date/time`.
- POST to existing backend endpoint `/api/kundli/generate/` with `year, month, day, hour, minute, lat, lon, tzone`.

### Files to Add/Update (Frontend)
- `src/components/kundli/LocationSelector.jsx`:
  - Three inputs (country/state/city) wired to Places Autocomplete.
  - Emits `{country, state, city, lat, lon}` on selection.
- `src/components/kundli/KundliForm.jsx`:
  - Replace direct lat/lon fields with `LocationSelector`.
  - Compute timezone by calling Google Time Zone API based on selected city and entered date/time.
  - Keep robust error handling and table/JSON render fallback for unknown API shapes.
- `src/App.jsx`:
  - Already includes Kundli tab; ensure imports and rendering remain intact.
- `.env` guidance:
  - `VITE_GOOGLE_MAPS_API_KEY` required; do not commit `.env`.

### Files to Add/Update (Backend)
- Optional `backend/consultation/utils.py` shim:
  - `from .utlis import *` to tolerate import spelling differences.
- Keep `KundliGenerateView` unchanged (API contract remains) to avoid breaking.
- Optional: add `/api/kundli/resolve-location/` later if you prefer server-side geocoding/timezone; initial implementation stays frontend-only to avoid adding server secrets.

## Additional Placeholder Completions
- `consultation/urls.py` and `views.py` health endpoint:
  - `GET /api/consultation/health` returns status for Channels and layer config; no side effects.
- Minimal `frontend` placeholders for History/Earnings:
  - Render static cards with “coming soon” and sample entries; keep minimal.

## Validation Plan
- Kundli flow:
  - Select country/state/city, pick date/time; verify city lat/lon resolved, timezone computed, and API returns 200 with planet data.
  - Verify error messaging when Google key missing or external API errors occur.
- Chat:
  - Open two tabs in `chat` tab; confirm message relay.
- Vastu:
  - Search a known address; verify map centers and grid overlay alignment.

## GitHub Push (After Code Updates)
- Create `.gitignore` at repo root:
  - Python: `__pycache__/`, `*.pyc`, `env/`, `.venv/`
  - Node: `node_modules/`, `dist/`, `.env`
  - Django/DB: `db.sqlite3`, `media/`
- Initialize and push:
  - `git init`
  - `git branch -M main`
  - `git remote add origin https://github.com/Mayurrrrrrrrrr/astrocrm`
  - `git add .`
  - `git commit -m "Initial working AstroCRM with Kundli, Chat, Vastu"`
  - `git push -u origin main`

## Security & Config
- Keep secrets out of source; `.env` holds `VITE_GOOGLE_MAPS_API_KEY`.
- Backend continues using `ASTRO_API_KEY` via Django settings; do not log secrets.
- No breaking changes to existing endpoints or routes; new UI augments rather than removes.

## Next Enhancements (optional)
- Server-side geocoding + timezone via env-stored Google key, or `timezonefinder/pytz` stack.
- Persist consultations and chat transcripts.
- Add payment stubs for later integration with gateways.