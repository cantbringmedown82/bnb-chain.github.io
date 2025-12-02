# Guardian Shield — User Profile Specification
## Crypto Hound LLC — User Profile Feature

---

## 1. Overview

The User Profile feature allows authenticated users to view and manage their profile information, security settings, notification preferences, and account details within the Guardian Shield Regulator Portal.

---

## 2. User Profile Page

### 2.1 Page Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ User Profile                                              [Edit Profile] │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┬───────────────────────────────────┐ │
│ │  PROFILE INFORMATION            │  SECURITY SETTINGS                │ │
│ │ ┌─────────────────────────────┐ │ ┌───────────────────────────────┐ │ │
│ │ │        ┌─────────┐           │ │ │ Two-Factor Authentication     │ │ │
│ │ │        │         │           │ │ │ ✓ Enabled (TOTP)              │ │ │
│ │ │        │  Photo  │           │ │ │ [Manage 2FA]                  │ │ │
│ │ │        │         │           │ │ ├───────────────────────────────┤ │ │
│ │ │        └─────────┘           │ │ │ Session Management            │ │ │
│ │ │      [Change Photo]          │ │ │ Active Sessions: 1            │ │ │
│ │ ├─────────────────────────────┤ │ │ Current: Chrome on Windows    │ │ │
│ │ │ Name: John Doe               │ │ │ [View All Sessions]           │ │ │
│ │ │ Email: john.doe@regulator.gov│ │ ├───────────────────────────────┤ │ │
│ │ │ Role: Regulator              │ │ │ API Keys                      │ │ │
│ │ │ Organization: SEC            │ │ │ Active Keys: 2                │ │ │
│ │ │ Member Since: Jan 15, 2025   │ │ │ [Manage API Keys]             │ │ │
│ │ └─────────────────────────────┘ │ └───────────────────────────────┘ │ │
│ └─────────────────────────────────┴───────────────────────────────────┘ │
│ ┌─────────────────────────────────┬───────────────────────────────────┐ │
│ │  NOTIFICATION PREFERENCES       │  ACTIVITY LOG                     │ │
│ │ ┌───────────────────────────────┐│ ┌───────────────────────────────┐ │ │
│ │ │ Email Notifications           ││ │ Recent Activity               │ │ │
│ │ │ ☑ Critical Alerts             ││ │ • Profile updated (2h ago)    │ │ │
│ │ │ ☑ High Severity Alerts        ││ │ • Logged in (3h ago)          │ │ │
│ │ │ ☐ Medium Severity Alerts      ││ │ • Downloaded report (1d ago)  │ │ │
│ │ │ ☑ Weekly Reports              ││ │ • Verified evidence (2d ago)  │ │ │
│ │ │ ☑ Drill Notifications         ││ │ [View Full History]           │ │ │
│ │ ├───────────────────────────────┤│ └───────────────────────────────┘ │ │
│ │ │ In-App Notifications          ││                                   │ │
│ │ │ ☑ Alert Feed Updates          ││                                   │ │
│ │ │ ☑ System Announcements        ││                                   │ │
│ │ │ ☐ Drill Reminders             ││                                   │ │
│ │ └───────────────────────────────┘│                                   │ │
│ │         [Save Preferences]       │                                   │ │
│ └─────────────────────────────────┴───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Profile Information Section

**Fields:**
- **Profile Photo:** 
  - Upload/change profile picture
  - Supported formats: JPG, PNG, WebP (max 2MB)
  - Auto-resize to 200x200px
  - Default: Initials avatar

- **Name:** Display name (read-only, synced from auth provider)
- **Email:** Primary email address (read-only)
- **Role:** User role badge (Regulator, Auditor, Investor, Viewer)
- **Organization:** Organization name (read-only)
- **Member Since:** Account creation date (read-only)
- **User ID:** Unique identifier (read-only, expandable)

**Edit Profile Dialog:**
```
┌─────────────────────────────────────────────┐
│ Edit Profile                          [×]   │
├─────────────────────────────────────────────┤
│ Display Name                                │
│ [John Doe_________________________]         │
│                                             │
│ Contact Email (optional)                    │
│ [john.doe@email.com________________]        │
│                                             │
│ Phone Number (optional)                     │
│ [+1 (555) 123-4567_________________]        │
│                                             │
│ Timezone                                    │
│ [UTC-5 (Eastern Time)______________▼]       │
│                                             │
│ Language                                    │
│ [English_________________________▼]         │
│                                             │
│           [Cancel]        [Save Changes]    │
└─────────────────────────────────────────────┘
```

