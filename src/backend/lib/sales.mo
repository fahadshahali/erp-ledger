import List "mo:core/List";
import SaleTypes "../types/sales";

module {
  public type Sale = SaleTypes.Sale;
  public type AddSaleRequest = SaleTypes.AddSaleRequest;
  public type UpdateSaleRequest = SaleTypes.UpdateSaleRequest;

  func zeroPad3(n : Nat) : Text {
    let s = n.toText();
    if (n < 10) "00" # s
    else if (n < 100) "0" # s
    else s;
  };

  func monthKey(date : Text) : Text {
    let parts = date.split(#char '-');
    var year = "";
    var month = "";
    var idx = 0;
    for (p in parts) {
      if (idx == 0) year := p;
      if (idx == 1) month := p;
      idx += 1;
    };
    year # "-" # month;
  };

  public func newId(counter : Nat) : Text {
    "sale-" # counter.toText();
  };

  public func newInvoiceNo(counter : Nat) : Text {
    "INV" # zeroPad3(counter + 1);
  };

  public func new(
    id : Text,
    invoiceNo : Text,
    req : AddSaleRequest,
    now : Int,
  ) : Sale {
    {
      id;
      invoiceNo;
      date = req.date;
      customerId = req.customerId;
      customerName = req.customerName;
      amount = req.amount;
      createdAt = now;
    };
  };

  public func update(existing : Sale, req : UpdateSaleRequest) : Sale {
    {
      existing with
      date = req.date;
      customerId = req.customerId;
      customerName = req.customerName;
      amount = req.amount;
    };
  };

  public func byCustomer(
    sales : List.List<Sale>,
    customerId : Text,
  ) : [Sale] {
    sales.filter(func(s) { s.customerId == customerId }).toArray();
  };

  public func totalForCustomer(
    sales : List.List<Sale>,
    customerId : Text,
  ) : Nat {
    sales.foldLeft<Nat, Sale>(0, func(acc, s) {
      if (s.customerId == customerId) acc + s.amount else acc;
    });
  };

  public func totalForMonth(
    sales : List.List<Sale>,
    customerId : Text,
    month : Text,
  ) : Nat {
    sales.foldLeft<Nat, Sale>(0, func(acc, s) {
      if (s.customerId == customerId and monthKey(s.date) == month) acc + s.amount
      else acc;
    });
  };

  public func seedSales(
    customerIds : [Text],
    customerNames : [Text],
    now : Int,
    startCounter : Nat,
  ) : [Sale] {
    // CUS001: INV001-INV004 total=120000, CUS002: INV005-INV008 total=75000
    let custIdxs = [0, 0, 0, 0, 1, 1, 1, 1];
    let dates = [
      "2026-01-15", "2026-02-10", "2026-03-12", "2026-04-08",
      "2026-01-20", "2026-02-15", "2026-03-18", "2026-04-22",
    ];
    let amounts = [20000, 30000, 40000, 30000, 15000, 20000, 25000, 15000];
    let result = List.empty<Sale>();
    var i = 0;
    while (i < 8) {
      let ci = custIdxs[i];
      result.add(
        new(
          newId(startCounter + i),
          newInvoiceNo(startCounter + i),
          {
            date = dates[i];
            customerId = customerIds[ci];
            customerName = customerNames[ci];
            amount = amounts[i];
          },
          now,
        )
      );
      i += 1;
    };
    result.toArray();
  };
};
