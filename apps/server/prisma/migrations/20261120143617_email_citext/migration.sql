-- citext: сравнение без учёта регистра, Alice@mail.com и alice@mail.com — один email.
-- Расширение Prisma сама не включает, поэтому создаём его здесь.
CREATE EXTENSION IF NOT EXISTS citext;

-- AlterTable
ALTER TABLE "core"."users" ALTER COLUMN "email" SET DATA TYPE CITEXT;