### 2.3 Security Settings Section

#### 2.3.1 Two-Factor Authentication

**Status Card:**
```
┌───────────────────────────────────────────┐
│ Two-Factor Authentication                 │
│ ✓ Enabled (TOTP)                          │
│ Last used: 3 hours ago                    │
│                                           │
│ [Disable 2FA]  [Regenerate Codes]         │
└───────────────────────────────────────────┘
```

**Setup Flow:**
1. Click "Enable 2FA"
2. Scan QR code with authenticator app
3. Enter verification code
4. Download backup codes
5. Confirm activation

#### 2.3.2 Session Management

**Active Sessions List:**
```
┌───────────────────────────────────────────┐
│ Active Sessions                           │
├───────────────────────────────────────────┤
│ ● Current Session                         │
│   Chrome 120 on Windows 11                │
│   IP: 192.168.1.100                       │
│   Location: Washington, DC                │
│   Started: 3 hours ago                    │
│                                           │
│ Other Sessions (1)                        │
│   Safari 17 on macOS                      │
│   IP: 10.0.1.50                           │
│   Location: Washington, DC                │
│   Last Active: 2 days ago                 │
│   [Revoke]                                │
└───────────────────────────────────────────┘
```

**Features:**
- View all active sessions
- See device, browser, IP, location
- Revoke individual sessions
- Revoke all other sessions
- Session timeout: 30 minutes (admin), 60 minutes (others)

#### 2.3.3 API Keys Management

**API Keys List:**
```
┌───────────────────────────────────────────┐
│ API Keys                  [+ Create New]  │
├───────────────────────────────────────────┤
│ Production API Key                        │
│ Key: gs_live_abc123...def456  [Copy]      │
│ Created: Jan 15, 2025                     │
│ Last Used: 2 hours ago                    │
│ Scopes: read:ledger, verify:evidence      │
│ [Rotate] [Revoke]                         │
├───────────────────────────────────────────┤
│ Development API Key                       │
│ Key: gs_test_xyz789...uvw012  [Copy]      │
│ Created: Jan 10, 2025                     │
│ Last Used: Never                          │
│ Scopes: read:ledger                       │
│ [Rotate] [Revoke]                         │
└───────────────────────────────────────────┘
```

**Create API Key Dialog:**
```
┌─────────────────────────────────────────────┐
│ Create API Key                        [×]   │
├─────────────────────────────────────────────┤
│ Key Name                                    │
│ [Production Key__________________]          │
│                                             │
│ Environment                                 │
│ ○ Production  ● Development                 │
│                                             │
│ Scopes (Select permissions)                 │
│ ☑ read:ledger      Read evidence ledger     │
│ ☑ verify:evidence  Verify evidence bundles  │
│ ☐ export:reports   Export compliance reports│
│ ☐ read:drills      View drill results       │
│                                             │
│ Expiration (optional)                       │
│ [Never__________________________▼]          │
│                                             │
│              [Cancel]        [Create Key]   │
└─────────────────────────────────────────────┘
```

**Post-Creation Display:**
```
┌─────────────────────────────────────────────┐
│ ✓ API Key Created                           │
├─────────────────────────────────────────────┤
│ Your new API key is:                        │
│                                             │
│ gs_live_abc123def456ghi789jkl012mno345pqr678│
│                                  [Copy]     │
│                                             │
│ ⚠️ Important: Save this key now.            │
│ You won't be able to see it again.          │
│                                             │
│ [I've saved my key]                         │
└─────────────────────────────────────────────┘
```

### 2.4 Notification Preferences Section

**Email Notifications:**
- Critical Alerts (default: ON)
- High Severity Alerts (default: ON)
- Medium Severity Alerts (default: OFF)
- Weekly Reports (default: ON)
- Drill Notifications (default: ON)
- System Maintenance (default: ON)

