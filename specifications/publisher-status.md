# Publisher Status

**Version:** 1.0.0\
**Status:** Approved

---

## Purpose

Define the operational status model for a Publisher. Status reflects the publisher's current business state, not the quality or verification level of the data.

## Status Values

| Status | Definition | Behavior |
|---|---|---|
| active | Currently publishing and operational. Accepting submissions. Books in print. | Default status. Fully visible in search and datasets. |
| inactive | Registered but not currently publishing. May resume operations. | Visible but flagged as inactive. Filtered from active-only queries. |
| defunct | Permanently ceased operations. Will not resume. | Historical record only. Not included in active datasets. |
| suspended | Temporarily inactive due to administrative reasons. | Same as inactive. Includes reason in notes. |

## Status Transition Diagram

```
                  ┌────────────────────────────┐
                  │                            │
    [creation]    v                            │
  ┌─────────┐  ┌────────┐                   │
  │  null   │──│ ACTIVE │────────────────────┘
  └─────────┘  └──┬─────┘  (can return to active)
                  │         │
                  v         v
            ┌────────┐ ┌──────────┐
            │INACTIVE│ │SUSPENDED │
            └───┬────┘ └────┬─────┘
                │           │
                v           v
          ┌──────────┐
          │ DEFUNCT  │
          └──────────┘
```

## Transition Rules

| From | To | Allowed | Conditions |
|---|---|---|---|
| (new) | active | Yes | Default on creation |
| active | inactive | Yes | Publisher confirms pause |
| active | suspended | Yes | Administrative action |
| active | defunct | Yes | Evidence of cessation |
| inactive | active | Yes | Publisher confirms resumption |
| inactive | defunct | Yes | Inactive > 5 years |
| suspended | active | Yes | Issue resolved |
| suspended | inactive | Yes | Extended suspension |
| suspended | defunct | Yes | Evidence of cessation |
| defunct | any | No | Terminal state |

## Status Effects on Operations

| Operation | active | inactive | suspended | defunct |
|---|---|---|---|---|
| API search inclusion | Yes | Yes (filterable) | Yes (filterable) | No |
| Public dataset inclusion | Yes | Yes (flagged) | Yes (flagged) | No |
| New submissions accepted | Yes | No | No | No |
| New book registrations | Yes | No | No | No |
| Display in publisher directory | Yes | Yes (with note) | Yes (with note) | No |
| Verification required | Yes | Yes | Yes | Historical |

## Status Justification

Every status transition (except null → active) must include a reason stored in change_history. Transitions to defunct require evidence (source reference).

## Related

- Publisher standard: `specifications/publisher-standard.md`
- Publisher verification: `specifications/publisher-verification.md`
