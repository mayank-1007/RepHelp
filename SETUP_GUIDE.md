# RepHelp - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Neon Postgres account
- Cloudinary account
- Gmail account for email (or SMTP provider)

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/mayank-1007/rephelp.git
cd rephelp
npm install
```

### 2. Set Up Neon Postgres Database

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project
3. Copy your connection string
4. Update `.env.local` with your DATABASE_URL

### 3. Set Up Cloudinary

1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add to `.env.local`

### 4. Configure Environment Variables

Create `.env.local` in the root directory:

```env
# Neon Postgres
DATABASE_URL="postgresql://username:password@your-host.neon.tech/neondb?sslmode=require"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (Gmail)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"

# Admin Access
NEXT_PUBLIC_ADMIN_PASSKEY="111111"

# Optional: Twilio for SMS
TWILIO_ACCOUNT_SID="your-sid"
TWILIO_AUTH_TOKEN="your-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### 5. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
RepHelp/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── customer/          # Customer routes
├── components/            # React components
│   ├── form/             # Form components
│   ├── table/            # Data table components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and configurations
│   ├── actions/          # Server actions
│   ├── db.ts             # Prisma client
│   ├── cloudinary.ts     # Cloudinary config
│   └── utils.ts          # Helper functions
├── prisma/
│   └── schema.prisma     # Database schema
└── types/                 # TypeScript types
```

## 🗄️ Database Schema

### Customer Table
- User identification (name, email, phone)
- OTP verification
- Timestamps

### CustomerDetail Table
- Personal information
- Identification documents
- Images and signatures (Cloudinary URLs)
- Consent flags

### Appointment Table
- Booking details
- Check-in/check-out dates
- Status tracking

## 🔧 Key Features

- **✅ Customer Registration** with OTP verification
- **✅ Document Upload** to Cloudinary
- **✅ Appointment Booking** system
- **✅ Admin Dashboard** with statistics
- **✅ Email Notifications** via Nodemailer
- **✅ Image Uploads** (customer photo, signature, documents)

## 📝 TODO Items

- [ ] Add authentication middleware
- [ ] Implement booking payment integration
- [ ] Add SMS verification option
- [ ] Create customer portal for viewing bookings
- [ ] Add email templates
- [ ] Implement search and filtering in admin
- [ ] Add data export functionality
- [ ] Create booking confirmation PDFs

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Neon Postgres
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Forms**: React Hook Form + Zod
- **UI**: shadcn/ui, Radix UI

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use Gmail App Passwords (not your main password)
- Rotate API keys regularly
- Implement rate limiting for production
- Add CORS configuration for production

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Neon project is active
- Ensure SSL mode is enabled

### Cloudinary Upload Fails
- Verify API credentials
- Check file size limits
- Ensure folder permissions

### Email Not Sending
- Use Gmail App Password (not regular password)
- Enable "Less secure app access" if needed
- Check SMTP settings

## 📞 Support

For issues and questions:
- GitHub Issues: [RepHelp Issues](https://github.com/mayank-1007/rephelp/issues)
- Email: support@rephelp.com

## 📄 License

MIT License - see LICENSE file for details
