# 🧪 Testing Guide

## Manual Testing Checklist

### Authentication Flow

#### Login as Admin
- [ ] Access `/login`
- [ ] Enter NIS: `admin001`, Password: `password`
- [ ] Verify redirect to `/admin`
- [ ] Verify user info displayed in sidebar
- [ ] Verify logout button works

#### Login as Guru
- [ ] Enter NIS: `guru001`, Password: `password`
- [ ] Verify redirect to `/guru`
- [ ] Verify guru-specific menu

#### Login as Siswa
- [ ] Enter NIS: `siswa001`, Password: `password`
- [ ] Verify redirect to `/siswa`
- [ ] Verify siswa-specific UI

#### Change Password
- [ ] Login as any user
- [ ] Open password change modal
- [ ] Enter current password
- [ ] Enter new password (confirmation must match)
- [ ] Verify success message
- [ ] Logout and login with new password

### Admin Panel Testing

#### User Management
- [ ] **View Users**: Click "Kelola User", see list with pagination
- [ ] **Create User**: 
  - [ ] Fill form with valid data
  - [ ] Verify user appears in list
  - [ ] Test with invalid email format (should show error)
  - [ ] Test with duplicate NIS (should show error)
- [ ] **Edit User**:
  - [ ] Click edit button
  - [ ] Modify user data
  - [ ] Verify changes saved
- [ ] **Delete User**:
  - [ ] Click delete button
  - [ ] Confirm deletion
  - [ ] Verify user removed from list
- [ ] **Lock User**:
  - [ ] Toggle user status to "Terkunci"
  - [ ] Verify status icon changes
  - [ ] Try login with locked user (should fail)
- [ ] **Pagination**:
  - [ ] Change per_page value
  - [ ] Navigate between pages
  - [ ] Verify correct data displayed

#### Nilai Management
- [ ] **View Nilai**: Click "Kelola Nilai", see all exam results
- [ ] **View Details**:
  - [ ] Click exam result
  - [ ] See all questions and answers
  - [ ] See security logs
  - [ ] Verify violation count
- [ ] **Unlock Exam**:
  - [ ] If violation_count >= 5, click unlock
  - [ ] Verify status changes to "Aktif"

### Guru Dashboard Testing

#### Exam Management
- [ ] **View Exams**: See all created exams in card grid
- [ ] **Create Exam**:
  - [ ] Fill form with valid data
  - [ ] Verify token auto-generated
  - [ ] Verify exam appears in list
- [ ] **Edit Exam**:
  - [ ] Modify exam details
  - [ ] Verify changes saved
  - [ ] Token should remain same
- [ ] **Delete Exam**:
  - [ ] Delete exam
  - [ ] Confirm dialog appears
  - [ ] Verify exam removed from list
- [ ] **Copy Token**:
  - [ ] Hover over token
  - [ ] Click copy icon
  - [ ] Paste and verify token copied correctly

#### Question Management
- [ ] **View Questions**: Click exam, see all questions listed
- [ ] **Add Question**:
  - [ ] Enter question details
  - [ ] Fill all options (A-E)
  - [ ] Select correct answer
  - [ ] Set points
  - [ ] Verify question appears
- [ ] **Edit Question**:
  - [ ] Modify question text or options
  - [ ] Verify changes saved
- [ ] **Delete Question**:
  - [ ] Delete question
  - [ ] Verify removed from list

### Siswa Dashboard Testing

#### Profile Section
- [ ] **Profile Display**: See name, NIS, email
- [ ] **Statistics**: See total ujian, completed, average score

#### Exam History
- [ ] **View History**: See all exam results with status
- [ ] **Status Badges**: 
  - [ ] Green for completed
  - [ ] Orange for ongoing
  - [ ] Red for locked

#### Start New Exam
- [ ] **Token Input**:
  - [ ] Click "Mulai Ujian Baru" button
  - [ ] Modal appears for token input
  - [ ] Try invalid token (should show error)
  - [ ] Enter valid token
  - [ ] Redirect to exam page
- [ ] **Invalid Token**: Error message displays

### Exam Taking Page Testing

#### Display & Navigation
- [ ] **Header**: Shows exam name, timer, student name
- [ ] **Question Display**: Shows current question with all options
- [ ] **Sidebar Navigation**:
  - [ ] Shows all questions in grid
  - [ ] Active question highlighted in orange
  - [ ] Answered questions highlighted in green
  - [ ] Click question to jump to it
- [ ] **Timer**:
  - [ ] Countdown works correctly
  - [ ] Color changes to orange at < 15 minutes
  - [ ] Color changes to red at < 5 minutes
  - [ ] Format: HH:MM:SS

#### Answer Submission
- [ ] **Multiple Choice**:
  - [ ] Select option (radio button)
  - [ ] Sidebar updates to show answered
  - [ ] Auto-save occurs (check indicator)
