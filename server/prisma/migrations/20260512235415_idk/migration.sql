/*
  Warnings:

  - Added the required column `flavours` to the `Coffee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coffee" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    "flavours" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "weightGrams" INTEGER NOT NULL,
    "roastLevel" TEXT NOT NULL,
    "grindSize" INTEGER,
    CONSTRAINT "Coffee_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Coffee" ("form", "grindSize", "productId", "roastLevel", "weightGrams") SELECT "form", "grindSize", "productId", "roastLevel", "weightGrams" FROM "Coffee";
DROP TABLE "Coffee";
ALTER TABLE "new_Coffee" RENAME TO "Coffee";
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL
);
INSERT INTO "new_Product" ("category", "description", "id", "name", "unitPriceCents") SELECT "category", "description", "id", "name", "unitPriceCents" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
