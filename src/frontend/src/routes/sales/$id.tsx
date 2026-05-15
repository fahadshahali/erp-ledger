// @ts-nocheck
import { SaleDetailPage } from "@/pages/SaleDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sales/$id")({
  // @ts-ignore
  component: SaleDetailPage,
});
