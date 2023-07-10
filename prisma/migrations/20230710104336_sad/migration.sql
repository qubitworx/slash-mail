/*
  Warnings:

  - Added the required column `helo_host` to the `smtp_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tls` to the `smtp_settings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_smtp_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "smtp_host" TEXT NOT NULL,
    "smtp_port" INTEGER NOT NULL,
    "smtp_user" TEXT NOT NULL,
    "smtp_pass" TEXT NOT NULL,
    "auth_protocol" TEXT NOT NULL,
    "tls" TEXT NOT NULL,
    "helo_host" TEXT NOT NULL,
    "smtp_from" TEXT NOT NULL,
    "smtp_tls" BOOLEAN NOT NULL DEFAULT true,
    "max_connections" INTEGER NOT NULL,
    "max_retries" INTEGER NOT NULL,
    "idle_timeout" INTEGER NOT NULL,
    "wait_timeout" INTEGER NOT NULL,
    "custom_headers" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_smtp_settings" ("auth_protocol", "created_at", "custom_headers", "id", "idle_timeout", "max_connections", "max_retries", "smtp_from", "smtp_host", "smtp_pass", "smtp_port", "smtp_tls", "smtp_user", "updated_at", "wait_timeout") SELECT "auth_protocol", "created_at", "custom_headers", "id", "idle_timeout", "max_connections", "max_retries", "smtp_from", "smtp_host", "smtp_pass", "smtp_port", "smtp_tls", "smtp_user", "updated_at", "wait_timeout" FROM "smtp_settings";
DROP TABLE "smtp_settings";
ALTER TABLE "new_smtp_settings" RENAME TO "smtp_settings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
