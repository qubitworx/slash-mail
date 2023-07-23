/*
  Warnings:

  - A unique constraint covering the columns `[filename]` on the table `media` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "media_filename_key" ON "media"("filename");
