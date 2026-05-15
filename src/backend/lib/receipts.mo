import List "mo:core/List";
import ReceiptTypes "../types/receipts";

module {
  public type Receipt = ReceiptTypes.Receipt;
  public type AddReceiptRequest = ReceiptTypes.AddReceiptRequest;
  public type UpdateReceiptRequest = ReceiptTypes.UpdateReceiptRequest;

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
    "rec-" # counter.toText();
  };

  public func newReceiptNo(counter : Nat) : Text {
    "REC" # zeroPad3(counter + 1);
  };

  public func new(
    id : Text,
    receiptNo : Text,
    req : AddReceiptRequest,
    now : Int,
  ) : Receipt {
    {
      id;
      receiptNo;
      date = req.date;
      customerId = req.customerId;
      customerName = req.customerName;
      amount = req.amount;
      paymentMode = req.paymentMode;
      createdAt = now;
    };
  };

  public func update(existing : Receipt, req : UpdateReceiptRequest) : Receipt {
    {
      existing with
      date = req.date;
      customerId = req.customerId;
      customerName = req.customerName;
      amount = req.amount;
      paymentMode = req.paymentMode;
    };
  };

  public func byCustomer(
    receipts : List.List<Receipt>,
    customerId : Text,
  ) : [Receipt] {
    receipts.filter(func(r) { r.customerId == customerId }).toArray();
  };

  public func totalForCustomer(
    receipts : List.List<Receipt>,
    customerId : Text,
  ) : Nat {
    receipts.foldLeft<Nat, Receipt>(0, func(acc, r) {
      if (r.customerId == customerId) acc + r.amount else acc;
    });
  };

  public func totalForMonth(
    receipts : List.List<Receipt>,
    customerId : Text,
    month : Text,
  ) : Nat {
    receipts.foldLeft<Nat, Receipt>(0, func(acc, r) {
      if (r.customerId == customerId and monthKey(r.date) == month) acc + r.amount
      else acc;
    });
  };

  public func currentMonthTotal(
    receipts : List.List<Receipt>,
    currentMonth : Text,
  ) : Nat {
    receipts.foldLeft<Nat, Receipt>(0, func(acc, r) {
      if (monthKey(r.date) == currentMonth) acc + r.amount else acc;
    });
  };

  public func seedReceipts(
    customerIds : [Text],
    customerNames : [Text],
    now : Int,
    startCounter : Nat,
  ) : [Receipt] {
    // CUS001: REC001-REC004 total=90000, CUS002: REC005-REC008 total=60000
    let custIdxs = [0, 0, 0, 0, 1, 1, 1, 1];
    let dates = [
      "2026-01-25", "2026-02-20", "2026-03-22", "2026-04-18",
      "2026-01-28", "2026-02-24", "2026-03-26", "2026-04-25",
    ];
    let amounts = [10000, 25000, 30000, 25000, 8000, 17000, 20000, 15000];
    let modes = ["Bank", "Cash", "NEFT", "Cheque", "Bank", "UPI", "RTGS", "Cheque"];
    let result = List.empty<Receipt>();
    var i = 0;
    while (i < 8) {
      let ci = custIdxs[i];
      result.add(
        new(
          newId(startCounter + i),
          newReceiptNo(startCounter + i),
          {
            date = dates[i];
            customerId = customerIds[ci];
            customerName = customerNames[ci];
            amount = amounts[i];
            paymentMode = modes[i];
          },
          now,
        )
      );
      i += 1;
    };
    result.toArray();
  };
};
