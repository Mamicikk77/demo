-- AlterTable
ALTER TABLE "Allergen" ADD COLUMN "nameEn" TEXT;
ALTER TABLE "Allergen" ADD COLUMN "nameRu" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "descriptionEn" TEXT;
ALTER TABLE "Product" ADD COLUMN "descriptionRu" TEXT;
ALTER TABLE "Product" ADD COLUMN "nameEn" TEXT;
ALTER TABLE "Product" ADD COLUMN "nameRu" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "nameRu" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "descriptionRu" TEXT,
    "imageUrl" TEXT,
    "section" TEXT NOT NULL DEFAULT 'food',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Category" ("createdAt", "description", "id", "isActive", "isFeatured", "name", "sortOrder", "updatedAt") SELECT "createdAt", "description", "id", "isActive", "isFeatured", "name", "sortOrder", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
