import { serve } from "bun";
import { Database } from "bun:sqlite";

// Initialize SQLite database
const db = new Database("./my.db", { create: true });

const app = serve({
  fetch(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname;
    if (path.startsWith("/user/")) {
      const userId = path.split("/")[2];
      switch (req.method) {
        case "GET": // Read user data
          console.log(userId);
          const userData = db
            .query("SELECT * FROM users WHERE id = $id")
            .all({ $id: Number(userId) });
          console.log(userData);
          return new Response(JSON.stringify(userData));

        case "DELETE": // Delete user data
          db.query("DELETE FROM users WHERE id = $userid").run({
            $userid: userId,
          });
          return { message: "User deleted successfully" };

        default:
          return new Response("Method not allowed", { status: 405 });
      }
    }
    return new Response("Not Found", { status: 404 });
  },
  port: 5000,
});
console.log(`server running at http://localhost:${app.port}`);
