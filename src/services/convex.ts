import { ConvexReactClient } from "convex/react";

// Hard-coded Convex URL to avoid reliance on Vite env vars
const convex = new ConvexReactClient(
  "https://acrobatic-butterfly-784.convex.cloud"
);

export default convex;
