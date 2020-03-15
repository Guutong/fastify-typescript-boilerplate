import { Document, Schema, Model, model } from "mongoose";

export interface CustomerDocument extends Document {
  age: number;
  name: string;
  createdDate: Date;
}

export interface CustomerModel extends CustomerDocument {}

export const CustomerSchema: Schema = new Schema(
  {
    age: Number,
    name: String,
    createdDate: Date
  },
  { collection: "customers" }
);

CustomerSchema.pre<CustomerDocument>("save", async function() {
  this.createdDate = new Date();
});

export const Customer: Model<CustomerModel> = model<CustomerModel>(
  "Customer",
  CustomerSchema
);
