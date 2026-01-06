const { gql } = require('apollo-server');

module.exports = gql`
  enum MealType {
    BREAKFAST
    LUNCH
    DINNER
    SNACK
    OTHER
  }

  type MealItem {
    foodName: String!
    grams: Float!
    calories: Float
    protein: Float
    carbs: Float
    fat: Float
  }

  type Meal {
    _id: ID!
    user_id: ID!
    date_time: Date!
    meal_type: MealType!
    items: [MealItem!]!
    createdAt: Date!
    updatedAt: Date!
    # REMOVA estes campos se estiver usando os virtuais do Mongoose
    # totalCalories: Float!
    # totalProtein: Float!
    # totalCarbs: Float!
    # totalFat: Float!
  }

  type DailySummary {
    date: String!
    totalCalories: Float!
    totalProtein: Float!
    totalCarbs: Float!
    totalFat: Float!
    meals: [Meal!]!
  }

  input MealItemInput {
    foodName: String!
    grams: Float!
    calories: Float
    protein: Float
    carbs: Float
    fat: Float
  }

  input CreateMealInput {
    date_time: String
    meal_type: MealType!
    items: [MealItemInput!]!
  }

  input UpdateMealInput {
    date_time: String
    meal_type: MealType
    items: [MealItemInput!]
  }

  extend type Query {
    # Para o utilizador
    myMeals(date: String): [Meal!]!
    myDailySummary(date: String!): DailySummary!
    myMeal(meal_id: ID!): Meal!
    
    # Para instrutores
    userMealsByDate(user_id: ID!, date: String!): [Meal!]!
    userDailySummary(user_id: ID!, date: String!): DailySummary!
  }

  extend type Mutation {
    createMeal(input: CreateMealInput!): Meal!
    updateMeal(meal_id: ID!, input: UpdateMealInput!): Meal!
    deleteMeal(meal_id: ID!): MutationResult!
  }
`;