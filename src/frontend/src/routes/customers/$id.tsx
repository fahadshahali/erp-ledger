// @ts-nocheck
import { CustomerDetailPage } from "@/pages/CustomerDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/customers/$id")({
  // @ts-ignore
  component: CustomerDetailPage,
});
