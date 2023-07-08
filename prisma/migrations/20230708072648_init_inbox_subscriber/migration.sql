-- CreateTable
CREATE TABLE "Inbox" (
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

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
