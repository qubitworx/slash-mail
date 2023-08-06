/*
  Warnings:

  - You are about to drop the column `status` on the `subscribers` table. All the data in the column will be lost.
  - Added the required column `status` to the `list_subscribers` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_list_subscribers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "listId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    CONSTRAINT "list_subscribers_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "list_subscribers_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "subscribers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_list_subscribers" ("created_at", "id", "listId", "subscriberId", "updated_at") SELECT "created_at", "id", "listId", "subscriberId", "updated_at" FROM "list_subscribers";
DROP TABLE "list_subscribers";
ALTER TABLE "new_list_subscribers" RENAME TO "list_subscribers";
CREATE TABLE "new_subscribers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_subscribers" ("created_at", "data", "email", "id", "name", "updated_at") SELECT "created_at", "data", "email", "id", "name", "updated_at" FROM "subscribers";
DROP TABLE "subscribers";
ALTER TABLE "new_subscribers" RENAME TO "subscribers";
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