- [ ] **Complex Multiple Choice**:
  - [ ] Multiple options can be selected (checkboxes)
  - [ ] Each selection auto-saves
- [ ] **Navigation**:
  - [ ] Previous button takes to previous question
  - [ ] Next button takes to next question
  - [ ] Can't go before first question
  - [ ] Can't go after last question

#### Finish Exam
- [ ] **Finish Button**: 
  - [ ] Click to complete exam
  - [ ] Confirmation dialog appears
  - [ ] After confirmation, redirect to dashboard
  - [ ] Result shows score and statistics

#### Security Monitoring

##### Fullscreen
- [ ] **Enforced**: Exam page requests fullscreen
- [ ] **Re-request on Exit**: If user exits fullscreen:
  - [ ] Dialog appears asking to re-enter
  - [ ] Violation logged
  - [ ] Violation count incremented
- [ ] **Auto-lock**: After 5 violations, page locks

##### Tab Switch
- [ ] **Switch Tab**: When leaving exam tab:
  - [ ] Violation logged
  - [ ] Warning/notification shows
  - [ ] Violation count incremented
- [ ] **Repeat**: After 5 switches, auto-locked

##### Blur/Focus
- [ ] **Blur Detection**: Click outside window:
  - [ ] Timer continues
  - [ ] Violation logged after threshold
  - [ ] Warning shows

##### DevTools Detection
- [ ] **Press F12**: 
  - [ ] DevTools opens
  - [ ] Violation logged
  - [ ] Auto-closes DevTools (or warning)
- [ ] **Ctrl+Shift+I**: Blocked
- [ ] **Ctrl+Shift+C**: Blocked
- [ ] **Ctrl+Shift+J**: Blocked

##### Keyboard Blocking
- [ ] **F12**: Blocked (no DevTools)
- [ ] **Ctrl+Shift+I**: Blocked
- [ ] **Ctrl+Shift+C**: Blocked
- [ ] **Ctrl+Shift+J**: Blocked
- [ ] **Ctrl+S**: Blocked
- [ ] **Other Keys**: Work normally (arrows, letters, etc.)

##### Clipboard Prevention
- [ ] **Copy**: Ctrl+C blocked
- [ ] **Paste**: Ctrl+V blocked
- [ ] **Right-click paste**: Blocked
- [ ] **Normal typing**: Works fine

##### Time Drift Detection
- [ ] **Server Time Mismatch**: 
  - [ ] If device time > server time + 5 seconds
  - [ ] Violation logged
  - [ ] Warning shows

##### Window Minimize
- [ ] **Minimize Window**: 
  - [ ] On some browsers, violation logged
  - [ ] Auto-lock after 5 times

##### Page Refresh
- [ ] **F5 or Ctrl+R**: 
  - [ ] Refresh blocked or warning
  - [ ] Can resume exam if timeout not exceeded

##### Auto-Save
- [ ] **Answer Change**: 
  - [ ] Make change to answer
  - [ ] Wait 3 seconds (or less)
  - [ ] Indicator shows saving
  - [ ] Change persists in backend
- [ ] **Refresh Test**: 
  - [ ] Hard refresh page
  - [ ] Return to exam
  - [ ] Previous answer still there

### API Integration Testing

#### Authentication Endpoints
```bash
# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nis":"siswa001","password":"password"}'

# Test logout
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer {token}"
```

#### Admin Endpoints
```bash
# Get users
curl http://localhost:8000/api/admin/users?per_page=10 \
  -H "Authorization: Bearer {admin_token}"

# Get nilai
curl http://localhost:8000/api/admin/nilai \
  -H "Authorization: Bearer {admin_token}"
```

#### Guru Endpoints
```bash
# Get ujians
curl http://localhost:8000/api/guru/ujians \
  -H "Authorization: Bearer {guru_token}"
```

#### Siswa Endpoints
```bash
# Verify token
curl -X POST http://localhost:8000/api/siswa/ujians/verify-token \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {siswa_token}" \
  -d '{"token":"ABC123XY"}'

# Get server time
curl http://localhost:8000/api/siswa/server-time \
  -H "Authorization: Bearer {siswa_token}"
```

### Performance Testing

#### Frontend Build
```bash
# Development build
npm run dev

# Production build
npm run build

# Check bundle size
npm run analyze
```

**Target Metrics**:
- [ ] Build time < 5 seconds
- [ ] Gzipped JS size < 100 KB
- [ ] Gzipped CSS size < 10 KB
- [ ] Lighthouse score > 90

#### Pagination Performance
- [ ] Load users with per_page=100 (should not lag)
- [ ] Load nilai with per_page=50 (should be fast)
- [ ] Navigate through pages (smooth transitions)

### Security Testing

#### CORS Testing
```bash
# From frontend origin, request backend
# Should succeed with proper credentials

# Test from different origin
# Should be rejected by CORS
```

