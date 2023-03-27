// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  switch (method) {
    case "GET":
      const todos = await prisma.todo.findMany();
      return res.json(todos);
    case "POST":
      const params = req.body;
      const newTodo = await prisma.todo.create({
        data: {
          ...params,
          isCompleted: false,
        },
      });
      return res.json(newTodo);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
