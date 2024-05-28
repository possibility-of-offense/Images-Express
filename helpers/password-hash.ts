import bcrypt from 'bcrypt';

class PasswordHashManager {
    private static initialSaltValue = 10;
    private static salt = PasswordHashManager.initialSaltValue;

    static async hash(plainPassword: string) {
        return await bcrypt.hash(plainPassword, PasswordHashManager.salt);
    }

    static async compare(suppliedPassword: string, storedPassword: string) {
        return await bcrypt.compare(suppliedPassword, storedPassword);
    }

    static getSalt() {
        return PasswordHashManager.salt;
    }

    static changeSaltValue(value: number) {
        PasswordHashManager.salt = value;
    }

    static resetSaltValue() {
        PasswordHashManager.salt = PasswordHashManager.initialSaltValue;
    }
}

export { PasswordHashManager };
