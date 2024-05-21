export class CustomError extends Error {
    status: number | undefined;
    message!: string;
}

export const createError = (status: number, message: string) => {
    const err = new CustomError();

    err.status = status;
    err.message = message;

    return err;
}