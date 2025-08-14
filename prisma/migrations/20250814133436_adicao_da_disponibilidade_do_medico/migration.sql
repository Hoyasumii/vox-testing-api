/*
  Warnings:

  - You are about to drop the column `date` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `availability_id` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduled_at` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."schedules" DROP CONSTRAINT "schedules_patientId_fkey";

-- AlterTable
ALTER TABLE "public"."schedules" DROP COLUMN "date",
DROP COLUMN "patientId",
ADD COLUMN     "availability_id" TEXT NOT NULL,
ADD COLUMN     "patient_id" TEXT NOT NULL,
ADD COLUMN     "scheduled_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."doctors_availability" (
    "id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER NOT NULL,

    CONSTRAINT "doctors_availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "doctors_availability_doctor_id_day_of_week_idx" ON "public"."doctors_availability"("doctor_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_availability_doctor_id_day_of_week_start_time_end_t_key" ON "public"."doctors_availability"("doctor_id", "day_of_week", "start_time", "end_time");

-- AddForeignKey
ALTER TABLE "public"."doctors_availability" ADD CONSTRAINT "doctors_availability_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_availability_id_fkey" FOREIGN KEY ("availability_id") REFERENCES "public"."doctors_availability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
