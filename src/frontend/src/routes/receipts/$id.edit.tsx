// @ts-nocheck
import { ReceiptEditPage } from "@/pages/ReceiptEditPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/receipts/$id/edit")({
  // @ts-ignore
  component: ReceiptEditPage,
});
