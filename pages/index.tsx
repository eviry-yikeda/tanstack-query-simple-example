import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import styles from "./Home.module.css";
import { Todo } from "@prisma/client";
import {
  addTodo,
  deleteTodo,
  getTodoItems,
  updateTodo,
} from "../lib/crudTodoList";
import { TodoItem } from "../component/TodoItem";

export default function Home() {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    // refetch,
    // isFetching,
    error,
  } = useQuery({
    queryKey: ["todo"],
    queryFn: getTodoItems,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    // cacheTime: Infinity,
    // refetchInterval: 1000 * 60,
    // enabled: false,
  });

  // console.log("isLoading", isLoading);
  // console.log("isFetching", isFetching);

  const [autoInvalidate, setAutoInvalidate] = useState<boolean>(true);
  const handleAutoInvalidate = () => {
    setAutoInvalidate(!autoInvalidate);
  };
  const [task, setTask] = useState<string>("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      setTask("");
      if (autoInvalidate) {
        queryClient.invalidateQueries({ queryKey: ["todo"] });
      }
    },
  });
  const handleAdd = () => {
    addMutation.mutate({ task: task });
  };

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
    onSuccess: (data: Todo) => {
      if (autoInvalidate) {
        queryClient.invalidateQueries({ queryKey: ["todo"] });
        queryClient.removeQueries({ queryKey: ["todo", data.id] });
      }
    },
  });
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={styles.container}>
      <h1>TODO ITEMS</h1>
      {isLoading ? (
        <div className={styles.flex}>
          <div>Loading...</div>
          {/* <button onClick={() => refetch()}>refetch</button> */}
        </div>
      ) : error ? (
        <div>Error</div>
      ) : (
        <>
          <div className={styles.flex}>
            <input
              type="text"
              placeholder="Add a new item"
              value={task}
              onChange={handleChange}
            />
            <button onClick={handleAdd}>Add</button>
          </div>
          <div>
            {data?.map((item) => (
              <TodoItem
                key={item.id}
                todoItem={item}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
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
            queryClient.invalidateQueries({ queryKey: ["todo"], exact: true })
          }
        >
          invalidate todoList only
        </button>
      </div>
      <div className={styles.flex}>
        <div>refetch:</div>
        <button onClick={() => queryClient.refetchQueries(["todo"])}>
          refetch all
        </button>
        <button
          onClick={() =>
            queryClient.refetchQueries({ queryKey: ["todo"], exact: true })
          }
        >
          refetch todoList only
        </button>
      </div>
      <div className={styles.flex}>
        <div>reset:</div>
        <button onClick={() => queryClient.resetQueries(["todo"])}>
          reset all
        </button>
        <button
          onClick={() =>
            queryClient.resetQueries({ queryKey: ["todo"], exact: true })
          }
        >
          reset todoList only
        </button>
      </div>
      <div className={styles.flex}>
        <div>remove:</div>
        <button onClick={() => queryClient.removeQueries(["todo"])}>
          remove all
        </button>
        <button
          onClick={() =>
            queryClient.removeQueries({ queryKey: ["todo"], exact: true })
          }
        >
          remove todoList only
        </button>
      </div>
    </div>
  );
}
