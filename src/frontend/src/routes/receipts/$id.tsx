// @ts-nocheck
import { ReceiptDetailPage } from "@/pages/ReceiptDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/receipts/$id")({
  // @ts-ignore
  component: ReceiptDetailPage,
});
