import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddSale, useCustomers } from "@/hooks/useBackend";
import { parseCurrency } from "@/lib/currency";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface FormValues {
  customerId: string;
  date: string;
  amount: string;
}

export function SaleAddPage() {
  const navigate = useNavigate();
  const { data: customers } = useCustomers();
  const { mutateAsync, isPending } = useAddSale();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      customerId: "",
      date: new Date().toISOString().split("T")[0],
      amount: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const customer = (customers ?? []).find((c) => c.id === values.customerId);
    if (!customer) {
      toast.error("Please select a customer");
      return;
    }
    try {
      await mutateAsync({
        customerId: values.customerId,
        customerName: customer.customerName,
        date: values.date,
        amount: parseCurrency(values.amount),
      });
      toast.success("Sale added successfully");
      navigate({ to: "/sales" as any });
    } catch {
      toast.error("Failed to add sale");
    }
  };

  return (
    <div className="p-6 max-w-xl" data-ocid="sale_add.page">
      <div className="flex items-center gap-3 mb-6">
        <Link to={"/sales" as any}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            data-ocid="sale_add.back_button"
          >
            <ArrowLeft size={14} /> Back
          </Button>
        </Link>
        <h1 className="text-xl font-display font-bold text-foreground">
          Add Sale
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card border border-border rounded-lg p-6 space-y-5"
        data-ocid="sale_add.form"
      >
        <div className="space-y-1.5">
          <Label>Customer *</Label>
          <Controller
            name="customerId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger data-ocid="sale_add.customer_select">
                  <SelectValue placeholder="Select customer..." />
                </SelectTrigger>
                <SelectContent>
                  {(customers ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.customerName} — {c.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.customerId && (
            <p
              className="text-xs text-destructive"
              data-ocid="sale_add.customer_field_error"
            >
              Required
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="date">Date *</Label>
          <Input
            type="date"
            id="date"
            {...register("date", { required: true })}
            data-ocid="sale_add.date_input"
          />
          {errors.date && (
            <p
              className="text-xs text-destructive"
              data-ocid="sale_add.date_field_error"
            >
              Required
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount (₹) *</Label>
          <Input
            id="amount"
            {...register("amount", { required: true })}
            placeholder="25000"
            data-ocid="sale_add.amount_input"
          />
          {errors.amount && (
            <p
              className="text-xs text-destructive"
              data-ocid="sale_add.amount_field_error"
            >
              Required
            </p>
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending}
            data-ocid="sale_add.submit_button"
          >
            {isPending ? "Saving..." : "Add Sale"}
          </Button>
          <Link to={"/sales" as any}>
            <Button
              type="button"
              variant="outline"
              data-ocid="sale_add.cancel_button"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
