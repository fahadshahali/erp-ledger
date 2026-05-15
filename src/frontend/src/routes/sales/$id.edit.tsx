// @ts-nocheck
import { SaleEditPage } from "@/pages/SaleEditPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sales/$id/edit")({
  // @ts-ignore
  component: SaleEditPage,
});
