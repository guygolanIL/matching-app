
type ApiResponse<T> = {
    result: T;
};

type ApiMessageResponse = ApiResponse<{
    message: string;
}>;

export function createMessageResponse(message: string): ApiMessageResponse {
    return {
        result: {
            message
        }
    }
}

export function createDataResponse<T extends object>(payload: T): ApiResponse<T> {
    return {
        result: payload
    };
}