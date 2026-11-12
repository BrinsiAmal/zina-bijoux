import { createApp } from "./app.js";

const port = process.env.PORT || 3001;
createApp().listen(port, () => {
  console.log(`Zina Bijoux : http://localhost:${port}`);
  if (!process.env.ADMIN_TOKEN) {
    console.log("ADMIN_TOKEN absent : la page /#admin est désactivée.");
  }
});
