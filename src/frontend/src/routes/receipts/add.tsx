// @ts-nocheck
import { ReceiptAddPage } from "@/pages/ReceiptAddPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/receipts/add")({
  // @ts-ignore
  component: ReceiptAddPage,
});
