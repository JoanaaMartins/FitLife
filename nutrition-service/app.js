require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

const authMiddleware = ({ req }) => {
  console.log('Requisição GraphQL...');
  console.log('Authorization header:', req.headers.authorization);
  
  let user = null;
  const authHeader = req.headers.authorization || '';

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token válido para:', decoded.email);
      
      user = {
        id: decoded.id || decoded._id,
        email: decoded.email,
        role: decoded.role
      };
      
      console.log(`User autenticado: ${user.email} (${user.role})`);
    } catch (error) {
      console.log('Token inválido:', error.message);
    }
  } else {
    console.log('Sem token ou formato inválido');
  }

  console.log('User:', user ? 'SIM' : 'NÃO');
  return { user };
};

async function startServer() {
  try {
    await mongoose.connect('mongodb://localhost:27017/nutritiondb', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectado');

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: authMiddleware,
      formatError: (error) => {
        console.error('GraphQL Error:', error.message);
        return { 
          message: error.message,
          code: 'INTERNAL_SERVER_ERROR'
        };
      },
      debug: true,
      introspection: true,
      playground: true
    });

    const { url } = await server.listen({ port: 4000 });
    console.log(` Servidor GraphQL: ${url}`);
    
  } catch (error) {
    console.error('Erro ao iniciar:', error);
    process.exit(1);
  }
}

startServer();