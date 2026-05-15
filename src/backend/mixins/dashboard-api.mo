import List "mo:core/List";
import Time "mo:core/Time";
import CustomerLib "../lib/customer";
import ReceiptsLib "../lib/receipts";
import CustomerTypes "../types/customer";
import SaleTypes "../types/sales";
import ReceiptTypes "../types/receipts";
import DashboardTypes "../types/dashboard";

mixin (
  customers : List.List<CustomerTypes.Customer>,
  sales : List.List<SaleTypes.Sale>,
  receipts : List.List<ReceiptTypes.Receipt>,
) {
  public query func getDashboardStats() : async DashboardTypes.DashboardStats {
    let totalCustomers = customers.size();

    let totalSales = sales.foldLeft(0, func(acc, s) { acc + s.amount });
    let totalReceiptsAmt = receipts.foldLeft(0, func(acc, r) { acc + r.amount });

    // totalOutstanding = sum of all closing balances
    let totalOutstanding = customers.foldLeft<Int, CustomerTypes.Customer>(0, func(acc, c) {
      let summary = CustomerLib.toSummary(c, sales, receipts);
      acc + summary.closingBalance;
    });

    // currentMonth as "YYYY-MM" derived from Time.now() nanoseconds
    // We use a fixed approach: extract from Time.now() in nanos
    // 1 second = 1_000_000_000 ns; derive approximate year/month
    let nowNs : Int = Time.now();
    // nanos since epoch to seconds
    let nowSec : Int = nowNs / 1_000_000_000;
    // Days since epoch
    let days : Int = nowSec / 86400;
    // Approximate year (365.25 days/year)
    let approxYear : Int = 1970 + days / 365;
    // Approximate month within year
    let dayOfYear : Int = days - (approxYear - 1970) * 365;
    let approxMonth : Int = dayOfYear / 30 + 1;
    let safeMonth : Int = if (approxMonth < 1) 1 else if (approxMonth > 12) 12 else approxMonth;
    let monthStr = if (safeMonth < 10) "0" # safeMonth.toText() else safeMonth.toText();
    let currentMonthKey = approxYear.toText() # "-" # monthStr;

    let monthlyCollection = ReceiptsLib.currentMonthTotal(receipts, currentMonthKey);

    // pendingPayments = count of customers with closing balance > 0
    let pendingPayments = customers.foldLeft(0, func(acc, c) {
      let summary = CustomerLib.toSummary(c, sales, receipts);
      if (summary.closingBalance > 0) acc + 1 else acc;
    });

    {
      totalCustomers;
      totalSales;
      totalReceipts = totalReceiptsAmt;
      totalOutstanding;
      monthlyCollection;
      pendingPayments;
    };
  };
};
