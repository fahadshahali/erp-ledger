// @ts-nocheck
import { SaleAddPage } from "@/pages/SaleAddPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sales/add")({ component: SaleAddPage });
