/*
  Warnings:

  - Added the required column `slug` to the `subscribe_pages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "subscribe_page_to_lists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscribePageId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "subscribe_page_to_lists_subscribePageId_fkey" FOREIGN KEY ("subscribePageId") REFERENCES "subscribe_pages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "subscribe_page_to_lists_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subscribe_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "defaultPage" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_subscribe_pages" ("created_at", "description", "id", "primaryColor", "title", "updated_at") SELECT "created_at", "description", "id", "primaryColor", "title", "updated_at" FROM "subscribe_pages";
DROP TABLE "subscribe_pages";
ALTER TABLE "new_subscribe_pages" RENAME TO "subscribe_pages";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
