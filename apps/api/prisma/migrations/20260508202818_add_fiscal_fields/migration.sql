/*
  Warnings:

  - You are about to drop the column `fiscalKey` on the `Sale` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "StoreConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "cnpj" TEXT NOT NULL DEFAULT '11222333000181',
    "razaoSocial" TEXT NOT NULL DEFAULT 'BELLA MAKE COMERCIO DE COSMETICOS LTDA',
    "nomeFantasia" TEXT NOT NULL DEFAULT 'Bella Make',
    "ie" TEXT NOT NULL DEFAULT '111222333444',
    "crt" INTEGER NOT NULL DEFAULT 1,
    "logradouro" TEXT NOT NULL DEFAULT 'Rua das Flores',
    "numero" TEXT NOT NULL DEFAULT '100',
    "bairro" TEXT NOT NULL DEFAULT 'Centro',
    "municipio" TEXT NOT NULL DEFAULT 'São Paulo',
    "uf" TEXT NOT NULL DEFAULT 'SP',
    "cep" TEXT NOT NULL DEFAULT '01310100',
    "telefone" TEXT DEFAULT '11999999999',
    "focusNfeToken" TEXT NOT NULL DEFAULT 'SIMULADO',
    "focusNfeAmbiente" TEXT NOT NULL DEFAULT 'homologacao',
    "nfceSerie" INTEGER NOT NULL DEFAULT 1,
    "nfceUltNumero" INTEGER NOT NULL DEFAULT 0,
    "modoSimulacao" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL DEFAULT 10.0,
    "category" TEXT,
    "ncm" TEXT DEFAULT '3304.99.90',
    "cfop" TEXT NOT NULL DEFAULT '5102',
    "cst" TEXT NOT NULL DEFAULT '400',
    "unidade" TEXT NOT NULL DEFAULT 'UN',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("category", "createdAt", "description", "id", "name", "ncm", "price", "sku", "stock", "updatedAt") SELECT "category", "createdAt", "description", "id", "name", "ncm", "price", "sku", "stock", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE TABLE "new_Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "total" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "cashierSessionId" TEXT NOT NULL,
    "cpfConsumidor" TEXT,
    "nfceRef" TEXT,
    "nfceStatus" TEXT,
    "nfceChave" TEXT,
    "nfceNumero" INTEGER,
    "nfceSerie" INTEGER,
    "nfceQrCode" TEXT,
    "nfceXmlUrl" TEXT,
    "nfceDanfceUrl" TEXT,
    "nfceEmitidoEm" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sale_cashierSessionId_fkey" FOREIGN KEY ("cashierSessionId") REFERENCES "CashierSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sale" ("cashierSessionId", "createdAt", "id", "paymentMethod", "status", "total", "updatedAt") SELECT "cashierSessionId", "createdAt", "id", "paymentMethod", "status", "total", "updatedAt" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
