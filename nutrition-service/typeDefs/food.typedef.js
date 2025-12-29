// typeDefs/food.typedef.js
const { gql } = require('apollo-server');

module.exports = gql`
  type Food {
    _id: ID!
    name: String!
    kcal_per_100g: Float!
    protein: Float!
    carbs: Float!
    fat: Float!
    tags: [String]
    createdAt: Date!
    updatedAt: Date!
  }

  input FoodInput {
    name: String!
    kcal_per_100g: Float!
    protein: Float!
    carbs: Float!
    fat: Float!
    tags: [String]
  }

  extend type Query {
    foods(search: String): [Food!]!
  }

  extend type Mutation {
    createFood(input: FoodInput!): Food!
    updateFood(food_id: ID!, input: FoodInput!): Food!
    deleteFood(food_id: ID!): MutationResult!
  }
`;