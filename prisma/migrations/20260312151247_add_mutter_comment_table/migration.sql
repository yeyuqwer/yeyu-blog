-- CreateEnum
CREATE TYPE "MutterCommentState" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "MutterComment" (
    "id" SERIAL NOT NULL,
    "mutterId" INTEGER NOT NULL,
    "userId" TEXT,
    "authorName" VARCHAR(120) NOT NULL,
    "authorImage" TEXT,
    "content" VARCHAR(500) NOT NULL,
    "state" "MutterCommentState" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MutterComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MutterComment_mutterId_createdAt_idx" ON "MutterComment"("mutterId", "createdAt");

-- CreateIndex
CREATE INDEX "MutterComment_state_createdAt_idx" ON "MutterComment"("state", "createdAt");

-- CreateIndex
CREATE INDEX "MutterComment_userId_createdAt_idx" ON "MutterComment"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "MutterComment" ADD CONSTRAINT "MutterComment_mutterId_fkey" FOREIGN KEY ("mutterId") REFERENCES "Mutter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutterComment" ADD CONSTRAINT "MutterComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
