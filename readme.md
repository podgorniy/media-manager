# Self hosted media manager

Community in [Spectrum Chat](https://spectrum.chat/media-manager).

# Demo

https://mm.dmitrypodgorniy.com

- login: demo
- password: 123

Or just click "Login to demo account" button.

## Features

- Media
    - Autofit layout for preview mode
    - Tagging
    - Operations on selection of media
        - shift+click to add/remove media from selection
        - adding/removing tags
        - adding/removing from collection
    - By default all media is accessible only by owner (even direct links to media)
    - Share links to individual media files
    - Zoomed view
        - Zoom even more (mouse wheel)
        - Drag aground
- Tags
    - Filter media by tags.
    - Media is auto tagged (tags based on media type type, shared files are tagged)
- Collections
    - Create, delete, rename
    - Public and private collections
    - Optional password for public collections


## Running application with Docker

Prerequisites:

- docker

Check environment variables for configuration in `docker-compose.yml` and default values in `.env` file.

For example:

Create account `dima` (if account exists password will be changed) with password `ppp` and run web app on `8888` port:

```
ACCOUNT_NAME=dima ACCOUNT_PASSWORD=ppp EXPOSED_PORT=8888 docker-compose up --build -d
```


### Manual installation

Prerequisites:

- nodejs
- mongodb

Install production dependencies

```
npm install --production
```

Override environment variables from `.env` file an run

```
npm run prod
```


## Development

Prerequisites:

- nodejs
- mongodb

Runs in demo mode with account `demo` and password `123`.

```
npm install
npm run dev
```
