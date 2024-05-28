export class StringManipulator {
    constructor(public str: string) {}

    static capitalizeFirstLetter(str: string) {
        return str[0].toUpperCase() + str.slice(1);
    }

    static removeTrailingSlash(str: string) {
        if (str === '/') return str;

        const lastChar = str[str.length - 1];

        if (lastChar === '/') {
            return str[0] === '/' ? str.slice(1, -1) : str;
        }

        return str[0] === '/' ? str.slice(1) : str;
    }

    public buildNameByUrlSegment(homePageName: string) {
        if (this.str === '/') {
            if (homePageName) {
                this.str =
                    StringManipulator.capitalizeFirstLetter(homePageName);
            } else {
                this.str = 'Home';
            }
        } else {
            const splitStr = this.str.split('/').shift();

            this.str = StringManipulator.capitalizeFirstLetter(
                splitStr as string
            );
        }

        return this.str;
    }
}
