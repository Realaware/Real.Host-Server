-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "image" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uuid" TEXT NOT NULL,
    "imageid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userid" INTEGER NOT NULL,
    FOREIGN KEY ("userid") REFERENCES "User" ("userid") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("image", "imageid", "userid", "uuid") SELECT "image", "imageid", "userid", "uuid" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
