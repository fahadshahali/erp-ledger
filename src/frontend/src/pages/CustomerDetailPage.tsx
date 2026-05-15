// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerById, useCustomerLedger } from "@/hooks/useBackend";
import { formatCurrency } from "@/lib/currency";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Edit } from "lucide-react";

const SKEL_ROWS = [...Array(4)].map((_, i) => (
  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
  <tr key={`skel-row-${i}`} className="border-b border-border/50">
    {[...Array(5)].map((__, j) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cols
      <td key={`skel-col-${i}-${j}`} className="px-4 py-3">
        <Skeleton className="h-4 w-20" />
      </td>
    ))}
  </tr>
));

export function CustomerDetailPage() {
  const { id } = useParams({ from: "/customers/$id" as any });
  const { data: customer, isLoading: custLoading } = useCustomerById(id);
  const { data: ledger, isLoading: ledgerLoading } = useCustomerLedger(id);

  const isLoading = custLoading || ledgerLoading;

  return (
    <div className="p-6 space-y-6" data-ocid="customer_detail.page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={"/customers" as any}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              data-ocid="customer_detail.back_button"
            >
              <ArrowLeft size={14} /> Back
            </Button>
          </Link>
          <div>
            {isLoading ? (
              <Skeleton className="h-7 w-48" />
            ) : (
              <h1 className="text-xl font-display font-bold text-foreground">
                {customer?.customerName ?? "Customer"}
              </h1>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-32 mt-1" />
            ) : (
              <p className="text-sm text-muted-foreground">
                {customer?.companyName}
              </p>
            )}
          </div>
        </div>
        <Link to={"/customers/$id/edit" as any} params={{ id }}>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            data-ocid="customer_detail.edit_button"
          >
            <Edit size={14} /> Edit
          </Button>
        </Link>
      </div>

      {/* Customer Info */}
      {!isLoading && customer && (
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          data-ocid="customer_detail.info_section"
        >
          {[
            {
              label: "Customer Code",
              value: customer.customerCode,
              mono: true,
            },
            { label: "Mobile", value: customer.mobile, mono: false },
            { label: "GST Number", value: customer.gstNumber, mono: true },
            {
              label: "Opening Balance",
              value: formatCurrency(customer.openingBalance),
              mono: true,
            },
          ].map(({ label, value, mono }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-lg p-4"
            >
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p
                className={`text-sm font-semibold text-foreground ${mono ? "font-mono" : ""}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Monthly Ledger */}
      <div
        className="bg-card border border-border rounded-lg overflow-hidden"
        data-ocid="customer_detail.ledger_section"
      >
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-foreground">
            Monthly Ledger
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {[
                  "Month",
                  "Opening Balance",
                  "Sale",
                  "Receipts",
                  "Closing Balance",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? SKEL_ROWS
                : (ledger?.entries ?? []).map((entry, idx) => (
                    <tr
                      key={entry.month}
                      className="border-b border-border/50 hover:bg-muted/20 transition-smooth"
                      data-ocid={`customer_detail.ledger_item.${idx + 1}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {entry.month}
                      </td>
                      <td className="px-4 py-3 font-mono text-right">
                        {formatCurrency(entry.openingBalance)}
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-accent">
                        {formatCurrency(entry.sales)}
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-secondary">
                        {formatCurrency(entry.receipts)}
                      </td>
                      <td className="px-4 py-3 font-mono text-right font-semibold text-foreground">
                        {formatCurrency(entry.closingBalance)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!isLoading && (ledger?.entries ?? []).length === 0 && (
            <div
              className="flex items-center justify-center py-12"
              data-ocid="customer_detail.ledger_empty_state"
            >
              <p className="text-sm text-muted-foreground">
                No ledger entries yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
