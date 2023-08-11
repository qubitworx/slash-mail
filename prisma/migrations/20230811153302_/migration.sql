-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
