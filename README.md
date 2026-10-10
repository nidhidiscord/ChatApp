# Chat App

## Server
cd server && cp .env.example .env   # fill values
npm install && npm run dev

## Client
cd client && cp .env.example .env
npm install && npm run dev          # http://localhost:5173

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
