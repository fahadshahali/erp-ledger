// @ts-nocheck
import { SalesPage } from "@/pages/SalesPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sales/")({ component: SalesPage });
