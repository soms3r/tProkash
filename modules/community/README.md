# Community Module

## Purpose

Manages community-driven content — reader reviews, ratings, events, awards, and social features that enrich the publishing ecosystem with user-generated contributions.

## Responsibilities

- Reader reviews and ratings for books and publishers
- Event management (book fairs, signings, launches, readings)
- Award management (book awards, publisher awards)
- Event and award participation tracking
- Content moderation (review approval, spam detection)
- Reader profiles and reading history

## Owned Data

- `reader` — Reader profiles
- `review` — Book and publisher reviews
- `event` — Publishing events
- `award` — Book awards and honors
- `book_award`, `book_event`, `event_participant` — Participation records

## Dependencies

- `core` — Base types, ID generation
- `catalog` — Book and author references for reviews and awards
- `directory` — Publisher references for events and awards
- `identity` — User identification for readers and moderators

## Public Interfaces

- Reviews: `submitReview` / `getReviews(entityId)` / `moderateReview(reviewId, action)`
- Events: `createEvent` / `updateEvent` / `listEvents` / `registerParticipant`
- Awards: `createAward` / `nominateBook` / `awardWinner` / `getAwards`
- Ratings: `getAverageRating(entityId)` / `getRatingDistribution(entityId)`

## Future Features

- Reading lists and book clubs
- Discussion forums per book/publisher
- Community-driven corrections and suggestions
- User reputation and contribution scoring
- Event ticketing and RSVP

## Out of Scope

- Book catalog management (see `catalog` module)
- Publisher verification (see `directory` module)
- User authentication and roles (see `identity` module)
- E-commerce or marketplace features (see `marketplace` module)
