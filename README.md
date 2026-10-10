# Chat App

## Server
cd server && cp .env.example .env   # fill values
npm install && npm run dev

## Client
cd client && cp .env.example .env
npm install && npm run dev          # http://localhost:5173

## Netlify deployment

The root `netlify.toml` builds the React client from `client` and publishes
`client/dist`, with a fallback for React Router routes such as `/login`.
Connect the repository to Netlify and trigger a new deploy so it reads this
configuration; deploying the repository source folder directly will show a 404.

The Express/Socket.IO backend is deployed separately from the Netlify static
site. A `render.yaml` Blueprint is included for deploying it to Render:

1. Create a Render account and choose **New → Blueprint**, then connect this
   repository and apply the `render.yaml` configuration.
2. In MongoDB Atlas, create a database user and allow Render to connect under
   **Network Access**. Render instances can have changing outbound IPs; for a
   free Render service, Atlas may need the `0.0.0.0/0` access-list entry. Use a
   strong database password and restrict access further if you have stable
   outbound IPs or a private networking option.
3. In the Render setup form, provide the Atlas `mongodb+srv://` connection
   string as `MONGO_URI`, `CLIENT_URL` (the exact Netlify site origin, such as
   `https://your-site.netlify.app`), and `CLOUDINARY_URL`. URL-encode any
   special characters in the database username or password. Keep credentials
   private. Render generates `JWT_SECRET`.
4. After Render deploys, copy the backend's public URL, such as
   `https://chat-app-api.onrender.com`.
5. In Netlify, set `VITE_API_URL` to that backend URL without an `/api` suffix,
   then trigger a new frontend deploy. Vite embeds this value at build time.

The backend allows browser requests from the single origin configured by
`CLIENT_URL`. Render's free web services may sleep when idle, which can delay
the first request and interrupt live Socket.IO connections until the client
reconnects.

## Cloudinary media uploads

Chat photos and videos are uploaded from the server to Cloudinary. Configure
either `CLOUDINARY_URL` from the Cloudinary Dashboard, or set
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in
`server/.env`. If using the URL, use the format
`cloudinary://<api-key>:<api-secret>@<cloud-name>`. Optionally set
`CLOUDINARY_FOLDER` to choose the destination Media Library folder (defaults to
`chat-media`, relative to the library root). For example, use `photos` for the
`Home/photos` folder shown in the Cloudinary console. Keep credentials private
and only configure them on the server.

Uploads are limited to 50 MB per file. Cloudinary URLs are stored with chat
messages and are accessible to anyone who has the URL.

The client offers both a photo/video picker and a camera capture button. Camera
capture depends on browser and device support (and generally requires HTTPS outside
localhost).
