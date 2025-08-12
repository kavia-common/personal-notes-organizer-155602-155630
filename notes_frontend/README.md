# Personal Notes Organizer - Angular Frontend

Modern, clean, minimalistic Angular 19 app with:
- User authentication (sign up, login)
- Create, edit, delete notes
- Categorize and search notes
- Responsive layout with sidebar + top navbar
- Light/Dark theme toggle

## Quick start

1) Configure runtime API base URL
- Edit `src/assets/app-config.json` and set `"apiBaseUrl"` to your backend URL.
- Alternatively, set variables in `.env.example` and let your deployment map them into `app-config.json`.

2) Install and run
```bash
npm install
npm start
# open http://localhost:3000/
```

3) Build
```bash
npm run build
```

## API endpoints (expected)
- POST `/api/auth/login` { email, password } -> { token, user }
- POST `/api/auth/signup` { name, email, password } -> { token, user }
- CRUD `/api/notes`
- CRUD `/api/categories`

You can adjust paths in `core/services/api.service.ts` if your backend differs.

## Theming
The app uses CSS variables. Theme preference is saved under `localStorage` key `pno-theme`.

## Folder structure (main)
- `src/app/core/*` services, guards, interceptors
- `src/app/features/auth/*` auth screens
- `src/app/features/notes/*` notes list + editor
- `src/app/layout/*` navbar, sidebar, layout
- `src/app/models/*` TypeScript interfaces

## Testing
```bash
npm test
```
