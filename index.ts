import { Application } from "https://deno.land/x/abc@v1.0.0-rc2/mod.ts";
import "https://deno.land/x/denv/mod.ts";
import {
  fetchAllPost,
  createPost,
  fetchOnePost,
} from "./controllers/post.ts";
const app = new Application();

app.get("/post", fetchAllPost)
  .post("/post", createPost)
  .get("/post/:id", fetchOnePost)
  .start({ port: 5000 });

console.log(`server is on http://localhost:5000 `);
