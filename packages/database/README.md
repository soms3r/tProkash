# @tprokash/database

Database abstraction layer for tProkash.

## Status

Skeleton — no ORM, no SQL, no migrations. Provides a `DatabaseAdapter` interface for future implementation.

## Usage

```ts
import { createAdapter } from "@tprokash/database";

const adapter = createAdapter();
await adapter.connect({ url: process.env.DATABASE_URL });
console.log(adapter.isConnected()); // true
await adapter.disconnect();
```

## Design

- Adapter pattern — swap implementations without changing consumer code.
- No ORM dependency in this package.
- Concrete implementations (PostgreSQL, SQLite, etc.) will live in separate packages.
