// @ts-nocheck
import { ReceiptsPage } from "@/pages/ReceiptsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/receipts/")({ component: ReceiptsPage });
