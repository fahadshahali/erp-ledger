import List "mo:core/List";
import Time "mo:core/Time";
import CustomerTypes "types/customer";
import SaleTypes "types/sales";
import ReceiptTypes "types/receipts";
import CustomerLib "lib/customer";
import SalesLib "lib/sales";
import ReceiptsLib "lib/receipts";
import CustomerApi "mixins/customer-api";
import SalesApi "mixins/sales-api";
import ReceiptsApi "mixins/receipts-api";
import DashboardApi "mixins/dashboard-api";

actor Main {
  let customers = List.empty<CustomerTypes.Customer>();
  let sales = List.empty<SaleTypes.Sale>();
  let receipts = List.empty<ReceiptTypes.Receipt>();
  let state = {
    var nextCustomerId : Nat = 0;
    var nextSaleId : Nat = 0;
    var nextReceiptId : Nat = 0;
    var seeded : Bool = false;
  };

  // Seed sample data on first run
  if (not state.seeded) {
    let now = Time.now();
    let seedCustomers = CustomerLib.seedCustomers(now);
    for (c in seedCustomers.values()) {
      customers.add(c);
    };
    state.nextCustomerId := seedCustomers.size();

    let customerIds = seedCustomers.map(func(c) { c.id });
    let customerNames = seedCustomers.map(func(c) { c.customerName });

    let seedSalesArr = SalesLib.seedSales(customerIds, customerNames, now, 0);
    for (s in seedSalesArr.values()) {
      sales.add(s);
    };
    state.nextSaleId := seedSalesArr.size();

    let seedReceiptsArr = ReceiptsLib.seedReceipts(customerIds, customerNames, now, 0);
    for (r in seedReceiptsArr.values()) {
      receipts.add(r);
    };
    state.nextReceiptId := seedReceiptsArr.size();

    state.seeded := true;
  };

  include CustomerApi(customers, sales, receipts, state);
  include SalesApi(sales, state);
  include ReceiptsApi(receipts, state);
  include DashboardApi(customers, sales, receipts);
};

