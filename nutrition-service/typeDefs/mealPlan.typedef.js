const { gql } = require('apollo-server');

module.exports = gql`
  type ScheduledMeal {
    time: String      # "pequeno almoço", "almoço"
    description: String
  }

  type MealPlan {
    _id: ID!
    user_ids: [ID]
    name: String
    schedule: [ScheduledMeal]  # ← Nome diferente
    start_date: String
    end_date: String
    total_calories: Int
    createdAt: String
    updatedAt: String
  }

  input ScheduledMealInput {
    time: String
    description: String
  }

  input MealPlanInput {
    user_ids: [ID]
    name: String
    schedule: [ScheduledMealInput]  # ← Nome diferente
    start_date: String
    end_date: String
    total_calories: Int
  }

  extend type Query {
    myMealPlans: [MealPlan]
    allMealPlans: [MealPlan]
    mealPlan(plan_id: ID!): MealPlan
  }

  extend type Mutation {
    createMealPlan(input: MealPlanInput!): MealPlan!
    deleteMealPlan(plan_id: ID!): MutationResult!
    updateMealPlan(plan_id: ID!, input: MealPlanInput!): MealPlan!  # ← ADICIONE ESTA LINHA
  }
`;