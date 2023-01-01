import * as bcrypt from 'bcrypt';
export async function hashPassword(candidatePassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(candidatePassword, salt);
    return hashedPassword
}

export function removeKeys(keys: string[], object: any) {

    const clone = Object.create(object)
    keys.forEach(key => {
        delete clone[key];
    });
    return clone
}