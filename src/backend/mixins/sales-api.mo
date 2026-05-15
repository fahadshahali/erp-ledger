import List "mo:core/List";
import Time "mo:core/Time";
import SalesLib "../lib/sales";
import SaleTypes "../types/sales";

mixin (
  sales : List.List<SaleTypes.Sale>,
  state : { var nextSaleId : Nat },
) {
  public query func getAllSales() : async [SaleTypes.Sale] {
    sales.toArray();
  };

  public query func getSalesByCustomer(customerId : Text) : async [SaleTypes.Sale] {
    SalesLib.byCustomer(sales, customerId);
  };

  public func addSale(req : SaleTypes.AddSaleRequest) : async SaleTypes.Sale {
    let id = SalesLib.newId(state.nextSaleId);
    let invoiceNo = SalesLib.newInvoiceNo(state.nextSaleId);
    let sale = SalesLib.new(id, invoiceNo, req, Time.now());
    sales.add(sale);
    state.nextSaleId += 1;
    sale;
  };

  public func updateSale(req : SaleTypes.UpdateSaleRequest) : async ?SaleTypes.Sale {
    switch (sales.findIndex(func(s) { s.id == req.id })) {
      case (?idx) {
        let updated = SalesLib.update(sales.at(idx), req);
        sales.put(idx, updated);
        ?updated;
      };
      case null null;
    };
  };
};
