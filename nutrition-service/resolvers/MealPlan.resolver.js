const MealPlan = require('../models/MealPlan');

module.exports = {
  Query: {
    myMealPlans: async (_, __, context) => {
      if (!context.user) throw new Error('Não autenticado');
      return await MealPlan.find({ user_ids: context.user.id }).sort({ start_date: -1 });
    },
    
    allMealPlans: async (_, __, context) => {
      if (!context.user) throw new Error('Não autenticado');
      if (context.user.role !== 'instructor') {
        throw new Error('Apenas instrutores podem ver todos os planos');
      }
      return await MealPlan.find({}).sort({ createdAt: -1 });
    },
    
    mealPlan: async (_, { plan_id }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      const mealPlan = await MealPlan.findById(plan_id);
      if (!mealPlan) throw new Error('Plano não encontrado');
      
      if (context.user.role !== 'instructor') {
        const hasAccess = mealPlan.user_ids.some(
          id => id.toString() === context.user.id
        );
        if (!hasAccess) throw new Error('Acesso negado');
      }
      return mealPlan;
    }
  },
  
  Mutation: {
    createMealPlan: async (_, { input }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      if (context.user.role !== 'instructor') {
        throw new Error('Apenas instrutores podem criar planos');
      }
      
      console.log('Criando MealPlan com input:', input);
      
      const mealPlan = new MealPlan(input);
      await mealPlan.save();
      return mealPlan;
    },

    deleteMealPlan: async (_, { plan_id }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      if (context.user.role !== 'instructor') {
        throw new Error('Apenas instrutores podem apagar planos');
      }
      const mealPlan = await MealPlan.findByIdAndDelete(plan_id);
      if (!mealPlan) throw new Error('Plano não encontrado');
      return { success: true, message: 'Plano apagado com sucesso' };
    }, 

    updateMealPlan: async (_, { plan_id, input }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      if (context.user.role !== 'instructor') {
        throw new Error('Apenas instrutores podem atualizar planos');
      }
      const mealPlan = await MealPlan.findByIdAndUpdate(plan_id, input, { new: true });
      if (!mealPlan) throw new Error('Plano não encontrado');
      return mealPlan; 
    }
  }
};