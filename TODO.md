# Fix Console Errors - Score11 Frontend

## Status: In Progress

### Step 1: Fix react-icons imports/usage [✅ DONE]
- Replace FaMail → FaEnvelope in Login.jsx, Register.jsx, ForgotPassword.jsx
- Fix Login.jsx: Add FaArrowRight for button, ensure FaLock imported
- Fix ForgotPassword.jsx: Add FaArrowLeft import

### Step 2: Fix API_BASE URL
- Update src/config/api.js to localhost:3000

### Step 3: Verify backend /api/v1/teams/me route
- Check backend modules/team routes

### Step 4: Test
- cd Score-11-User && npm i react-icons
- npm run dev
- Check console, test Login page loads without crash
- Test teams API call
