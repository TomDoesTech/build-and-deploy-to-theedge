import { extractBody } from "@/utils/extractBody";
import { NextFetchEvent, NextRequest } from "next/server";
import zod, { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import sqlstring from "sqlstring";
import { Pool } from "@neondatabase/serverless";

export const config = {
  runtime: "edge",
};

const createCommentSchema = zod.object({
  page: z.string().max(64).min(1),
  comment: zod.string().max(256),
});

async function createCommentHandler(req: NextRequest, event: NextFetchEvent) {
  const body = await extractBody(req);

  const { comment, page } = createCommentSchema.parse(body);

  const id = uuidv4();

  const createCommentQuery = sqlstring.format(
    `INSERT INTO comment (id, page, comment)
    values(?, ?, ?)`,
    [id, page, comment]
  );

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.query(createCommentQuery);

    return new Response(JSON.stringify({ id }));
  } catch (e) {
    console.error(e);
    return new Response("Page not found", {
      status: 404,
    });
  } finally {
    event.waitUntil(pool.end());
  }
}

async function readCommentsHandler(req: NextRequest, event: NextFetchEvent) {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page");

  if (!page) {
    return new Response("page not found", {
      status: 404,
    });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getCommentsQuery = sqlstring.format(
    `SELECT id, comment, created_at
  FROM comment
  WHERE page = ?
  ORDER BY created_at DESC;`,
    [page]
  );

  console.log("getCommentsQuery", getCommentsQuery);

  try {
    const { rows: commentRows } = await pool.query(getCommentsQuery);

    return new Response(JSON.stringify(commentRows));
  } catch (e) {
    console.error(e);
    return new Response("page not found", {
      status: 404,
    });
  } finally {
    event.waitUntil(pool.end());
  }
}

async function handler(req: NextRequest, event: NextFetchEvent) {
  if (req.method === "POST") {
    return createCommentHandler(req, event);
  }

  if (req.method === "GET") {
    return readCommentsHandler(req, event);
  }

  return new Response("Invalid method", {
    status: 405,
  });
}

export default handler;
