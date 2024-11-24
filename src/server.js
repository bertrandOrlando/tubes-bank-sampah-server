import { PORT, HOST } from "./config/appConfig.js";
import app from "./app.js";

app.listen(PORT, HOST, () => {
  console.log(`[server]: Server is running at http://${HOST}:${PORT}`);
});
