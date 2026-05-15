// @ts-nocheck
import { CustomerEditPage } from "@/pages/CustomerEditPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/customers/$id/edit")({
  // @ts-ignore
  component: CustomerEditPage,
});
