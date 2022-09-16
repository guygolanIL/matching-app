# Use this starter to bootstrap an express + prisma backend with TS

## db - config a db (locally or provisioned in the cloud via railway or similar). 
1. update schema.prisma with your provider
```prisma
datasource db {
  provider = "postgresql" // or other db
  url      = env("DATABASE_URL") // from .env
}
```
2. update DATABASE_URL in .env for the correct db url
3. run ```npx prisma migrate dev --name {your first migration name}```

## scripts
- start - starting the server (production script)
- dev - starting the server (locally)


