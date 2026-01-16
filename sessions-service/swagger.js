import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Sessions Service API",
    description: "Swagger documentation for Sessions microservice"
  },
  host: "localhost:3002",
  schemes: ["http"],
  tags: [
    { name: "Classes", description: "Classes related endpoints" },
    { name: "Instructors", description: "Instructors related endpoints" },
    { name: "Reservation", description: "Reservation related endpoints" }
  ],
  definitions: {
    GetClass: {
      id: "67a1b2c3d4e5f6a7b8c9d0e1",
      user_id: "123",
      workout_id: "456",
      date: "2025-01-10",
      duration: 60,
      notes: "Example session notes"
    },
    CreateClass: {
      user_id: "123",
      workout_id: "456",
      date: "2025-01-10",
      duration: 60,
      notes: "Example session notes"
    },
    GetInstructor: {
        id: 1,
        name: "John Doe",
        specialty: "Yoga"
    },
    CreateInstructor: {
        name: "John Doe",
        specialty: "Yoga"
    },
    GetReservation: {
      id: "89a1b2c3d4e5f6a7b8c9d0e2",
      class_id: "67a1b2c3d4e5f6a7b8c9d0e1",
      user_id: "123",
      reservation_date: "2025-02-15"
    },
    CreateReservation: {
      class_id: "67a1b2c3d4e5f6a7b8c9d0e1",
      user_id: "123",
      reservation_date: "2025-02-15"
    },
  }
};

const outputFile = "./swagger-output.json";

const endpointsFiles = ["./server.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);