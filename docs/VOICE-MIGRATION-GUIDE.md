# Voice Migration Guide: WebSocket → WebRTC

## ✅ Migration Complete

The voice system has been successfully migrated from WebSocket-based to WebRTC-based architecture with full safety checks and monitoring.

---

## 🏗️ Architecture Overview

### **Old Implementation (WebSocket)**
- File: `src/utils/realtime/RealtimeVoiceClientEnhanced.ts`
- Edge Function: `supabase/functions/realtime-voice-relay/index.ts`
- Connection: WebSocket relay to OpenAI Realtime API
- Security: API key in edge function header

### **New Implementation (WebRTC)**
- File: `src/utils/realtime/RealtimeVoiceClientWebRTC.ts`
- Edge Function: `supabase/functions/realtime-student-guide-token/index.ts`
- Connection: Direct WebRTC peer connection to OpenAI
- Security: Ephemeral tokens (more secure, no long-lived credentials)

---

## 🎭 Persona System

The new implementation supports two personalities:

### **1. Demo Guide** (`persona: 'demo-guide'`)
- **Used in**: `/demo/realtime-guide`
- **Personality**: Warm, friendly, less formal
- **Voice**: Ash (male)
- **Purpose**: Quick platform demos and introductions

### **2. Student Tutor** (`persona: 'student-tutor'`)
- **Used in**: Student Dashboard voice chat
- **Personality**: Professional, male, formal tutor
- **Voice**: Ash (male)
- **Purpose**: Classroom activities and exercises
- **Adapted from**: `realtime-voice-relay` instructions

---

## 🚀 Gradual Rollout System

### **Feature Flag Control**
The migration is controlled by the `voice_webrtc_migration` feature flag in the database:

```sql
-- Check current rollout percentage
SELECT * FROM voice_feature_flags WHERE flag_name = 'voice_webrtc_migration';

-- Enable for 10% of users (PHASE 1)
UPDATE voice_feature_flags 
SET enabled = true, rollout_percentage = 10 
WHERE flag_name = 'voice_webrtc_migration';

-- Increase to 50% (PHASE 2)
UPDATE voice_feature_flags 
SET rollout_percentage = 50 
WHERE flag_name = 'voice_webrtc_migration';

-- Full rollout 100% (PHASE 3)
UPDATE voice_feature_flags 
SET rollout_percentage = 100 
WHERE flag_name = 'voice_webrtc_migration';

-- INSTANT ROLLBACK: Disable completely
UPDATE voice_feature_flags 
SET enabled = false, rollout_percentage = 0 
WHERE flag_name = 'voice_webrtc_migration';
```

### **How Rollout Works**
- Users are **deterministically bucketed** based on their user ID hash
- A user in the 0-9% bucket will ALWAYS be enrolled when rollout is ≥10%
- This ensures consistent experience (no A/B switching)
- Bucket assignment is stable across sessions

---

## 📊 Monitoring Dashboard

Access at: `/voice-monitoring` (teachers and admins only)

### **Metrics Tracked**
- ✅ Connection success rate (WebRTC vs WebSocket)
- ⚡ Average latency (avg, P95, P99)
- 🔊 Audio chunks sent/received
- 🔄 Buffer underruns
- 🔁 Reconnection attempts
- ❌ Error logs with full context

### **Real-Time Updates**
The dashboard subscribes to database changes and updates automatically when new sessions are logged.

---

## 🛡️ Safety Checks Built-In

### **1. Feature Flag Fallback**
```typescript
// StudentDashboard automatically falls back to WebSocket if:
// - Feature flag is disabled
// - User is not in rollout percentage
// - Flag data is still loading
const useWebRTC = !flagLoading && isEnabled;
const voiceSession = useWebRTC ? webrtcVoice : websocketVoice;
```

### **2. Error Logging**
All errors are automatically logged to `voice_session_errors` table:
```typescript
await monitoring.recordError({
  errorType: 'connection_failed',
  errorMessage: error.message,
  stackTrace: error.stack,
  isRetryable: true,
});
```

### **3. Session Metrics**
Every session is tracked in `voice_session_metrics`:
- Connection duration
- Latency measurements
- Success/failure status
- Implementation type used

---

## 🔍 Debugging

### **Check Which Implementation a User Is Using**
```sql
-- Most recent sessions for a specific student
SELECT 
  implementation_type,
  connection_success,
  avg_latency_ms,
  created_at
FROM voice_session_metrics
WHERE student_id = 'USER_ID_HERE'
ORDER BY created_at DESC
LIMIT 10;
```

### **Check Feature Flag Enrollment**
```typescript
// In browser console:
const userId = 'your-user-id';
const hash = [...userId].reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0);
const bucket = Math.abs(hash) % 100;
console.log(`User bucket: ${bucket}%`);
// If bucket < rollout_percentage, user is enrolled
```

