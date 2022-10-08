-- CreateTable
CREATE TABLE "Match" (
    "creatingUserId" INTEGER NOT NULL,
    "initiatingUserId" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("creatingUserId","initiatingUserId")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_creatingUserId_fkey" FOREIGN KEY ("creatingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_initiatingUserId_fkey" FOREIGN KEY ("initiatingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
