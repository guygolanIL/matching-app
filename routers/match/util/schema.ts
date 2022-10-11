import { z } from "zod";

export function createMatchRequestSchema(body?: z.AnyZodObject) {
    const schema = z.object({
        params: z.object({
            matchId: z.preprocess(
                (id) => parseInt(z.string().parse(id)),
                z.number()
            ),
        }),
    });

    if (body) {
        return schema.merge(z.object({
            body,
        }));
    }

    return schema;
}