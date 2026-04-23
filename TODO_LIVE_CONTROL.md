# Live Control Implementation TODO

## Status: ✅ PLAN APPROVED - In Progress

### 1. [ ] Create TODO.md (DONE)
### 2. [✅] Update ProtectedLiveControl.jsx - Add role check + CompleteLiveControl
### 3. [ ] Update AppRoutes.jsx - Route /match/:id/live-control → Protected → CompleteLiveControl
### 4. [ ] Rewrite CompleteLiveControl.jsx 
   - Load match/teams/players dynamically
   - Dynamic batter list from scorecard (not_out)
   - Player selects for striker/non-striker (batting team), bowler (bowling team)
   - Real current bowler/figures from liveData
   - Current over balls from recentBalls
   - Dynamic scorecards (batting/bowling)
   - Commentary from recent balls or backend
   - Innings start/end buttons
   - Fix commitShot with proper batsmanId/bowlerId
   - UX: Toasts/spinners, no alerts
### 5. [✅] Deprecate LiveControl.jsx - Rename to LiveControl.OLD
### 6. [ ] Test
   - cd Score-11-User && npm run dev
   - Create match with teams/players
   - Access /match/:id/live-control
   - Verify: Teams/players load, set striker/bowler, add balls, real-time updates, scorecards
### 7. [ ] Complete - attempt_completion

