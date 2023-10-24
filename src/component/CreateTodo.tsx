import { useState } from "react";
import { todoInput } from "~/types";
import { api } from "~/utils/api";

export default function CreateTodo() {
  const [newTodo, setNewTodo] = useState("");

  const trpc = api.useContext();

  const { mutate } = api.todo.create.useMutation({
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  const handleInputChange = (e: any) => {
    setNewTodo(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const result = todoInput.safeParse(newTodo);
    if (!result.success) {
      alert("not valid");
    }
    // alert("handlesubmit called");

    // create todo mutation
    mutate(newTodo);
    setNewTodo("");
  };

  return (
    <>
      {/* {newTodo} */}
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="New Todo..."
          type="text"
          name="new-todo"
          id="new-todo"
          value={newTodo}
          onChange={handleInputChange}
        />
        <button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
          Create
        </button>
      </form>
    </>
  );
}
