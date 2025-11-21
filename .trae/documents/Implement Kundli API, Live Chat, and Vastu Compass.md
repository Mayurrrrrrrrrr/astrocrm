## Current State (Verified)
- Backend URLs include `accounts` only (`backend/config/urls.py:21`).
- Channels scaffold exists with empty websocket router (`backend/config/asgi.py:15-21`).
- VedicAstroAPI helper is implemented in `consultation/utlis.py`:
  - `get_kundli_data(...)` (`backend/consultation/utlis.py:7-49`).
- Kundli app files exist but are empty (`backend/kundli/views.py`, `serializers.py`, `urls.py`).
- Frontend dashboard fetches `/api/accounts/demo-profile/` successfully (`frontend/src/App.jsx:285-299`).
- Vite proxy is configured for `/api` (`frontend/vite.config.js:11-16`).

## Task A — Kundli Generation
### Backend (DRF API)
- Add `BirthDetailsSerializer` in `backend/kundli/serializers.py` with fields: `year, month, day, hour, minute, lat, lon, tzone` (numbers). This keeps implementation deterministic without adding geocoding/timezone libraries.
- Implement `KundliGenerateView(APIView)` in `backend/kundli/views.py`:
  - `post(self, request)`: validate serializer, call `consultation.utlis.get_kundli_data(...)`, return JSON with `200` on success.
  - Error handling: if helper returns `None` (e.g., `ASTRO_API_KEY` missing or external error), return `502` with a friendly message.
- Define `backend/kundli/urls.py` with `path('generate/', KundliGenerateView.as_view())`.
- Include Kundli routes under `/api/kundli/` in `backend/config/urls.py` alongside accounts.
- Notes: import from `consultation.utlis` (file name is `utlis.py`). We will not rename to avoid breaking current references.

### Frontend (React + Tailwind)
- Create `frontend/src/components/kundli/KundliForm.jsx`:
  - Controlled inputs for `date (YYYY-MM-DD)`, `time (HH:MM)`, `lat`, `lon`, `tzone`.
  - Derive `year, month, day, hour, minute` from date/time before POST.
  - `axios.post('/api/kundli/generate/', payload)` wrapped in `try/catch` and show errors.
  - On success, render returned JSON:
    - Initial simple JSON viewer (`<pre>`) for all fields.
    - Optional table when planets array exists (keys differ by API; we guard with checks).
- Integrate into UI:
  - Add a new tab "Kundli" to the sidebar and mount `KundliForm` there, or place it in LiveConsultation side panel under "Kundli & Notes" for quick use.

- Future enhancement (not in this implementation): accept a single "Location" string and auto-geocode to `lat/lon` and compute `tzone` via Places + Time Zone APIs. We will keep inputs explicit for now.

## Task B — Live Chat (Channels/WebSockets)
### Backend (Channels)
- Implement `ChatConsumer` in `backend/consultation/consumers.py` using `AsyncWebsocketConsumer`:
  - `connect()`: accept and add to `group_name = f"chat_{room_name}"`.
  - `receive(text_data)`: broadcast JSON messages to group.
  - `disconnect()`: discard from group.
- Define `websocket_urlpatterns` in `backend/consultation/routing.py`:
  - `path('ws/chat/<str:room_name>/', ChatConsumer.as_asgi())`.
- Wire routing in `backend/config/asgi.py`:
  - Import `from consultation import routing` and replace the empty list with `routing.websocket_urlpatterns`.
- Use `AuthMiddlewareStack` already present for session-based auth; dev usage can proceed without further auth.

### Frontend (React component)
- Create `frontend/src/components/chat/ChatWindow.jsx`:
  - Connect to `ws://127.0.0.1:8000/ws/chat/<room>/` via `WebSocket`.
  - Maintain `messages` state (array of `{sender, text, timestamp}`) and append on incoming messages.
  - Send messages as JSON on Enter/send button.
  - Tailwind UI similar to current `LiveConsultation` layout for consistency.
- Optional: Populate `frontend/src/context/SocketContext.jsx` to manage socket lifecycle across components.

## Task C — Vastu Compass
### Frontend (Google Maps + Places + Overlay)
- Populate `frontend/src/components/maps/VastuCompass.jsx`:
  - Load Google Maps JS via script tag using `import.meta.env.VITE_GOOGLE_MAPS_API_KEY`.
  - Add a search input with Places Autocomplete; on selection, center the map to that location.
  - Render Satellite layer; overlay a Vastu grid (CSS absolute overlay with lines/labels for cardinal directions). Keep orientation north-up initially.
  - Provide a small compass indicator; later enhancements can rotate grid based on device orientation.
- Configuration: add `VITE_GOOGLE_MAPS_API_KEY` to a local `.env` (not committed). No keys go into source.

## Validation Plan
- Kundli API: test with sample inputs from Mumbai (e.g., `lat=19.0760, lon=72.8777, tzone=5.5`) using the form and confirm a `200` response; handle failing cases gracefully.
- WebSockets: open two browser tabs in the same room and ensure messages relay both ways.
- Vastu Compass: search for an address, verify map centers and grid overlays correctly.

## Deliverables
- Backend: serializers, views, urls for Kundli; Channels consumer and routing; ASGI update.
- Frontend: `KundliForm.jsx`, `ChatWindow.jsx`, `VastuCompass.jsx` integrated into the dashboard.
- Error handling in all API calls with user-friendly messages.

## Notes & Security
- Ensure `ASTRO_API_KEY` is configured in Django settings/environment; the helper reads it (`backend/consultation/utlis.py:22-27`).
- No secrets committed; Google Maps key read from `VITE_` env.
- Follow class-based views/serializers in Django and functional components/hooks in React throughout.