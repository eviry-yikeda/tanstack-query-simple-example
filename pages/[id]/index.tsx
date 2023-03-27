import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { TodoItem } from "../../component/TodoItem";
import { deleteTodo, getTodoItem, updateTodo } from "../../lib/crudTodoList";
import styles from "./Todo.module.css";

export default function Todo() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: _id } = router.query;

  const id = Array.isArray(_id) ? _id[0] : _id;

  const [autoInvalidate, setAutoInvalidate] = useState<boolean>(true);
  const handleAutoInvalidate = () => {
    setAutoInvalidate(!autoInvalidate);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => getTodoItem(id as string),
    refetchOnWindowFocus: false,
    enabled: !!id,
    staleTime: 1000 * 60,
    // cacheTime: Infinity,
  });

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      if (autoInvalidate) {
        queryClient.invalidateQueries({ queryKey: ["todo"] });
      }
    },
  });
  const handleUpdate = (id: number, isCompleted: boolean) => {
    updateMutation.mutate({ id: id, isCompleted: isCompleted });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      if (autoInvalidate) {
        queryClient.invalidateQueries({ queryKey: ["todo"] });
        queryClient.removeQueries({ queryKey: ["todo", id] });
        router.push("/");
      }
    },
  });
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className={styles.container}>
      <h1>TODO ITEM</h1>
      {data && (
        <TodoItem
          todoItem={data}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
      <h2>queryClient methods</h2>
      <div className={styles.flex}>
        <input
          type="checkbox"
          onChange={handleAutoInvalidate}
          checked={autoInvalidate}
        />
        <div>autoInvalidate</div>
      </div>
      <div className={styles.flex}>
        <div>invalidate:</div>
        <button onClick={() => queryClient.invalidateQueries(["todo"])}>
          invalidate all
        </button>
        <button
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ["todo", id],
            })
          }
        >
          invalidate me only
        </button>
      </div>
      <div className={styles.flex}>
        <div>refetch:</div>
        <button onClick={() => queryClient.refetchQueries(["todo"])}>
          refetch all
        </button>
        <button
          onClick={() =>
            queryClient.refetchQueries({
              queryKey: ["todo", id],
            })
          }
        >
          refetch me only
        </button>
      </div>
      <div className={styles.flex}>
        <div>reset:</div>
        <button onClick={() => queryClient.resetQueries(["todo"])}>
          reset all
        </button>
        <button
          onClick={() => queryClient.resetQueries({ queryKey: ["todo", id] })}
        >
          reset me only
        </button>
      </div>
      <div className={styles.flex}>
        <div>remove:</div>
        <button onClick={() => queryClient.removeQueries(["todo"])}>
          remove all
        </button>
        <button
          onClick={() => queryClient.removeQueries({ queryKey: ["todo", id] })}
        >
          remove me only
        </button>
      </div>
      <Link href="/">Back to Top</Link>
    </div>
  );
}
