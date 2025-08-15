/*
  Warnings:

  - You are about to drop the column `user_id` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `doctors_availability` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `doctors_availability` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctor_id,day_of_week,start_hour,end_hour]` on the table `doctors_availability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `end_hour` to the `doctors_availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_hour` to the `doctors_availability` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."doctors" DROP CONSTRAINT "doctors_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."doctors_availability" DROP CONSTRAINT "doctors_availability_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."schedules" DROP CONSTRAINT "schedules_availability_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."schedules" DROP CONSTRAINT "schedules_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."schedules" DROP CONSTRAINT "schedules_patient_id_fkey";

-- DropIndex
DROP INDEX "public"."doctors_user_id_idx";

-- DropIndex
DROP INDEX "public"."doctors_user_id_key";

-- DropIndex
DROP INDEX "public"."doctors_availability_doctor_id_day_of_week_start_time_end_t_key";

-- AlterTable
ALTER TABLE "public"."doctors" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "public"."doctors_availability" DROP COLUMN "end_time",
DROP COLUMN "start_time",
ADD COLUMN     "end_hour" INTEGER NOT NULL,
ADD COLUMN     "start_hour" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."schedules" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';

-- CreateIndex
CREATE INDEX "doctors_id_idx" ON "public"."doctors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_availability_doctor_id_day_of_week_start_hour_end_h_key" ON "public"."doctors_availability"("doctor_id", "day_of_week", "start_hour", "end_hour");

-- CreateIndex
CREATE INDEX "schedules_patient_id_idx" ON "public"."schedules"("patient_id");

-- CreateIndex
CREATE INDEX "schedules_doctor_id_scheduled_at_idx" ON "public"."schedules"("doctor_id", "scheduled_at");

-- AddForeignKey
ALTER TABLE "public"."doctors" ADD CONSTRAINT "doctors_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."doctors_availability" ADD CONSTRAINT "doctors_availability_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_availability_id_fkey" FOREIGN KEY ("availability_id") REFERENCES "public"."doctors_availability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
