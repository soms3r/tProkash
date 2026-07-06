# Distribution Module

## Purpose

Manages the distribution network — distributors, distributor-bookstore relationships, and the supply chain from warehouse to retailer.

## Responsibilities

- Distributor directory management
- Distributor-bookstore relationships and territory mapping
- Edition-to-distributor assignment
- Distribution channel management
- Order and fulfillment tracking (future)

## Owned Data

- `distributor` — Distributor entities
- `edition_distributor` — Edition-to-distributor assignments
- `distributor_bookstore` — Distributor-bookstore relationships

## Dependencies

- `core` — Base types, ID generation
- `directory` — Publisher references
- `catalog` — Book and edition references
- `printing` — Inventory availability
- `bookstores` — Bookstore references

## Public Interfaces

- Distributor CRUD: `createDistributor` / `updateDistributor` / `getDistributor` / `listDistributors`
- Channel mapping: `assignDistributor` / `removeDistributor` / `getDistributionChannel`
- Territory: `getDistributorTerritory` / `getBookstoreDistributors`

## Future Features

- Order management (publisher → distributor → bookstore)
- Shipment tracking
- Sales reporting by distributor
- Distribution contract management
- Return management

## Out of Scope

- Retail bookstore management (see `bookstores` module)
- Printing and inventory (see `printing` module)
- Financial transactions or invoicing
