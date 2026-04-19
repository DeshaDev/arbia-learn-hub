import { reseedExercises } from "./seed";

reseedExercises()
  .then(() => {
    console.log("Reseed complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Reseed failed:", err);
    process.exit(1);
  });
