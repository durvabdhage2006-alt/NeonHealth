import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  projectId: "ai-attendance-2f654",
  databaseURL: "https://ai-attendance-2f654-default-rtdb.firebaseio.com",
  // Note: To write data or authenticate, you will need to add the apiKey, appId, etc. here.
  // The system can read public data if database rules are open.
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
