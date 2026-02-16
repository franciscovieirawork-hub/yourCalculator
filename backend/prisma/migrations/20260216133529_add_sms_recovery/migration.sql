-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "phoneNumber" TEXT,
    "securityQuestion" TEXT,
    "securityAnswer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taxSituation" TEXT,
    "numberOfDependents" INTEGER NOT NULL DEFAULT 0,
    "irsRegime" TEXT,
    "region" TEXT,
    "adse" BOOLEAN NOT NULL DEFAULT false,
    "irsJovem" BOOLEAN NOT NULL DEFAULT false,
    "mealAllowance" DOUBLE PRECISION,
    "mealAllowanceTaxFree" BOOLEAN NOT NULL DEFAULT true,
    "twelfthHoliday" BOOLEAN NOT NULL DEFAULT false,
    "twelfthChristmas" BOOLEAN NOT NULL DEFAULT false,
    "selfEmployed" BOOLEAN NOT NULL DEFAULT false,
    "activityCode" TEXT,
    "firstYearActivity" BOOLEAN NOT NULL DEFAULT false,
    "municipality" TEXT,
    "municipalityTaxRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "calculatorId" TEXT NOT NULL,
    "calculatorName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pdfBlob" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "SavedDocument_userId_idx" ON "SavedDocument"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetCode_userId_expiresAt_idx" ON "PasswordResetCode"("userId", "expiresAt");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedDocument" ADD CONSTRAINT "SavedDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetCode" ADD CONSTRAINT "PasswordResetCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
