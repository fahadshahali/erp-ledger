// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSales } from "@/hooks/useBackend";
import { formatCurrency } from "@/lib/currency";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Edit } from "lucide-react";

export function SaleDetailPage() {
  const { id } = useParams({ from: "/sales/$id" as any });
  const { data: sales, isLoading } = useSales();
  const sale = (sales ?? []).find((s) => s.id === id);

  return (
    <div className="p-6 max-w-xl" data-ocid="sale_detail.page">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to={"/sales" as any}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              data-ocid="sale_detail.back_button"
            >
              <ArrowLeft size={14} /> Back
            </Button>
          </Link>
          <h1 className="text-xl font-display font-bold text-foreground">
            Sale Details
          </h1>
        </div>
        {sale && (
          <Link to={"/sales/$id/edit" as any} params={{ id }}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              data-ocid="sale_detail.edit_button"
            >
              <Edit size={14} /> Edit
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <Skeleton key={`skel-${i}`} className="h-12 w-full" />
          ))}
        </div>
      ) : sale ? (
        <div
          className="bg-card border border-border rounded-lg p-6 space-y-4"
          data-ocid="sale_detail.card"
        >
          {[
            { label: "Invoice No", value: sale.invoiceNo, mono: true },
            { label: "Date", value: sale.date, mono: false },
            { label: "Customer", value: sale.customerName, mono: false },
            { label: "Amount", value: formatCurrency(sale.amount), mono: true },
          ].map(({ label, value, mono }) => (
            <div
              key={label}
              className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0"
            >
              <span className="text-sm text-muted-foreground">{label}</span>
              <span
                className={`text-sm font-semibold text-foreground ${mono ? "font-mono" : ""}`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex items-center justify-center py-16"
          data-ocid="sale_detail.error_state"
        >
          <p className="text-sm text-muted-foreground">Sale not found</p>
        </div>
      )}
    </div>
  );
}
