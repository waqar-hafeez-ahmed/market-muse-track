# Global Performance Chart Fix - Implementation Plan

## Backend Changes

- [x] Create global snapshot aggregation service function
- [x] Add global snapshot route endpoint
- [x] Update snapshot job to create global snapshots
- [ ] Add global snapshot model/index for efficient querying

## Frontend Changes

- [x] Create useGlobalSnapshots hook
- [x] Update API service with global snapshot endpoint
- [x] Update Index.tsx to use global snapshots

## Testing

- [x] Test backend global snapshot functionality ✓
- [ ] Test frontend global performance chart
- [ ] Verify polling/cron updates global snapshots
