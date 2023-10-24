import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { todoInput } from "~/types";

export const todoRouter = createTRPCRouter({
  // fetching all todos
  all: protectedProcedure.query(async (opts) => {
    const todos = await opts.ctx.db.todo.findMany({
      where: {
        userId: opts.ctx.session.user.id,
      },
    });

    return todos.map(({ id, text, done }) => ({ id, text, done }));

    // return [
    //   {
    //     id: "fake1",
    //     text: "fake text 1",
    //     done: false,
    //   },
    //   {
    //     id: "fake2",
    //     text: "fake text 2",
    //     done: true,
    //   },
    //   {
    //     id: "fake3",
    //     text: "fake text 3",
    //     done: false,
    //   },
    // ];
  }),

  // create new todos
  create: protectedProcedure.input(todoInput).mutation(async (opts) => {
    return opts.ctx.db.todo.create({
      data: {
        text: opts.input,
        user: {
          connect: {
            id: opts.ctx.session.user.id,
          },
        },
      },
    });
  }),

  // delete todo
  delete: protectedProcedure.input(z.string()).mutation(async (opts) => {
    return opts.ctx.db.todo.delete({
      where: {
        id: opts.input,
      },
    });
  }),

  // toggle todo
  toggle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      }),
    )
    .mutation(async (opts) => {
      return opts.ctx.db.todo.update({
        where: {
          id: opts.input.id,
        },
        data: {
          done: opts.input.done,
        },
      });
    }),
});
