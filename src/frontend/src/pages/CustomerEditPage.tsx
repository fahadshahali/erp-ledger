// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCustomerById, useUpdateCustomer } from "@/hooks/useBackend";
import { parseCurrency } from "@/lib/currency";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface FormValues {
  companyName: string;
  customerName: string;
  mobile: string;
  gstNumber: string;
  address: string;
  openingBalance: string;
}

export function CustomerEditPage() {
  const { id } = useParams({ from: "/customers/$id/edit" as any });
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomerById(id);
  const { mutateAsync, isPending } = useUpdateCustomer();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (customer) {
      reset({
        companyName: customer.companyName,
        customerName: customer.customerName,
        mobile: customer.mobile,
        gstNumber: customer.gstNumber,
        address: customer.address,
        openingBalance: customer.openingBalance.toString(),
      });
    }
  }, [customer, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      await mutateAsync({
        id,
        companyName: values.companyName,
        customerName: values.customerName,
        mobile: values.mobile,
        gstNumber: values.gstNumber,
        address: values.address,
        openingBalance: parseCurrency(values.openingBalance),
      });
      toast.success("Customer updated successfully");
      navigate({ to: "/customers/$id" as any, params: { id } });
    } catch {
      toast.error("Failed to update customer");
    }
  };

  return (
    <div className="p-6 max-w-2xl" data-ocid="customer_edit.page">
      <div className="flex items-center gap-3 mb-6">
        <Link to={"/customers/$id" as any} params={{ id }}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            data-ocid="customer_edit.back_button"
          >
            <ArrowLeft size={14} /> Back
          </Button>
        </Link>
        <h1 className="text-xl font-display font-bold text-foreground">
          Edit Customer
        </h1>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <Skeleton key={`skel-${i}`} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card border border-border rounded-lg p-6 space-y-5"
          data-ocid="customer_edit.form"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                {...register("companyName", { required: true })}
                data-ocid="customer_edit.company_name_input"
              />
              {errors.companyName && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="customer_edit.company_name_field_error"
                >
                  Required
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                {...register("customerName", { required: true })}
                data-ocid="customer_edit.customer_name_input"
              />
              {errors.customerName && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="customer_edit.customer_name_field_error"
                >
                  Required
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                {...register("mobile", { required: true })}
                data-ocid="customer_edit.mobile_input"
              />
              {errors.mobile && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="customer_edit.mobile_field_error"
                >
                  Required
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                {...register("gstNumber")}
                data-ocid="customer_edit.gst_input"
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...register("address")}
                rows={2}
                data-ocid="customer_edit.address_textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="openingBalance">Opening Balance (₹)</Label>
              <Input
                id="openingBalance"
                {...register("openingBalance")}
                data-ocid="customer_edit.opening_balance_input"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="customer_edit.submit_button"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Link to={"/customers/$id" as any} params={{ id }}>
              <Button
                type="button"
                variant="outline"
                data-ocid="customer_edit.cancel_button"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
