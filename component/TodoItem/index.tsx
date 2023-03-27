import Link from "next/link";
import { Todo } from "@prisma/client";
import styles from "./TodoItem.module.css";

type Props = {
  todoItem: Todo;
  onUpdate?: (id: number, isCompleted: boolean) => void;
  onDelete?: (id: number) => void;
};
export const TodoItem = ({ todoItem, onUpdate, onDelete }: Props) => {
  return (
    <div className={styles.flex}>
      <input
        type="checkbox"
        checked={todoItem.isCompleted}
        readOnly
        onClick={() => {
          if (onUpdate === undefined) return;
          onUpdate(todoItem.id, !todoItem.isCompleted);
        }}
      />
      <Link href={`/${todoItem.id}`}>{todoItem.task}</Link>
      <button
        onClick={() => {
          if (onDelete === undefined) return;
          onDelete(todoItem.id);
        }}
      >
        Del
      </button>
    </div>
  );
};
