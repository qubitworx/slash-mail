/*
  Warnings:

  - You are about to drop the column `token` on the `ListConfirmation` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ListConfirmation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ListConfirmation_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ListConfirmation_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "subscribers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ListConfirmation" ("created_at", "id", "listId", "subscriberId") SELECT "created_at", "id", "listId", "subscriberId" FROM "ListConfirmation";
DROP TABLE "ListConfirmation";
ALTER TABLE "new_ListConfirmation" RENAME TO "ListConfirmation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
