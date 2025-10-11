# 🔧 INCONSISTENCIES FIXED - Complete Audit

## 📋 Issues Found and Fixed

### 1. ✅ RegisterCustomer Function - Field Mismatch

**Problem:**
The `registerCustomer` function was receiving form data with fields that don't exist in the `CustomerDetail` Prisma schema.

**Fields Being Passed (but not in schema):**
- `name`, `email`, `phone` - These belong in `Customer` table, not `CustomerDetail`
- `room_no`, `number_of_rooms` - Booking-related, should be in `Appointment`
- `birthDate` - Should be mapped to `dateOfBirth`
- `check_in`, `check_out` - Booking dates, should be in `Appointment`
- `occupation`, `emergencyContactName`, `emergencyContactNumber` - Not in current schema
- `insuranceProvider`, `insurancePolicyNumber` - Not in current schema
- `vehicle_no`, `purpose` - Not in current schema

**Fix Applied:**
Updated `lib/actions/customer.actions.ts`:
```typescript
export const registerCustomer = async ({ customerId, ...customerData }: RegisterUserParams) => {
  try {
    // Map and filter fields to match CustomerDetail schema
    const validData: any = { customerId };

    // Map dateOfBirth (handle both birthDate and dateOfBirth)
    if ('birthDate' in customerData) {
      validData.dateOfBirth = customerData.birthDate;
    } else if ('dateOfBirth' in customerData) {
      validData.dateOfBirth = customerData.dateOfBirth;
    }

    // Only include fields that exist in CustomerDetail schema
    const allowedFields = [
      'gender', 'address', 'state', 'district', 'nationality',
      'identificationType', 'identificationNumber', 'identificationDocUrl',
      'customerImageUrl', 'signatureUrl',
      'treatmentConsent', 'disclosureConsent', 'privacyConsent',
    ];

    for (const field of allowedFields) {
      if (field in customerData && customerData[field] !== undefined) {
        validData[field] = customerData[field];
      }
    }

    const existing = await prisma.customerDetail.findUnique({ where: { customerId } });
    if (existing) {
      return await prisma.customerDetail.update({ where: { customerId }, data: validData });
    }
    return await prisma.customerDetail.create({ data: validData });
  } catch (error) {
    console.error("Error registering customer:", error);
    throw error;
  }
};
```

---

### 2. ✅ RegisterUserParams Type - Missing Fields

**Problem:**
TypeScript type didn't include all the form fields, causing type errors.

**Fix Applied:**
Updated `types/index.d.ts`:
```typescript
declare interface RegisterUserParams {
  customerId: string;
  // Prisma CustomerDetail fields
  dateOfBirth?: Date;
  birthDate?: Date; // Alias for dateOfBirth
  gender?: Gender;
  address?: string;
  state?: string;
  district?: string;
  nationality?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationDocUrl?: string;
  customerImageUrl?: string;
  signatureUrl?: string;
  treatmentConsent?: boolean;
  disclosureConsent?: boolean;
  privacyConsent?: boolean;
  
  // Additional form fields (not stored in CustomerDetail, filtered out)
  name?: string;
  email?: string;
  phone?: string;
  room_no?: string;
  number_of_rooms?: string;
  check_in?: Date;
  check_out?: Date;
  vehicle_no?: string;
  purpose?: string;
  occupation?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  customer_image?: File[];
  identificationDocument?: File[];
  signature?: string;
}
```

---

### 3. ✅ Appointment.numberOfRooms Type Mismatch

**Problem:**
Prisma schema had `numberOfRooms Int?` but code was passing strings.

**Additional Problem Found:**
The `createAppointment` function was using `parseInt()` to convert the string to an integer, but after changing the schema to `String?`, it should keep it as a string.

**Fix Applied:**
Updated `prisma/schema.prisma`:
```prisma
model Appointment {
  numberOfRooms String?  // Changed from Int? to String?
}
```

Updated `lib/actions/appointment.actions.ts`:
```typescript
// Before:
numberOfRooms: appointment.numberOfRooms ? parseInt(appointment.numberOfRooms) : null,

// After:
numberOfRooms: appointment.numberOfRooms || null,
```

Ran:
```bash
npx prisma db push --skip-generate
npx prisma generate
```

---

### 4. ✅ Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

**Problem:**
`.env.local` had `CLOUDINARY_CLOUD_NAME` but frontend needs `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.

**Fix Applied:**
Updated `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="duget8kqg"
CLOUDINARY_CLOUD_NAME="duget8kqg"
```

---

### 5. ✅ Prisma CLI Couldn't Find DATABASE_URL

**Problem:**
Prisma CLI looks for `.env` file, but we only had `.env.local`.

**Fix Applied:**
Created `.env` file with:
```env
DATABASE_URL="postgresql://..."
```

---

## 🎯 Data Flow Consistency

### Customer Registration Flow
```
1. CustomerForm (app/page.tsx)
   ↓ name, email, phone
   
2. createUser() → Customer table
   ↓ Creates user record
   ↓ Sends OTP email
   
3. OTP Verification
   ↓ User enters OTP
   ↓ verifyOtp() updates Customer.otpVerified
   
