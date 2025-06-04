# RepHelp - Reception Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Optional: Add license if applicable -->

<p align="center">
  <!-- Optional: Add a logo if you have one -->
  <!-- <img src="path/to/your/logo.png" alt="RepHelp Logo" width="200"/> -->
  <br />
  <i>Streamlining Reception Operations</i>
</p>

RepHelp is a modern web application designed to simplify and automate reception tasks, focusing on customer registration and booking management. It provides a user-friendly interface for customers and a comprehensive dashboard for administrators.

**Live Demo:** [[RepHelp](https://rephelp.netlify.app/)] <!-- Add your deployment link here -->

## ✨ Features

*   **Customer Onboarding:**
    *   Simple customer registration form ([`CustomerForm.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\components\form\CustomerForm.tsx)).
    *   Detailed customer information capture including personal details, contact info, identification, and more ([`RegisterForm.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\components\form\RegisterForm.tsx)).
    *   Phone number verification via OTP (using Twilio/Email - [`send-otp.ts`](c:\Users\srishti\Desktop\all\Projects\RepHelp\pages\api\send-otp.ts)).
    *   Customer image capture ([`CustomerImage.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\components\CustomerImage.tsx)).
    *   Identification document upload and OCR scanning ([`DocumentImage.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\components\DocumentImage.tsx)).
    *   Digital signature capture ([`SignaturePad.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\components\SignaturePad.tsx)).
*   **Booking Management:**
    *   Intuitive booking form for selecting room types, dates, and purpose ([`AppointmentForm.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\components\form\AppointmentForm.tsx)).
    *   View booking success/confirmation page ([`success/page.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\app\customer\[userId]\new-booking\success\page.tsx)).
*   **Admin Dashboard:**
    *   Overview of booking statistics (Total, Pending, Cancelled) ([`admin/page.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\app\admin\page.tsx)).
    *   Detailed table view of all bookings ([`DataTable.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\components\table\DataTable.tsx)).
    *   Actions to manage bookings (e.g., schedule, cancel - [`columns.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\components\table\columns.tsx)).
    *   Secure admin access (potentially via Passkey - [`PasskeyModal.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\components\PasskeyModal.tsx)).
*   **Modern UI/UX:**
    *   Built with Shadcn UI and Tailwind CSS for a clean and responsive design ([`globals.css`](c:\Users\srishti\Desktop\all\Projects\RepHelp\app\globals.css), [`components/ui`](c:\Users\srishti\Desktop\all\Projects\RepHelp\components\ui)).
    *   Dark theme support ([`theme-provider.tsx`](c:\Users\srishti\Desktop\all\Projects\RepHelp\components\theme-provider.tsx)).

## 🚀 Tech Stack

*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn UI
*   **Backend:** Appwrite (Cloud Database, Auth, Storage, Functions), Node.js (API Routes)
*   **Form Handling:** React Hook Form, Zod (Validation)
*   **UI Components:** Radix UI (Primitives for Shadcn), Lucide Icons
*   **External Services:**
    *   Twilio (SMS OTP)
    *   Nodemailer (Email OTP/Notifications)
    *   RapidAPI (OCR Service)
*   **Utilities:** `clsx`, `tailwind-merge`, `date-fns` (implied by date formatting)
*   **Error Monitoring:** Sentry

## 🛠️ Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn or pnpm
*   Appwrite Cloud Account
*   Twilio Account (Optional, for SMS OTP)
*   RapidAPI Account (Optional, for OCR)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd RepHelp
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add the necessary environment variables. Refer to the Appwrite, Twilio, and RapidAPI documentation for required keys.
    ```env
    # Appwrite
    PROJECT_ID=your_appwrite_project_id
    API_KEY=your_appwrite_api_key
    DATABASE_ID=your_appwrite_database_id
    CUSTOMER_COLLECTION_ID=your_customer_collection_id
    CUSTOMERDETAIL_COLLECTION_ID=your_customer_detail_collection_id
    BOOKING_COLLECTION_ID=your_booking_collection_id
    NEXT_PUBLIC_BUCKET_ID=your_appwrite_bucket_id
    NEXT_PUBLIC_ENDPOINT=your_appwrite_endpoint # e.g., https://cloud.appwrite.io/v1

    # Twilio (Optional)
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_twilio_phone_number

    # RapidAPI OCR (Optional)
    RAPIDAPI_OCR_KEY=your_rapidapi_key
    RAPIDAPI_OCR_HOST=ocr43.p.rapidapi.com # Or your specific host

    # Admin Passkey (Example)
    NEXT_PUBLIC_ADMIN_PASSKEY=your_admin_passkey

    # Other necessary variables...
    ```
    *Note: Ensure your Appwrite collections (`CUSTOMER_COLLECTION_ID`, `CUSTOMERDETAIL_COLLECTION_ID`, `BOOKING_COLLECTION_ID`) are set up with the correct attributes based on the application's needs (see [`types/appwrite.types.ts`](c:\Users\srishti\Desktop\all\Projects\RepHelp\types\appwrite.types.ts) and action files).*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) (or your configured port) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## 🤝 Contributing

Contributions are welcome! Please follow standard fork-and-pull-request workflows. Ensure your code adheres to the project's linting rules (`npm run lint`).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (if you add one).

---
