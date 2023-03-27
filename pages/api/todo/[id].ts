import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.id);
  const method = req.method;

  if (isNaN(id)) {
    return res.status(400).json({ message: "Bad Request" });
  }

  switch (method) {
    case "GET":
      const todo = await prisma.todo.findUnique({
        where: {
          id: id,
        },
      });
      return res.json(todo);
    case "PATCH":
      const params = req.body;
      const updatedTodo = await prisma.todo.update({
        where: {
          id: id,
        },
        data: {
          ...params,
        },
      });
      return res.json(updatedTodo);
    case "DELETE":
      const deletedTodo = await prisma.todo.delete({
        where: {
          id: id,
        },
      });
      return res.json(deletedTodo);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
