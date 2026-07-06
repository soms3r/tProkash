# Marketplace Module

## Purpose

Enables book discovery and transaction facilitation — connecting readers with books, bookstores, and publishers for purchase and distribution.

## Responsibilities

- Book availability lookup across bookstores and distributors
- Price and offer aggregation
- Purchase redirect (referral to bookstore/publisher storefront)
- Want-list and notification for out-of-stock books
- Marketplace listing management

## Owned Data

- Marketplace listings (book + seller + price + availability)
- Want-list entries
- Price history records
- Referral tracking data

## Dependencies

- `core` — Base types, ID generation
- `catalog` — Book and edition references
- `bookstores` — Seller references and inventory
- `distribution` — Distributor pricing and availability
- `community` — Reviews and ratings for listings

## Public Interfaces

- Listing: `searchListings(query, filters)` / `getListingDetails`
- Price: `getPriceHistory(bookId)` / `comparePrices(bookId)`
- Wants: `addToWantList(userId, bookId)` / `notifyWhenAvailable`
- Redirect: `getPurchaseLink(listingId)` / `trackReferral`

## Future Features

- Direct purchase integration (affiliate links, API purchase)
- Price drop alerts
- Used/secondhand book marketplace
- Pre-order management
- Seller ratings and trust scoring

## Out of Scope

- Payment processing or financial transactions
- Order fulfillment and logistics
- Book catalog management (see `catalog` module)
- Reader reviews (see `community` module)
