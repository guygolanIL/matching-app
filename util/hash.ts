import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, userPassword: string) {
    return await bcrypt.compare(password, userPassword);
}