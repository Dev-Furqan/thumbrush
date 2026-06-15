PRAGMA foreign_keys=OFF;

CREATE TABLE "new_PortfolioItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imagePublicId" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_PortfolioItem" (
    "id",
    "categoryId",
    "imageUrl",
    "imagePublicId",
    "isFeatured",
    "isPublished",
    "displayOrder",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "categoryId",
    "imageUrl",
    "imagePublicId",
    "isFeatured",
    "isPublished",
    "displayOrder",
    "createdAt",
    "updatedAt"
FROM "PortfolioItem";

DROP TABLE "PortfolioItem";
ALTER TABLE "new_PortfolioItem" RENAME TO "PortfolioItem";

CREATE INDEX "PortfolioItem_categoryId_idx" ON "PortfolioItem"("categoryId");
CREATE INDEX "PortfolioItem_isPublished_isFeatured_displayOrder_createdAt_idx" ON "PortfolioItem"("isPublished", "isFeatured", "displayOrder", "createdAt");

PRAGMA foreign_keys=ON;