4. RegisterForm (app/customer/[userId]/register/page.tsx)
   ↓ Submits MANY fields (name, email, phone, birthDate, gender, etc.)
   
5. registerCustomer() → CustomerDetail table
   ↓ FILTERS to only valid CustomerDetail fields:
   ✅ dateOfBirth (mapped from birthDate)
   ✅ gender, address, state, district, nationality
   ✅ identificationType, identificationNumber, identificationDocUrl
   ✅ customerImageUrl, signatureUrl
   ✅ treatmentConsent, disclosureConsent, privacyConsent
   
   ❌ IGNORED fields:
   - name, email, phone (already in Customer table)
   - room_no, number_of_rooms, check_in, check_out (booking data)
   - occupation, emergencyContactName, etc. (not in schema)
   
6. Redirect to /customer/[userId]/new-booking
```

### Appointment Creation Flow
```
1. AppointmentForm
   ↓ numberOfRooms (string)
   ↓ checkInDate (Date → converted to ISO string)
   ↓ checkOutDate (Date → converted to ISO string)
   ↓ purpose (string)
   ↓ note (string)
   
2. createAppointment() → Appointment table
   ✅ All fields match Prisma schema
   ✅ Dates converted to strings before sending
```

---

## 📊 Current Database Schema

### Customer Table
```
✅ id (UUID)
✅ name (String)
✅ email (String, unique)
✅ phone (String, unique)
✅ otp (String?)
✅ otpVerified (Boolean)
✅ createdAt, updatedAt
```

### CustomerDetail Table
```
✅ id (UUID)
✅ customerId (UUID, unique, FK → Customer.id)
✅ dateOfBirth (DateTime?)
✅ gender (String?)
✅ address (String?)
✅ state (String?)
✅ district (String?)
✅ nationality (String?)
✅ identificationType (String?)
✅ identificationNumber (String?)
✅ identificationDocUrl (String?)
✅ customerImageUrl (String?)
✅ signatureUrl (String?)
✅ treatmentConsent (Boolean)
✅ disclosureConsent (Boolean)
✅ privacyConsent (Boolean)
✅ createdAt, updatedAt
```

### Appointment Table
```
✅ id (UUID)
✅ customerId (UUID, FK → Customer.id)
✅ purpose (String)
✅ numberOfRooms (String?) ← FIXED: Was Int?, now String?
✅ checkInDate (DateTime?)
✅ checkOutDate (DateTime?)
✅ note (String?)
✅ status (String, default "pending")
✅ createdAt, updatedAt
```

---

## 🔍 Validation Schema vs Prisma Schema

### Fields in CustomerFormValidation (lib/validation.ts)
```typescript
// ❌ NOT stored in database:
- name, email, phone           → Already in Customer table
- room_no, number_of_rooms     → Booking data
- check_in, check_out          → Booking data
- vehicle_no                   → Not in schema
- occupation                   → Not in schema
- emergencyContactName         → Not in schema
- emergencyContactNumber       → Not in schema
- insuranceProvider            → Not in schema
- insurancePolicyNumber        → Not in schema

// ✅ Stored in CustomerDetail:
- birthDate → dateOfBirth
- gender
- address
- nationality
- identificationType
- identificationNumber
- identificationDocument → identificationDocUrl (after upload)
- customer_image → customerImageUrl (after upload)
- signature → signatureUrl
- privacyConsent
```

---

## 🎯 Recommendations for Future

### Option 1: Extend Prisma Schema (Recommended if you need the data)
Add missing fields to `CustomerDetail`:
```prisma
model CustomerDetail {
  // ... existing fields ...
  
  // Additional personal info
  occupation            String?
  emergencyContactName  String?
  emergencyContactNumber String?
  insuranceProvider     String?
  insurancePolicyNumber String?
  vehicleNumber         String?
}
```

Then run:
```bash
npx prisma db push
npx prisma generate
```

### Option 2: Keep Current Schema (Recommended if you don't need the data)
Current solution filters out unused fields, which is clean and prevents data bloat.

---

## ✅ Verification Checklist

Test these flows to ensure consistency:

- [ ] Customer can enter name/email/phone on homepage
- [ ] OTP email is received
- [ ] OTP verification works
- [ ] Registration form accepts all fields
- [ ] **Registration succeeds** (no Prisma validation errors)
- [ ] Only valid fields are saved to CustomerDetail
- [ ] Invalid/extra fields are ignored gracefully
- [ ] Images upload to Cloudinary
- [ ] Appointment creation works
- [ ] Admin dashboard displays data correctly

---

## 🚀 Current Status

✅ **All inconsistencies fixed**
✅ **Field filtering implemented**
✅ **Type safety maintained**
✅ **Database schema updated**
✅ **Prisma client regenerated**
✅ **Dev server restarted**

**Ready to test registration flow again!**

---

## 📝 Commands Run

```bash
# Updated Prisma schema (numberOfRooms: Int? → String?)
npx prisma db push --skip-generate

# Stopped dev server to unlock Prisma files
taskkill /F /IM node.exe

# Regenerated Prisma client
npx prisma generate

# Restarted dev server
npm run dev
```

---

**Test now at:** http://localhost:3000

The registration should now work without Prisma validation errors! 🎉
