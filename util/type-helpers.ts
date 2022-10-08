export namespace TypeHelpers {
    export type ExtractPromise<T> = T extends Promise<infer Payload> ? Payload : never;
}