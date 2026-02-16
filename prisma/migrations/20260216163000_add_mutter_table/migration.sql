-- CreateTable
CREATE TABLE "Mutter" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(300) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mutter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mutter_createdAt_idx" ON "Mutter"("createdAt");

-- CreateIndex
CREATE INDEX "Mutter_isPublished_createdAt_idx" ON "Mutter"("isPublished", "createdAt");
