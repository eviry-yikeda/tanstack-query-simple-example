import { Todo } from "@prisma/client";

export const getTodoItems = async (): Promise<Todo[]> => {
  const res = await fetch("api/todo");
  return res.json();
};

export const getTodoItem = async (id: string): Promise<Todo> => {
  const res = await fetch(`api/todo/${id}`);
  return res.json();
};

export const addTodo = async ({
  task,
}: // Prisma.TodoCreateInput
{
  task: string;
}) => {
  const res = await fetch("api/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task,
    }),
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
};

export const updateTodo = async ({
  id,
  isCompleted,
}: // Prisma.TodoUncheckedUpdateInput
{
  id: number;
  isCompleted: boolean;
}) => {
  const res = await fetch(`api/todo/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isCompleted,
    }),
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
};

export const deleteTodo = async (id: number) => {
  const res = await fetch(`api/todo/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
};
