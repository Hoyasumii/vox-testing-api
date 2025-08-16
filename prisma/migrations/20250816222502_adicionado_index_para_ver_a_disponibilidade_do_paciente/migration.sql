-- CreateIndex
CREATE INDEX "schedules_patient_id_scheduled_at_idx" ON "public"."schedules"("patient_id", "scheduled_at");
