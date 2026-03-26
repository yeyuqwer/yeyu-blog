ALTER TABLE "SiteComment"
ADD COLUMN "parentId" INTEGER;

CREATE INDEX "SiteComment_parentId_createdAt_idx" ON "SiteComment"("parentId", "createdAt");

ALTER TABLE "SiteComment"
ADD CONSTRAINT "SiteComment_parentId_fkey"
FOREIGN KEY ("parentId") REFERENCES "SiteComment"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
