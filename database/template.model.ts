import { Schema, model, models } from "mongoose";

export type IModel = object;

const ModelSchema = new Schema<IModel>({}, { timestamps: true });

const Model = models?.Model || model<IModel>("Model", ModelSchema);

export default Model;
