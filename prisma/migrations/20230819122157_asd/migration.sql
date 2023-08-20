/*
  Warnings:

  - Added the required column `templateId` to the `campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ignoreDefaultTemplate" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Template" ("content", "created_at", "id", "identifier", "json", "name", "updated_at") SELECT "content", "created_at", "id", "identifier", "json", "name", "updated_at" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_name_key" ON "Template"("name");
CREATE UNIQUE INDEX "Template_identifier_key" ON "Template"("identifier");
CREATE TABLE "new_campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "campaigns_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_campaigns" ("created_at", "description", "id", "name", "updated_at") SELECT "created_at", "description", "id", "name", "updated_at" FROM "campaigns";
DROP TABLE "campaigns";
ALTER TABLE "new_campaigns" RENAME TO "campaigns";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
