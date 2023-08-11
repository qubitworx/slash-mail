-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_list_subscribers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "listId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    CONSTRAINT "list_subscribers_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "list_subscribers_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "subscribers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_list_subscribers" ("created_at", "id", "listId", "status", "subscriberId", "updated_at") SELECT "created_at", "id", "listId", "status", "subscriberId", "updated_at" FROM "list_subscribers";
DROP TABLE "list_subscribers";
ALTER TABLE "new_list_subscribers" RENAME TO "list_subscribers";
CREATE TABLE "new_lists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requires_confirmation" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "sMTPSettingsId" TEXT,
    CONSTRAINT "lists_sMTPSettingsId_fkey" FOREIGN KEY ("sMTPSettingsId") REFERENCES "smtp_settings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_lists" ("created_at", "description", "id", "name", "requires_confirmation", "sMTPSettingsId", "updated_at") SELECT "created_at", "description", "id", "name", "requires_confirmation", "sMTPSettingsId", "updated_at" FROM "lists";
DROP TABLE "lists";
ALTER TABLE "new_lists" RENAME TO "lists";
CREATE TABLE "new_subscribe_page_to_lists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "subscribePageId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    CONSTRAINT "subscribe_page_to_lists_subscribePageId_fkey" FOREIGN KEY ("subscribePageId") REFERENCES "subscribe_pages" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "subscribe_page_to_lists_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_subscribe_page_to_lists" ("created_at", "id", "listId", "subscribePageId", "updated_at") SELECT "created_at", "id", "listId", "subscribePageId", "updated_at" FROM "subscribe_page_to_lists";
DROP TABLE "subscribe_page_to_lists";
ALTER TABLE "new_subscribe_page_to_lists" RENAME TO "subscribe_page_to_lists";
CREATE TABLE "new_campaign_to_lists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "campaignId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    CONSTRAINT "campaign_to_lists_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "campaign_to_lists_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_campaign_to_lists" ("campaignId", "created_at", "id", "listId", "updated_at") SELECT "campaignId", "created_at", "id", "listId", "updated_at" FROM "campaign_to_lists";
DROP TABLE "campaign_to_lists";
ALTER TABLE "new_campaign_to_lists" RENAME TO "campaign_to_lists";
CREATE TABLE "new_ListConfirmation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ListConfirmation_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListConfirmation_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "subscribers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ListConfirmation" ("created_at", "id", "listId", "subscriberId") SELECT "created_at", "id", "listId", "subscriberId" FROM "ListConfirmation";
DROP TABLE "ListConfirmation";
ALTER TABLE "new_ListConfirmation" RENAME TO "ListConfirmation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
