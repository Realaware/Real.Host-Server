-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "userid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Image" (
    "image" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "imageid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userid" INTEGER NOT NULL,
    FOREIGN KEY ("userid") REFERENCES "User" ("userid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "name" TEXT NOT NULL,
    "roleid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Role" ("roleid") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "User" ("userid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Role.name_unique" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");