### **Console Logging**
The Student Dashboard logs which implementation is active:
```
[StudentDashboard] 🔧 Using WebRTC (NEW) voice implementation
// or
[StudentDashboard] 🔧 Using WebSocket (LEGACY) voice implementation
```

---

## 🚨 Red Flags That Trigger Rollback

Monitor these metrics in `/voice-monitoring`:

1. **WebRTC success rate < 90%** (WebSocket is ~95%)
2. **WebRTC latency > 2x WebSocket latency**
3. **Error rate > 5%** in any implementation
4. **Buffer underruns > 10 per session**
5. **Reconnection attempts > 3 per session**

**If any of these occur, immediately rollback:**
```sql
UPDATE voice_feature_flags 
SET rollout_percentage = 0 
WHERE flag_name = 'voice_webrtc_migration';
```

---

## 📈 Recommended Rollout Schedule

### **Week 1: 10% Rollout**
```sql
UPDATE voice_feature_flags 
SET enabled = true, rollout_percentage = 10 
WHERE flag_name = 'voice_webrtc_migration';
```
- Monitor for 24-48 hours
- Check dashboard every 6 hours
- Compare metrics vs WebSocket baseline

### **Week 2: 50% Rollout**
```sql
UPDATE voice_feature_flags 
SET rollout_percentage = 50 
WHERE flag_name = 'voice_webrtc_migration';
```
- Monitor for 24-48 hours
- Larger sample size for statistical significance

### **Week 3: 100% Rollout**
```sql
UPDATE voice_feature_flags 
SET rollout_percentage = 100 
WHERE flag_name = 'voice_webrtc_migration';
```
- Monitor for 1 week with full production load

### **Week 4: Cleanup (Optional)**
If WebRTC is stable at 100% for 1+ week:
- Remove WebSocket fallback code
- Delete `realtime-voice-relay` edge function
- Delete `RealtimeVoiceClientEnhanced.ts`

---

## 🔄 Rollback Procedures

### **Immediate Rollback (Critical Issue)**
```sql
-- Disable feature flag
UPDATE voice_feature_flags 
SET enabled = false, rollout_percentage = 0 
WHERE flag_name = 'voice_webrtc_migration';

-- Check that users are falling back to WebSocket
SELECT implementation_type, COUNT(*) 
FROM voice_session_metrics 
WHERE created_at > NOW() - INTERVAL '5 minutes'
GROUP BY implementation_type;
```

### **Partial Rollback**
```sql
-- Reduce rollout to previous stable percentage
UPDATE voice_feature_flags 
SET rollout_percentage = 10  -- or whatever was stable
WHERE flag_name = 'voice_webrtc_migration';
```

### **Lovable History Rollback**
If code changes are needed:
1. Go to Lovable editor
2. Click History
3. Find commit before migration
4. Restore that version

---

## ✅ Success Criteria

Migration is successful when:
- WebRTC success rate ≥ WebSocket success rate
- WebRTC latency ≤ WebSocket latency + 100ms
- Error rate < 2%
- No user complaints about voice quality
- Stable for 1 week at 100% rollout

---

## 📝 Implementation Files

### **Core Files**
- `src/utils/realtime/RealtimeVoiceClientWebRTC.ts` - WebRTC client
- `src/hooks/useRealtimeVoiceWebRTC.ts` - React hook with monitoring
- `src/hooks/useVoiceMonitoring.ts` - Metrics tracking
- `src/hooks/useFeatureFlag.ts` - A/B testing logic
- `src/pages/VoiceMonitoringDashboard.tsx` - Monitoring UI
- `supabase/functions/realtime-student-guide-token/index.ts` - Token generation

### **Database Tables**
- `voice_session_metrics` - Performance data
- `voice_session_errors` - Error logs
- `voice_feature_flags` - Rollout control

### **Modified Files**
- `src/pages/StudentDashboard-v2.tsx` - Feature flag integration
- `src/App.tsx` - Monitoring dashboard route

---

## 🎯 Current Status

- ✅ Monitoring infrastructure deployed
- ✅ WebRTC client implemented
- ✅ Feature flag system active
- ✅ Student Dashboard updated with fallback
- ✅ Monitoring dashboard accessible
- ⏸️ Rollout at **0%** (waiting for manual activation)

**Next Step**: Enable 10% rollout when ready to test:
```sql
UPDATE voice_feature_flags 
SET enabled = true, rollout_percentage = 10 
WHERE flag_name = 'voice_webrtc_migration';
```

---

**Last Updated**: Migration implementation complete  
**Rollout Status**: 0% (Ready for activation)  
**Old Implementation**: Preserved and working  
**Rollback Safety**: ✅ Multiple fallback options available
