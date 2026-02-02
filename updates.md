# Project Updates Log

## Backend Changes

### `backend-shnoor/schema.sql`
- **Before**: Missing `is_paid`, `price`, `scheduled_at` columns in `courses` table definition. Missing `practice_challenges` schema updates if any.
- **After**: Added `is_paid`, `price`, and `scheduled_at` columns to the `courses` CREATE TABLE statement. This ensures new database deployments support paid and scheduled courses out of the box.

### `backend-shnoor/controllers/practice.controller.js`
- **Before**: Only had `getChallenges` and `getChallengeById`.
- **After**: Added:
    - `createChallenge`: Handles creation of coding challenges, including `test_cases` (with `is_hidden` support) and `starter_code`.
    - `deleteChallenge`: Allows removing challenges by ID.

### `backend-shnoor/routes/practice.routes.js`
- **Before**: Only supported `GET /` and `GET /:id`.
- **After**: Added `POST /` (Create) and `DELETE /:id` (Delete) routes, protected by `roleGuard('instructor', 'admin')`.

### `backend-shnoor/controllers/user.controller.js`
- **Before**: `getMyProfile` did not return `xp` or `streak` data.
- **After**: Updated query to select `xp` and `streak`, fixing the "0 XP" display issue on the frontend.

### `backend-shnoor/controllers/analytics.controller.js`
- **Before**: Crash (500 Error) in `getStudentDashboard` due to missing columns in `GROUP BY` clause.
- **After**: Added all selected columns to the `GROUP BY` clause to comply with SQL standards.

### `backend-shnoor/scripts/` (Directory)
- **Before**: Contained temporary debug files: `debug_all.js`, `verify_db.js`, `fix_db_schema.js`, etc.
- **After**: **Deleted**. The directory was removed to clean up the project for deployment.

---

## Frontend Changes

### `frontend-shnoor/src/App.jsx`
- **Before**: Missing routes for Instructor Practice features.
- **After**: Added:
    - Import for `InstructorPracticeList` and `AddPractice`.
    - Route `instructor/practice` -> `PracticeList`.
    - Route `instructor/practice/new` -> `AddPractice`.

### `frontend-shnoor/src/components/layout/InstructorLayout/view.jsx`
- **Before**: No link to Practice Arena in the sidebar.
- **After**: Added "Practice Arena" link under the "Management" section using the `Code` icon.

### `frontend-shnoor/src/pages/instructor/PracticeList/` (New Folder)
- **Before**: Did not exist.
- **After**: Created `index.jsx` and `view.jsx`.
    - Displays a table of all practice challenges.
    - Includes Delete functionality.
    - **Fix**: Implemented `useAuth` hook to wait for user authentication before fetching data, preventing 401 errors on load.

### `frontend-shnoor/src/pages/instructor/AddPractice/` (New Folder)
- **Before**: Did not exist.
- **After**: Created `index.jsx` and `view.jsx`.
    - **Features**: Form to create Coding Challenges.
    - **Starter Code**: Monaco Editor integration.
    - **Test Cases**: Interface to add input/output pairs with a **Public/Hidden toggle**.
    - **Safety**: Submit button is disabled if authentication is lost, preventing failed requests.

### `frontend-shnoor/src/pages/instructor/AddCourse/index.jsx`
- **Before**: Silent failures or vague errors when course creation failed.
- **After**: Added better error handling and user feedback (Toast notifications) for missing fields or backend errors.

### `frontend-shnoor/src/pages/student/MyCertificates.jsx`
- **Before**: Showed "XP Earned" badge which always displayed 0 due to API issues.
- **After**: Removed the XP badge entirely for a cleaner UI as requested.

### `frontend-shnoor/src/components/exam/CodeEditorPanel.jsx`
- **Before**: Language dropdown was white-on-white or hard to read in dark mode.
- **After**: Added `bg-[#252526]` and `text-slate-200` to valid explicitly ensure high contrast and readability.
