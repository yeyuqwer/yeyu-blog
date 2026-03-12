-- CreateTable
CREATE TABLE "MutterCommentConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "autoApproveEmailUsers" BOOLEAN NOT NULL DEFAULT true,
    "autoApproveWalletUsers" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MutterCommentConfig_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "MutterCommentConfig_singleton_check" CHECK ("id" = 1)
);
