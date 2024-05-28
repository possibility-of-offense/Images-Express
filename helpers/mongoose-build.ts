import mongoose, { Model } from 'mongoose';

interface IModel<T, Doc> extends mongoose.Model<T> {
    build(attrs: T): Doc;
}
interface IDoc extends mongoose.Document {}

class DecorateModel<
    A extends { [key: string]: any },
    S extends mongoose.Schema,
    D extends mongoose.Document,
    M extends typeof Model
> {
    model!: M;

    constructor(collectionName: string, schema: S) {
        this.decorate(schema);
        this.model = mongoose.model<D, M>(collectionName, schema);
    }

    decorate(schema: S) {
        schema.statics.build = (attrs: A) => {
            return new this.model(attrs);
        };
    }

    getModel() {
        return this.model;
    }
}

async function saveDoc<T extends mongoose.Document>(inst: T) {
    if (inst) {
        await inst.save();
    }

    return inst;
}

export { DecorateModel, IModel, IDoc, saveDoc };
