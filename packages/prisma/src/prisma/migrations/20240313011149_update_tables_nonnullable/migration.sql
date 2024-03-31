-- AlterTable
ALTER TABLE "FCMTokens" ALTER COLUMN "token" SET NOT NULL;

-- AlterTable
ALTER TABLE "Images" ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "key" SET NOT NULL,
ALTER COLUMN "json" SET NOT NULL;

-- AlterTable
ALTER TABLE "MealPlanItems" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "meal" SET NOT NULL;

-- AlterTable
ALTER TABLE "MealPlans" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Sessions" ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "token" SET NOT NULL,
ALTER COLUMN "expires" SET NOT NULL;

-- AlterTable
ALTER TABLE "ShoppingLists" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserSubscriptions" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;
