# Chat App

## Server
cd server && cp .env.example .env   # fill values
npm install && npm run dev

## Client
cd client && cp .env.example .env
npm install && npm run dev          # http://localhost:5173

## S3 note
Chat images are stored under `chat/` in your bucket. For images to display, allow public read on
that prefix (bucket policy + relax "Block public access" for it), or serve via CloudFront.