**In-App Notifications:**
- Alert Feed Updates (default: ON)
- System Announcements (default: ON)
- Drill Reminders (default: OFF)
- Report Ready (default: ON)

**Notification Delivery:**
```
┌───────────────────────────────────────────┐
│ Delivery Preferences                      │
├───────────────────────────────────────────┤
│ Email Digest                              │
│ [Immediate___________________▼]           │
│ Options: Immediate, Hourly, Daily         │
│                                           │
│ Quiet Hours                               │
│ ☑ Enable quiet hours                      │
│ From: [22:00___▼] To: [08:00___▼]         │
│ Timezone: UTC-5 (Eastern Time)            │
│                                           │
│ Emergency Override                        │
│ ☑ Always notify for Critical alerts       │
└───────────────────────────────────────────┘
```

### 2.5 Activity Log Section

**Recent Activity:**
- Profile updates
- Login/logout events
- Evidence access
- Report downloads
- Verification requests
- API key operations
- 2FA changes

**Activity Entry Format:**
```
┌───────────────────────────────────────────┐
│ 📝 Profile Updated                        │
│ Changed notification preferences          │
│ 2 hours ago • IP: 192.168.1.100           │
├───────────────────────────────────────────┤
│ 🔐 Logged In                              │
│ Chrome on Windows 11                      │
│ 3 hours ago • IP: 192.168.1.100           │
├───────────────────────────────────────────┤
│ 📥 Downloaded Report                      │
│ Weekly Incident Report (Jan 8-14)         │
│ 1 day ago • IP: 192.168.1.100             │
└───────────────────────────────────────────┘
```

**Full Activity History:**
- Pagination (20 entries per page)
- Date range filtering
- Activity type filtering
- Export to CSV
- Retention: 90 days (visible to user), 1 year (audit)

---

## 3. User Menu Dropdown

### 3.1 Dropdown Layout

```
┌────────────────────────────┐
│ John Doe          [Photo]  │
│ Regulator                  │
├────────────────────────────┤
│ 👤 Profile                 │
│ ⚙️  Settings               │
│ 📊 Activity                │
│ 🔑 API Keys                │
├────────────────────────────┤
│ 💬 Help & Support          │
│ 📚 Documentation           │
├────────────────────────────┤
│ 🚪 Logout                  │
└────────────────────────────┘
```

### 3.2 Menu Items

| Item | Action | Icon |
|------|--------|------|
| Profile | Navigate to /profile | 👤 |
| Settings | Navigate to /settings | ⚙️ |
| Activity | Navigate to /profile#activity | 📊 |
| API Keys | Navigate to /profile#api-keys | 🔑 |
| Help & Support | Open help center | 💬 |
| Documentation | Navigate to docs | 📚 |
| Logout | Logout and redirect to login | 🚪 |

---

## 4. API Endpoints

### 4.1 Get User Profile

```yaml
GET /api/users/profile
Authorization: Bearer {token}

Response 200:
{
  "user_id": "usr_abc123",
  "name": "John Doe",
  "email": "john.doe@regulator.gov",
  "role": "regulator",
  "organization": "SEC",
  "avatar_url": "https://cdn.guardianshield.com/avatars/usr_abc123.jpg",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-20T15:45:00Z",
  "preferences": {
    "timezone": "America/New_York",
    "language": "en",
    "contact_email": "john.doe@email.com",
    "contact_phone": "+15551234567"
  },
  "notifications": {
    "email": {
      "critical_alerts": true,
      "high_alerts": true,
      "medium_alerts": false,
      "weekly_reports": true,
      "drill_notifications": true,
      "system_maintenance": true
    },
    "in_app": {
      "alert_updates": true,
      "system_announcements": true,
      "drill_reminders": false,
      "report_ready": true
    },
    "delivery": {
      "email_digest": "immediate",
      "quiet_hours": {
        "enabled": true,
        "start": "22:00",
        "end": "08:00",
        "timezone": "America/New_York"
      },
      "emergency_override": true
    }
  },
  "security": {
    "two_factor_enabled": true,
    "two_factor_method": "totp",
    "active_sessions": 1,
    "api_keys_count": 2
  }
}
```

### 4.2 Update User Profile

