// @ts-nocheck
import { CustomersPage } from "@/pages/CustomersPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/customers/")({
  // @ts-ignore
  component: CustomersPage,
});