#### Token Validation
- [ ] Invalid token → 401 error
- [ ] Expired token → redirect to login
- [ ] Modified token → 401 error
- [ ] Missing token → redirect to login

#### Authorization Testing
- [ ] Admin can't access guru endpoints (403)
- [ ] Guru can't access admin endpoints (403)
- [ ] Siswa can't access admin/guru endpoints (403)
- [ ] Guru can only see own ujians

#### Input Validation
- [ ] Empty fields → validation errors
- [ ] Invalid email format → error
- [ ] Special characters → sanitized or error
- [ ] XSS attempts → blocked
- [ ] SQL injection attempts → blocked

### Responsive Design Testing

#### Mobile (< 768px)
- [ ] Navigation hamburger menu
- [ ] Tables scroll horizontally
- [ ] Forms stack vertically
- [ ] Touch-friendly buttons
- [ ] Modal fit screen

#### Tablet (768px - 1024px)
- [ ] 2-column layout works
- [ ] Tables have optimal spacing
- [ ] Sidebar collapses
- [ ] Touch-friendly

#### Desktop (> 1024px)
- [ ] 3+ column layouts work
- [ ] Sidebar full width
- [ ] Optimal spacing
- [ ] Mouse interactions work

### Browser Compatibility

#### Chrome
- [ ] Latest version tested
- [ ] Security monitoring works
- [ ] Fullscreen API works

#### Firefox
- [ ] Latest version tested
- [ ] All features work
- [ ] Fullscreen API works

#### Safari
- [ ] Latest version tested
- [ ] Test fullscreen (may have limitations)
- [ ] Touch events work

#### Edge
- [ ] Latest version tested
- [ ] All features work

## Automated Testing

### Frontend Unit Tests

```bash
npm run test:unit
```

Example test:
```typescript
import { render, screen } from '@testing-library/react';
import Button from '@/components/Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Backend Unit Tests

```bash
cd backend
php artisan test
```

Example test:
```php
<?php
namespace Tests\Feature;

use Tests\TestCase;

class LoginTest extends TestCase
{
    public function test_login_with_valid_credentials()
    {
        $response = $this->post('/api/auth/login', [
            'nis' => 'siswa001',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['status', 'data', 'message']);
    }

    public function test_login_with_invalid_credentials()
    {
        $response = $this->post('/api/auth/login', [
            'nis' => 'invalid',
            'password' => 'wrong',
        ]);

        $response->assertStatus(401);
    }
}
```

## Load Testing

### Using Apache Bench

```bash
# Test login endpoint
ab -n 100 -c 10 -p data.json -T application/json \
  http://localhost:8000/api/auth/login

# Test get users endpoint
ab -n 100 -c 10 -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/admin/users
```

### Using k6

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  const url = 'http://localhost:8000/api/admin/users';
  const params = {
    headers: {
      Authorization: `Bearer ${__ENV.TOKEN}`,
    },
  };

  const response = http.get(url, params);
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

## Regression Testing

### Critical Paths to Test After Changes

1. **Authentication Flow**
   - [ ] Login
   - [ ] Logout
   - [ ] Token persistence
   - [ ] Auto-redirect on expired token

2. **User CRUD**
   - [ ] Create user
   - [ ] Read user list
   - [ ] Update user
   - [ ] Delete user

3. **Exam Taking**
   - [ ] Start exam
   - [ ] Submit answer
   - [ ] Auto-save
   - [ ] Finish exam
   - [ ] View results

4. **Security Monitoring**
   - [ ] All 9 detection types
   - [ ] Violation logging
   - [ ] Auto-lock
   - [ ] Admin unlock

## Test Report Template

```markdown
# Test Report - [Date]

## Test Environment
- OS: Ubuntu 24.04
- Browser: Chrome Latest
- Device: Desktop

## Test Results Summary
- ✅ Passed: XX
- ❌ Failed: XX
- ⏭️ Skipped: XX

## Detailed Results

### Authentication
- [x] Login as admin
- [x] Login as guru
- [x] Login as siswa
- [x] Logout
- [x] Change password

### Admin Panel
- [x] User management
- [x] Nilai management

### Guru Dashboard
- [x] Create exam
- [x] Manage questions
- [x] View results

### Siswa Dashboard
- [x] View profile
- [x] Start exam
- [x] Take exam
- [x] View results

### Security
- [x] Fullscreen enforcement
- [x] Tab switch detection
- [x] Keyboard blocking
- [x] Clipboard prevention

## Issues Found
1. [Issue #1]: Description
2. [Issue #2]: Description

## Recommendations
1. Recommendation 1
2. Recommendation 2

## Sign-off
- Tester: [Name]
- Date: [Date]
- Status: ✅ PASS / ❌ FAIL
```

---

**Testing Guide Complete! Happy Testing! 🧪**
