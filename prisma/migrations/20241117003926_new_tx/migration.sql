/*
  Warnings:

  - You are about to drop the column `chain` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `receiverChain` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderChain` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Transaction_sender_receiver_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "chain",
ADD COLUMN     "receiverChain" TEXT NOT NULL,
ADD COLUMN     "senderChain" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Transaction_sender_idx" ON "Transaction"("sender");
