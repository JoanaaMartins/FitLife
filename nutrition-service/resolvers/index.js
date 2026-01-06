const { GraphQLScalarType, Kind } = require('graphql');
const foodResolvers = require('./Food.resolver');
const mealResolvers = require('./Meal.resolver');
const mealPlanResolvers = require('./MealPlan.resolver');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'number') {
      return new Date(value).toISOString();
    }
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return new Date(value).toISOString();
    }
    return value;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const resolvers = {
  Date: dateScalar,
  
  Query: {
    testContext: async (_, __, context) => {
      console.log('🔍 TestContext chamado. Context:', context);
      if (context.user) {
        return `Usuário autenticado: ${context.user.email} (${context.user.role})`;
      }
      return 'NÃO autenticado. Faça login primeiro.';
    }
  },
  
  Mutation: {
  }
};

function mergeObjects(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && 
          typeof target[key] === 'object' && target[key] !== null) {
        mergeObjects(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
}

if (mealResolvers.Query) {
  mergeObjects(resolvers.Query, mealResolvers.Query);
}
if (mealResolvers.Mutation) {
  mergeObjects(resolvers.Mutation, mealResolvers.Mutation);
}

if (foodResolvers && foodResolvers.Query) {
  mergeObjects(resolvers.Query, foodResolvers.Query);
}
if (foodResolvers && foodResolvers.Mutation) {
  mergeObjects(resolvers.Mutation, foodResolvers.Mutation);
}

if (mealPlanResolvers && mealPlanResolvers.Query) {
  mergeObjects(resolvers.Query, mealPlanResolvers.Query);
}
if (mealPlanResolvers && mealPlanResolvers.Mutation) {
  mergeObjects(resolvers.Mutation, mealPlanResolvers.Mutation);
}

module.exports = resolvers;