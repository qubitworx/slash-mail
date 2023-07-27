-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subscribers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "smtpId" TEXT NOT NULL
);
INSERT INTO "new_subscribers" ("created_at", "email", "id", "name", "smtpId", "status", "updated_at") SELECT "created_at", "email", "id", "name", "smtpId", "status", "updated_at" FROM "subscribers";
DROP TABLE "subscribers";
ALTER TABLE "new_subscribers" RENAME TO "subscribers";
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
