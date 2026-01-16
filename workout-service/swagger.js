const swaggerAutogen = require("swagger-autogen")(); 
const doc = { 
    info: { 
        title: "Workouts Service API", 
        description: "Swagger documentation", 
    }, 
    host: "localhost:3004", 
    schemes: ["http"], 
    tags: [
        { name: "Exercises", description: "Exercises related endpoints" },
        { name: "Workout Plans", description: "Workout Plans related endpoints" },
        { name: "Workout Sessions", description: "Workout Sessions related endpoints" }
    ], 
    definitions: { // the objects used in the request and response bodies 
        GetExercise: { // GET response bodies come with id 
            id: 1, 
            name: "Example Exercise", 
            description: "This is an example exercise",
            muscleGroup: "Chest"
        },
        CreateExercise: { // POST/PUT request bodies are sent without id 
            name: "Example Exercise", 
            description: "This is an example exercise",
            muscleGroup: "Chest"
        },
        GetWorkoutPlan: { // GET response bodies come with id
            id: 1,
            name: "Example Workout Plan",
            description: "This is an example workout plan",
            exercises: [1, 2, 3]
        },
        CreateWorkoutPlan: { // POST/PUT request bodies are sent without id 
            name: "Example Workout Plan",
            description: "This is an example workout plan",
            exercises: [1, 2, 3]
        },
        GetWorkoutSession: { 
            id: 1,
            workoutPlanId: 1,
            date: "2024-01-01",
            duration: 60 // duration in minutes
        }, 
        CreateReview: { // POST/PUT request bodies are sent without id
            movieId: 2, 
            userId: 3,
            text: "Example Text"
        } 
    } 
}; 
 
const outputFile = "./swagger-output.json"; 
const endpointsFiles = ["./app.js"]; 
 
swaggerAutogen(outputFile, endpointsFiles, doc);