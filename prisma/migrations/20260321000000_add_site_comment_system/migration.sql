CREATE TYPE "SiteCommentTargetType" AS ENUM ('BLOG', 'NOTE');

CREATE TYPE "SiteCommentState" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "SiteComment" (
    "id" SERIAL NOT NULL,
    "targetType" "SiteCommentTargetType" NOT NULL,
    "targetId" INTEGER NOT NULL,
    "userId" TEXT,
    "authorName" VARCHAR(120) NOT NULL,
    "authorImage" TEXT,
    "content" VARCHAR(500) NOT NULL,
    "state" "SiteCommentState" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SiteCommentConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "autoApproveEmailUsers" BOOLEAN NOT NULL DEFAULT true,
    "autoApproveWalletUsers" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteCommentConfig_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SiteComment_targetType_targetId_createdAt_idx" ON "SiteComment"("targetType", "targetId", "createdAt");

CREATE INDEX "SiteComment_state_createdAt_idx" ON "SiteComment"("state", "createdAt");

CREATE INDEX "SiteComment_userId_createdAt_idx" ON "SiteComment"("userId", "createdAt");

ALTER TABLE "SiteComment"
ADD CONSTRAINT "SiteComment_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
