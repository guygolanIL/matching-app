
type ApiResponse<T> = {
    result: T;
};

export function createApiResponse<T extends object>(payload: T): ApiResponse<T> {
    return {
        result: payload
    };
}