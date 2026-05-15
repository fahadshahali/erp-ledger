import List "mo:core/List";
import Time "mo:core/Time";
import CustomerLib "../lib/customer";
import CustomerTypes "../types/customer";
import SaleTypes "../types/sales";
import ReceiptTypes "../types/receipts";

mixin (
  customers : List.List<CustomerTypes.Customer>,
  sales : List.List<SaleTypes.Sale>,
  receipts : List.List<ReceiptTypes.Receipt>,
  state : { var nextCustomerId : Nat },
) {
  public query func getAllCustomers() : async [CustomerTypes.Customer] {
    customers.toArray();
  };

  public query func getCustomerById(id : Text) : async ?CustomerTypes.Customer {
    customers.find(func(c) { c.id == id });
  };

  public query func getCustomerSummaries() : async [CustomerTypes.CustomerSummary] {
    customers.map<CustomerTypes.Customer, CustomerTypes.CustomerSummary>(func(c) {
      CustomerLib.toSummary(c, sales, receipts);
    }).toArray();
  };

  public query func getCustomerLedger(customerId : Text) : async ?CustomerTypes.CustomerLedger {
    switch (customers.find(func(c) { c.id == customerId })) {
      case (?customer) ?(CustomerLib.toLedger(customer, sales, receipts));
      case null null;
    };
  };

  public func addCustomer(req : CustomerTypes.AddCustomerRequest) : async CustomerTypes.Customer {
    let id = CustomerLib.newId(state.nextCustomerId);
    let code = CustomerLib.newCustomerCode(state.nextCustomerId);
    let customer = CustomerLib.new(id, code, req, Time.now());
    customers.add(customer);
    state.nextCustomerId += 1;
    customer;
  };

  public func updateCustomer(req : CustomerTypes.UpdateCustomerRequest) : async ?CustomerTypes.Customer {
    switch (customers.findIndex(func(c) { c.id == req.id })) {
      case (?idx) {
        let updated = CustomerLib.update(customers.at(idx), req);
        customers.put(idx, updated);
        ?updated;
      };
      case null null;
    };
  };
};
