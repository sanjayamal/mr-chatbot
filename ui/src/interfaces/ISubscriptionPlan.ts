export interface ISubscriptionPlan {
  name: string;
  mode: "month" | "year";
  price: number;
  features: Array<string>;
}
