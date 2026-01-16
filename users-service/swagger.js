import swaggerAutogen from "swagger-autogen";
// import { loginUser } from "./controllers/userController.js";

const doc = {
  info: {
    title: "Users Service API",
    description: "Swagger documentation for Users microservice"
  },
  host: "localhost:3002",
  schemes: ["http"],
  tags: [
    { name: "Users", description: "Users related endpoints" },
    { name: "Goals", description: "Goals related endpoints" },
    { name: "Measurements", description: "Measurements related endpoints" }
  ],
  definitions: {
    GetUser: {
      id: 1,
      name: "Example Name",
      email: "example@mail.com",
      role: "user"
    },
    CreateUser: {
      name: "Example Name",
      email: "example@mail.com",
      password: "mypassword123",
      gender: "female",
      birth_date: "1999-05-10",
      role: "user"
    },
    LoginUser: {
      email: "example@mail.com",
      password: "mypassword123"
    },
    GetGoal: {
      id: 1,
      user_id: 1,
        type: "weight_loss",
        target_value: 65,
        unit: "kg",
        target_date: "2024-12-31",
        status: "in_progress"
    },
    CreateGoal: {
        type: "weight_loss",
        target_value: 65,
        unit: "kg",
        target_date: "2024-12-31",
        status: "in_progress"
    },
    GetMeasurement: {
      id: 1,
      user_id: 1,
        date: "2024-06-01",
        weight_kg: 70,
        height_cm: 175,
        body_fat_pct: 15.5
    },
    CreateMeasurement: {
        date: "2024-06-01",
        weight_kg: 70,
        height_cm: 175,
        body_fat_pct: 15.5
    }
  }
};

const outputFile = "./swagger-output.json";

const endpointsFiles = ["./server.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);