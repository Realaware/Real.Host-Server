/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "userid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
INSERT INTO "new_User" ("userid", "username", "uuid") SELECT "userid", "username", "uuid" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
