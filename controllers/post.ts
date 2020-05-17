import {
  HandlerFunc,
  Context,
} from "https://deno.land/x/abc@v1.0.0-rc2/mod.ts";
import db from "../config/db.ts";

const database = db.getDatabase;
const post = database.collection("post");
interface Post {
  _id: {
    $oid: string;
  };
  title: string;
  content: string;
  author: string;
  date: string;
}

const createPost: HandlerFunc = async (c: Context) => {
  // console.log("test ::: here");
  try {
    const body = await (c.body());
    // console.log(`This is body ${body}`);

    if (!Object.keys(body).length) {
      return c.string("Request body can not be empty!", 400);
    }
    const { title, content, author } = body;

    const today = new Date();
    const d = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" +
      today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" +
      today.getSeconds();
    const date = d + " " + time;
    // const date = Date.now();
    // console.log(`${date} here`);
    const insertedPost = await post.insertOne({
      title,
      content,
      author,
      date,
    });
    // console.log(`${insertedPost}:: post`);
    return c.json(insertedPost, 201);
  } catch (error) {
    return c.json(error, 500);
  }
};

const fetchAllPost: HandlerFunc = async (c: Context) => {
  try {
    const fetchedPosts: Post[] = await post.find();

    if (fetchedPosts) {
      const list = fetchedPosts.length
        ? fetchedPosts.map((p) => {
          const { _id: { $oid }, title, content, author, date } = p;
          return { id: $oid, title, content, author, date };
        })
        : [];
      return c.json(list, 200);
    }
  } catch (error) {
    // console.log(c);
    return c.json(error, 500);
  }
};

const fetchOnePost: HandlerFunc = async (c: Context) => {
  try {
    const { id } = c.params as { id: string };

    const fetchedPost = await post.findOne({ _id: { "$oid": id } });

    if (fetchedPost) {
      const { _id: { $oid }, title, content, author, date } = fetchedPost;

      return c.json({ id: $oid, title, content, author, date }, 200);
    }

    return c.string("Post not found", 404);
  } catch (error) {
    return c.json(error, 500);
  }
};

export { createPost, fetchAllPost, fetchOnePost };
