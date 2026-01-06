const { gql } = require('apollo-server');
const foodTypeDefs = require('./food.typedef');
const mealTypeDefs = require('./meal.typedef');
const mealPlanTypeDefs = require('./mealPlan.typedef');

const baseTypeDefs = gql` 
  scalar Date
  
  type NutritionalReport {
    totalCalories: Float!
    totalProtein: Float!
    totalCarbs: Float!
    totalFat: Float!
    meals: Int!
  }

  type MutationResult {
    success: Boolean!
    message: String!
  }

  type Query {
    testContext: String!
  }

  type Mutation {
    _placeholder: String
  }
`;

// Exportar todos combinados
module.exports = [
  baseTypeDefs,
  foodTypeDefs,
  mealTypeDefs,
  mealPlanTypeDefs
];