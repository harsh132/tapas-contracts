-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "chain" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "amountUSD" TEXT NOT NULL,
    "senderTxHash" TEXT NOT NULL,
    "receiverTxHash" TEXT NOT NULL,
    "signer" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transaction_sender_receiver_idx" ON "Transaction"("sender", "receiver");
