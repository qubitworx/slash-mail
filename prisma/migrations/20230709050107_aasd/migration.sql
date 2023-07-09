/*
  Warnings:

  - You are about to drop the `inboxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `inboxId` on the `subscribers` table. All the data in the column will be lost.
  - Added the required column `smtpId` to the `subscribers` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "inboxes";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "smtp_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "smtp_host" TEXT NOT NULL,
    "smtp_port" INTEGER NOT NULL,
    "smtp_user" TEXT NOT NULL,
    "smtp_pass" TEXT NOT NULL,
    "smtp_tls" BOOLEAN NOT NULL DEFAULT true,
    "smtp_from" TEXT NOT NULL,
    "auth_protocol" TEXT NOT NULL,
    "max_connections" INTEGER NOT NULL,
    "max_retries" INTEGER NOT NULL,
    "idle_timeout" INTEGER NOT NULL,
    "wait_timeout" INTEGER NOT NULL,
    "custom_headers" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subscribers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "smtpId" TEXT NOT NULL,
    CONSTRAINT "subscribers_smtpId_fkey" FOREIGN KEY ("smtpId") REFERENCES "smtp_settings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_subscribers" ("created_at", "email", "id", "name", "status", "updated_at") SELECT "created_at", "email", "id", "name", "status", "updated_at" FROM "subscribers";
DROP TABLE "subscribers";
ALTER TABLE "new_subscribers" RENAME TO "subscribers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
