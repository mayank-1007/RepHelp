
# RepHelp - hotel Management System

<div align="center">
  <img src="./public/assets/icons/Logo.svg" alt="RepHelp Logo" width="100" />
  <h1>RepHelp</h1>
</div>

<div align="center">

A modern, full-stack hotel management and appointment scheduling application built with Next.js, Appwrite, and TypeScript.

</div>

---

## 📖 About The Project

RepHelp is a comprehensive solution designed to streamline hotel administration and appointment booking for rooms facilities. It offers a user-friendly interface for hotels to register and book appointments, and a secure, feature-rich dashboard for administrators to manage the system efficiently. The project leverages modern web technologies to provide a seamless, secure, and responsive experience.

---

### ✨ Key Features

*   **📝 hotel Registration:** A multi-step, user-friendly form for new hotels to enter their personal and medical information.
*   **🗓️ Appointment Scheduling:** An intuitive system for hotels to digitally book rooms.
*   **🔐 Secure Admin Dashboard:** A passkey-protected portal for administrators to manage hotel data, appointments, and system settings.
*   **👁️ Document OCR Scanning:** Integrated Tesseract.js to scan documents like ID cards and extract information automatically, reducing manual data entry.
*   **📱 OTP Verification:** Twilio integration for verifying hotel phone numbers, enhancing security and data integrity.
*   **📊 Status Dashboards:** Visual dashboards for tracking appointment statuses (Scheduled, Pending, Cancelled).
*   **📧 Email Notifications:** Automated email confirmations and reminders for appointments using Nodemailer.
*   **🎨 Responsive Design:** Fully responsive UI built with Tailwind CSS and Shadcn/ui, ensuring a great experience on any device.

---

## 🚀 Live Demo & Screenshots
  [**View Live Demo**](https://rephelp.netlify.app) 
-

### Live Demo
*The whole booking flow of my webApp.*

![Live Demo video](public\assets\gifs\liveDemo.gif)


### 🏠 Home & Registration Page

*A glimpse of the hotel registration flow.*

![RepHelp Home Page](public\assets\DemoImages\Home.png)
<br/>

![RepHelp Home Page](public\assets\DemoImages\Register.png)
<br/>

### 🔒 Admin Dashboard

*The central hub for managing hotels and appointments.*

![RepHelp Admin Dashboard](public\assets\DemoImages\Admin.png)
<br/>

### 📅 New Appointment Booking

*The simple process for scheduling a new appointment.*

![RepHelp Appointment Booking](public\assets\DemoImages\Booking.png)
<br/>

![RepHelp Appointment Confirmation](public\assets\DemoImages\Confirm.png)
<br/>

---

## 🛠️ Tech Stack

This project is built with a modern and robust technology stack:

| Category              | Technology                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| **Frontend**          | [**Next.js 14**](https://nextjs.org/), [**React 18**](https://react.dev/), [**TypeScript**](https://www.typescriptlang.org/) |
| **Backend & Database**| [**Appwrite**](https://appwrite.io/) (Cloud)                                                           |
| **Styling**           | [**Tailwind CSS**](https://tailwindcss.com/), [**Shadcn/ui**](https://ui.shadcn.com/)                     |
| **Form Management**   | [**React Hook Form**](https://react-hook-form.com/), [**Zod**](https://zod.dev/)                         |
| **API & Server**      | [**Next.js API Routes**](https://nextjs.org/docs/pages/building-your-application/routing/api-routes), [**Node.js**](https://nodejs.org/) |
| **Communication**     | [**Twilio**](https://www.twilio.com/) (SMS/OTP), [**Nodemailer**](https://nodemailer.com/) (Email)       |
| **OCR**               | [**Tesseract.js**](https://tesseract.projectnaptha.com/)                                                 |
| **Error Monitoring**  | [**Sentry**](https://sentry.io/)                                                                         |
| **Deployment**        | [**Vercel**](https://vercel.com/)                                                                        |

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/en/) (v20.x or higher)
*   [npm](https://www.npmjs.com/) (v10.x or higher) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/mayank-1007/rephelp.git
    cd rephelp
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add the following environment variables. You will need to create accounts and get credentials from the respective services.

    ```env
    # Appwrite Configuration
    NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
    NEXT_PUBLIC_APPWRITE_API_KEY=your_appwrite_api_key
    NEXT_PUBLIC_DATABASE_ID=your_appwrite_database_id
    NEXT_PUBLIC_hotel_COLLECTION_ID=your_hotel_collection_id
    NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID=your_appointment_collection_id
    NEXT_PUBLIC_BUCKET_ID=your_appwrite_storage_bucket_id
    NEXT_PUBLIC_ENDPOINT=https://cloud.appwrite.io/v1

    # Twilio Configuration
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_twilio_phone_number

    # Nodemailer Configuration (using Gmail as an example)
    NODEMAILER_EMAIL=your_email@gmail.com
    NODEMAILER_PW=your_gmail_app_password

    # Admin Passkey
    # This is a simple secret to access the admin modal. 
    # In a real-world scenario, use a more robust authentication mechanism.
    ADMIN_PASSKEY=your_secret_admin_passkey
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

5.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🚀 Deployment

The application is deployed using Netlify.

Deployment Link - https://rephelp.netlify.app

---

## 📂 Project Structure

The project follows a standard Next.js `app` directory structure:

```
/
├── app/                # Main application routes and UI
│   ├── (pages)/        # Route groups
│   │   ├── admin/
│   │   └── customer/
│   ├── api/            # API routes (OCR, OTP)
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable React components
│   ├── forms/          # Form components (Register, Appointment)
│   ├── table/          # Reusable data table
│   └── ui/             # UI elements from Shadcn
├── constants/          # Application constants
├── lib/                # Core logic, utilities, and actions
│   ├── actions/        # Server actions for data fetching/mutation
│   └── config/         # Configuration files (e.g., Appwrite)
├── public/             # Static assets (images, icons)
└── types/              # TypeScript type definitions
```

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

<!-- CREATE A LICENSE FILE IF YOU DON'T HAVE ONE -->
<!-- Example:
## 📄 License
Distributed under the MIT License. See `LICENSE.txt` for more information.
-->

---

<div align="center">
  <p>Developed with ❤️ by <strong>Mayank Manchanda</strong></p>
</div>

