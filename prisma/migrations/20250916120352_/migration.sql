/*
  Warnings:

  - A unique constraint covering the columns `[habitId,week_start]` on the table `Completion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Completion_habitId_week_start_key" ON "public"."Completion"("habitId", "week_start");
