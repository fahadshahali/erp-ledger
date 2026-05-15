// @ts-nocheck
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useReceipts } from "@/hooks/useBackend";
import { formatCurrency } from "@/lib/currency";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Edit } from "lucide-react";

export function ReceiptDetailPage() {
  const { id } = useParams({ from: "/receipts/$id" as any });
  const { data: receipts, isLoading } = useReceipts();
  const receipt = (receipts ?? []).find((r) => r.id === id);

  return (
    <div className="p-6 max-w-xl" data-ocid="receipt_detail.page">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to={"/receipts" as any}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              data-ocid="receipt_detail.back_button"
            >
              <ArrowLeft size={14} /> Back
            </Button>
          </Link>
          <h1 className="text-xl font-display font-bold text-foreground">
            Receipt Details
          </h1>
        </div>
        {receipt && (
          <Link to={"/receipts/$id/edit" as any} params={{ id }}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              data-ocid="receipt_detail.edit_button"
            >
              <Edit size={14} /> Edit
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <Skeleton key={`skel-${i}`} className="h-12 w-full" />
          ))}
        </div>
      ) : receipt ? (
        <div
          className="bg-card border border-border rounded-lg p-6 space-y-4"
          data-ocid="receipt_detail.card"
        >
          {[
            { label: "Receipt No", value: receipt.receiptNo, mono: true },
            { label: "Date", value: receipt.date, mono: false },
            { label: "Customer", value: receipt.customerName, mono: false },
            {
              label: "Amount",
              value: formatCurrency(receipt.amount),
              mono: true,
            },
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
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Payment Mode</span>
            <Badge variant="outline" className="capitalize">
              {receipt.paymentMode}
            </Badge>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center justify-center py-16"
          data-ocid="receipt_detail.error_state"
        >
          <p className="text-sm text-muted-foreground">Receipt not found</p>
        </div>
      )}
    </div>
  );
}
