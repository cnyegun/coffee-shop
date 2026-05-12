-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Coffee" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    "form" TEXT NOT NULL,
    "weightGrams" INTEGER NOT NULL,
    "roastLevel" TEXT NOT NULL,
    "grindSize" INTEGER,
    CONSTRAINT "Coffee_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Merch" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    "merchType" TEXT NOT NULL,
    CONSTRAINT "Merch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BundleItem" (
    "bundleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("bundleId", "productId"),
    CONSTRAINT "BundleItem_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle" ("productId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BundleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bundle" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "Bundle_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
