-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requires_confirmation" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "sMTPSettingsId" TEXT,
    CONSTRAINT "lists_sMTPSettingsId_fkey" FOREIGN KEY ("sMTPSettingsId") REFERENCES "smtp_settings" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_lists" ("created_at", "description", "id", "name", "requires_confirmation", "updated_at") SELECT "created_at", "description", "id", "name", "requires_confirmation", "updated_at" FROM "lists";
DROP TABLE "lists";
ALTER TABLE "new_lists" RENAME TO "lists";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
