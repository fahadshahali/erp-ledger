// @ts-nocheck
import { CustomerAddPage } from "@/pages/CustomerAddPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/customers/add")({
  // @ts-ignore
  component: CustomerAddPage,
});