```yaml
PATCH /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "preferences": {
    "contact_email": "john.doe@newemail.com",
    "contact_phone": "+15559876543",
    "timezone": "America/New_York",
    "language": "en"
  }
}

Response 200:
{
  "success": true,
  "message": "Profile updated successfully",
  "updated_fields": ["preferences.contact_email", "preferences.contact_phone"]
}
```

### 4.3 Update Notification Preferences

```yaml
PATCH /api/users/profile/notifications
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "email": {
    "critical_alerts": true,
    "medium_alerts": true
  },
  "delivery": {
    "email_digest": "hourly",
    "quiet_hours": {
      "enabled": true,
      "start": "23:00",
      "end": "07:00"
    }
  }
}

Response 200:
{
  "success": true,
  "message": "Notification preferences updated successfully"
}
```

### 4.4 Upload Profile Photo

```yaml
POST /api/users/profile/photo
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
photo: [binary file data]

Response 200:
{
  "success": true,
  "avatar_url": "https://cdn.guardianshield.com/avatars/usr_abc123.jpg",
  "thumbnail_url": "https://cdn.guardianshield.com/avatars/usr_abc123_thumb.jpg"
}
```

### 4.5 Get Activity Log

```yaml
GET /api/users/profile/activity?page=1&per_page=20&type=all&start_date=2025-01-01
Authorization: Bearer {token}

Response 200:
{
  "activities": [
    {
      "id": "act_xyz789",
      "type": "profile_update",
      "description": "Changed notification preferences",
      "timestamp": "2025-01-20T13:30:00Z",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "metadata": {
        "fields_changed": ["notifications.email.medium_alerts"]
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_entries": 156,
    "total_pages": 8
  }
}
```

### 4.6 Get Active Sessions

```yaml
GET /api/users/profile/sessions
Authorization: Bearer {token}

Response 200:
{
  "current_session": {
    "id": "sess_abc123",
    "device": "Chrome 120 on Windows 11",
    "ip_address": "192.168.1.100",
    "location": "Washington, DC, United States",
    "created_at": "2025-01-20T10:00:00Z",
    "last_active": "2025-01-20T13:30:00Z"
  },
  "other_sessions": [
    {
      "id": "sess_xyz789",
      "device": "Safari 17 on macOS 14",
      "ip_address": "10.0.1.50",
      "location": "Washington, DC, United States",
      "created_at": "2025-01-18T14:00:00Z",
      "last_active": "2025-01-18T18:00:00Z"
    }
  ]
}
```

### 4.7 Revoke Session

```yaml
DELETE /api/users/profile/sessions/{session_id}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Session revoked successfully",
  "session_id": "sess_xyz789"
}
```

### 4.8 List API Keys

```yaml
GET /api/users/profile/api-keys
Authorization: Bearer {token}

Response 200:
{
  "api_keys": [
    {
      "id": "key_abc123",
      "name": "Production API Key",
      "key_prefix": "gs_live_abc123",
      "environment": "production",
      "created_at": "2025-01-15T10:00:00Z",
      "last_used": "2025-01-20T12:00:00Z",
      "scopes": ["read:ledger", "verify:evidence"],
      "expires_at": null
    }
  ]
}
```

### 4.9 Create API Key

```yaml
POST /api/users/profile/api-keys
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "Production Key",
  "environment": "production",
  "scopes": ["read:ledger", "verify:evidence"],
  "expires_at": null
}

Response 201:
{
  "success": true,
  "api_key": {
    "id": "key_new123",
    "name": "Production Key",
    "key": "gs_live_abc123def456ghi789jkl012mno345pqr678",
    "environment": "production",
    "scopes": ["read:ledger", "verify:evidence"]
  },
  "warning": "Save this key now. You won't be able to see it again."
}
```

### 4.10 Revoke API Key

```yaml
DELETE /api/users/profile/api-keys/{key_id}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "API key revoked successfully",
  "key_id": "key_abc123"
}
```

---

## 5. Permissions & Access Control

### 5.1 Role-Based Permissions

