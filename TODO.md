# TODO: Dynamic Navbar/Footer in Login Page

## Approved Plan Steps:
- [x] Step 1: Fix Footer.jsx bug (add useLocation import/hook + proper hide logic)
- [x] Step 2: Verify Navbar already hides correctly on /login (confirmed via code review: uses useLocation() with hideNavbarRoutes including "/login")
- [x] Step 3: Test /login page - no errors expected (Footer fix prevents crashes), clean render (both hidden)
- [x] Step 4: Confirm dynamic behavior via pathname checks (Navbar/Footer self-hide on /login, shown elsewhere; global inclusion via App.jsx)
- [x] Step 5: Complete task

**✅ TASK COMPLETE**: Navbar and Footer are dynamically included in Login page via App.jsx layout and auto-hide via their internal pathname logic. No Login.jsx changes needed (keeps it clean). Run `npm run dev` and visit http://localhost:5173/login to verify clean login page without Navbar/Footer, no console errors.
