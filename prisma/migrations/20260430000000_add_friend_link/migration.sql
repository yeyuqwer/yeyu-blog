CREATE TYPE "FriendLinkState" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "FriendLink" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(120) NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "siteUrl" TEXT NOT NULL,
    "state" "FriendLinkState" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FriendLink_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FriendLink_state_createdAt_idx" ON "FriendLink"("state", "createdAt");

CREATE INDEX "FriendLink_state_updatedAt_idx" ON "FriendLink"("state", "updatedAt");
