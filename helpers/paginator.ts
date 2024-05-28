import mongoose from 'mongoose';

export class Paginator {
    private skip: number;
    private limit: number;
    private isNext: boolean = false;
    private isPrevious: boolean = false;
    private query: number;
    private model: typeof mongoose.Model;

    constructor(skip: number, query: number, model: typeof mongoose.Model) {
        this.skip = skip;
        this.limit = skip;
        this.query = query;
        this.model = model;
    }

    private async countDocs(model: typeof mongoose.Model, filter?: {}) {
        return await model.countDocuments(filter);
    }

    /**
     *
     * @param isAdmin boolean - if the admin is requesting paginated users,
     * decrement the countDocuments() result because we do not want to see the admin
     * in the users list
     * @returns
     */
    public async buildPagination(isAdmin: boolean = false, filter?: {}) {
        let count = await this.countDocs(this.model, filter);
        if (isAdmin) {
            count--;
        }

        if (this.skip + this.query < count) {
            this.isNext = true;
        }

        if (this.skip > 0) {
            this.isPrevious = true;
        }

        let previousSkip = this.skip > 0 && this.skip - this.query;
        let nextSkip = this.skip + this.query < count && this.skip + this.query;

        return {
            isPrevious: this.isPrevious,
            isNext: this.isNext,
            previousSkip,
            nextSkip,
        };
    }
}
