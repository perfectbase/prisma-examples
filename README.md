## Setup environment variables

copy `apps/sst/.env.example` to `apps/sst/.env` and fill in the values

## Configure and run the app

```bash
# install packages
npm install
# push prisma schema to database
npm run db:push
# start sst
npm -w sst-prisma run dev
```
