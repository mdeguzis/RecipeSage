import { Prisma } from "@prisma/client";
import { userPublic } from "./userPublic";

/**
 * Provides fields necessary for displaying a summary about a meal plan
 **/
export const mealPlanSummaryWithItems = Prisma.validator<Prisma.MealPlanArgs>()(
  {
    select: {
      id: true,
      userId: true,
      user: userPublic,
      collaboratorUsers: {
        select: {
          user: userPublic,
        },
      },
      title: true,
      createdAt: true,
      updatedAt: true,
      items: {
        select: {
          id: true,
          title: true,
          scheduled: true,
          scheduledDate: true,
          meal: true,
          createdAt: true,
          updatedAt: true,
          user: userPublic,
          shoppingListItems: {
            select: {
              id: true,
              title: true,
              shoppingListId: true,
              shoppingList: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          recipe: {
            select: {
              id: true,
              title: true,
              ingredients: true,
              recipeImages: {
                select: {
                  image: {
                    select: {
                      id: true,
                      location: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
);

/**
 * Provides fields necessary for displaying a summary about a meal plan,
 * not including items
 **/
export type MealPlanSummaryWithItems = Prisma.MealPlanGetPayload<
  typeof mealPlanSummaryWithItems
>;