| Feature | Regulator | Auditor | Investor | Viewer |
|---------|-----------|---------|----------|--------|
| View Profile | ✅ | ✅ | ✅ | ✅ |
| Edit Profile | ✅ | ✅ | ✅ | ✅ |
| Manage 2FA | ✅ | ✅ | ✅ | ✅ |
| View Sessions | ✅ | ✅ | ✅ | ✅ |
| Revoke Sessions | ✅ | ✅ | ✅ | ✅ |
| Create API Keys | ✅ | ✅ | ❌ | ❌ |
| View API Keys | ✅ | ✅ | ❌ | ❌ |
| Revoke API Keys | ✅ | ✅ | ❌ | ❌ |
| View Activity Log | ✅ | ✅ | ✅ | ✅ |
| Export Activity | ✅ | ✅ | ❌ | ❌ |

### 5.2 API Key Scopes

**Available Scopes:**
- `read:ledger` - Read evidence ledger entries
- `verify:evidence` - Verify evidence bundles
- `export:reports` - Export compliance reports (Regulator only)
- `read:drills` - View drill results (Regulator, Auditor only)
- `read:alerts` - Read alert feed
- `read:audit` - Read audit logs (Regulator, Auditor only)

**Scope Restrictions:**
- Investors: Cannot create API keys
- Viewers: Cannot create API keys
- All roles: Cannot grant scopes beyond their role permissions

---

## 6. Security Considerations

### 6.1 Data Protection

- Profile data encrypted at rest (AES-256-GCM)
- Avatar images stored in secure CDN with signed URLs
- Activity logs retain IP addresses for audit compliance
- PII (phone, email) only visible to user and admins

### 6.2 Session Security

- JWT tokens with 30-60 minute expiration
- Session binding to IP address (optional, configurable)
- Concurrent session limits enforced
- Auto-logout on password change
- Session revocation cascades to API calls

### 6.3 API Key Security

- API keys hashed in database (bcrypt)
- Keys shown only once at creation
- Automatic rotation recommended every 90 days
- Revoked keys blacklisted for 30 days
- Rate limiting per API key

### 6.4 Audit Trail

All profile operations logged:
- Profile updates
- Photo uploads
- Notification changes
- 2FA enablement/disablement
- Session creation/revocation
- API key creation/revocation

---

## 7. Validation Rules

### 7.1 Profile Fields

| Field | Rules |
|-------|-------|
| Display Name | 2-100 characters, alphanumeric + spaces |
| Contact Email | Valid email format, optional |
| Contact Phone | E.164 format, optional |
| Timezone | IANA timezone identifier |
| Language | ISO 639-1 code |

### 7.2 Profile Photo

- Max file size: 2MB
- Allowed formats: JPG, PNG, WebP
- Min dimensions: 100x100px
- Max dimensions: 2000x2000px
- Auto-resize to 200x200px for display
- Generate thumbnail: 50x50px

### 7.3 API Keys

- Name: 3-50 characters
- Scopes: At least one scope required
- Expiration: Minimum 1 day, maximum 1 year (or never)
- Maximum 10 active keys per user

---

## 8. Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation for all interactions
- Screen reader labels for all form fields
- High contrast mode support
- Focus indicators on all interactive elements
- Error messages with aria-live regions

---

## 9. Performance

| Metric | Target |
|--------|--------|
| Profile Page Load | < 1.5 seconds |
| Photo Upload | < 3 seconds |
| Settings Save | < 500ms |
| Activity Log Load | < 1 second |
| API Key Creation | < 1 second |

---

## 10. Error Handling

### 10.1 Common Errors

| Error Code | Message | Resolution |
|------------|---------|------------|
| 400 | Invalid profile data | Check field validation rules |
| 401 | Unauthorized | Re-authenticate |
| 403 | Insufficient permissions | Check role-based permissions |
| 413 | File too large | Reduce photo file size |
| 415 | Unsupported file type | Use JPG, PNG, or WebP |
| 429 | Rate limit exceeded | Wait before retrying |
| 500 | Server error | Contact support |

### 10.2 User-Friendly Messages

```
┌─────────────────────────────────────────────┐
│ ❌ Unable to Save Profile                   │
├─────────────────────────────────────────────┤
│ Your profile photo is too large.            │
│ Please upload an image smaller than 2MB.    │
│                                             │
│                          [Choose Another]   │
└─────────────────────────────────────────────┘
```

---

*© 2025 Crypto Hound LLC. All rights reserved.*
