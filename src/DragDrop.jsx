import React, { useEffect, useState } from "react";
import Select from 'react-select';

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    quantity: 1,
    rate: 0,
    tax: 0,
    discount_amount  : 0,
    after_discount : 0 ,
  });
  
  const [itemDicount, setItemDicount] = useState({
    tax_discount_type : {value : 'no_discount', label : 'No Discount'},
    discount_type : {value : 'percentage', label : '%'},
    discount_value : 0,
  })

  const discountOptions = [
    { value: 'no_discount', label: 'No Discount' },
    { value: 'befor_tax', label: 'Befor Tax' },
    { value: 'after_tax', label: 'After Tax' },
  ];

  const amountDiscountOptions = [
    { value: 'percentage', label: '%' },
    { value: 'fixed', label: 'Fixed' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    const { quantity, rate, tax } = newItem;

    const amount = Number(quantity) * Number(rate);
    const taxAmount = (amount * Number(tax)) / 100;
    const subTotal = amount + taxAmount

    setItems((prev) => [...prev, { ...newItem, amount, taxAmount, subTotal }]);
    setNewItem({ name: "", description: "", quantity: 1, rate: 0, tax: 0 });
  };

  const updateItem = (index, field, value) => {

    const updatedItemss = items.map((up, i) => {
      if (i === index) {
        return {
         ...up,
          [field]: value,
        };
      }
      return up;
    })

    const updatenewItem = updatedItemss.map((cc) =>{
      if (itemDicount.tax_discount_type.value == 'befor_tax') {
        if (itemDicount.discount_type.value == 'percentage') {
          const amount = Number(Number(cc.quantity) * Number(cc.rate));
          const discount_amount = Number(itemDicount.discount_value) * 0.01 * amount
          const taxAmount = Number(amount- discount_amount)  * Number(cc.tax) * 0.01;
          const subTotal = Number(amount- discount_amount) + taxAmount;
           return {...cc, amount, taxAmount, subTotal, discount_amount}
        }else{
          const amount = (Number(cc.quantity) * Number(cc.rate))
          const discount_amount = Number(itemDicount.discount_value)/ items.length ;
          const taxAmount = Number(amount- discount_amount) * Number(cc.tax) * 0.01;
          const subTotal = Number(amount) + taxAmount - discount_amount;
          return {...cc, amount, taxAmount, subTotal, discount_amount}
        }
        
       }else if (itemDicount.tax_discount_type.value == 'after_tax') {
        if (itemDicount.discount_type.value == 'percentage') {
          const amount = Number(Number(cc.quantity) * Number(cc.rate));
          const taxAmount = Number(amount)  * Number(cc.tax) * 0.01;
          const discount_amount = Number(itemDicount.discount_value) * 0.01 * (amount + taxAmount)
          const subTotal = amount + taxAmount - discount_amount;
           return {...cc, amount, taxAmount, subTotal, discount_amount}
        }else{
          const amount = (Number(cc.quantity) * Number(cc.rate))
          const taxAmount = Number(amount) * Number(cc.tax) * 0.01;
          const discount_amount = Number(itemDicount.discount_value)/ items.length ;
          const subTotal = amount + taxAmount -discount_amount;
          return {...cc, amount, taxAmount, subTotal, discount_amount}
        }
       }else{
        const amount = Number(cc.quantity) * Number(cc.rate);
        const taxAmount =  (amount * Number(cc.tax)) / 100;
        const subTotal = amount + taxAmount
        return {...cc, amount, taxAmount, subTotal}
       }
      return cc
    })
    setItems(updatenewItem);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const totalTax = items.reduce((sum, item) => sum + Number(item.taxAmount || 0) , 0);
  const discountAmount = items.reduce((sum, item) => sum + Number(item.discount_amount || 0) , 0);
 

  useEffect(() => {

    if (items && items.length) {
      const updatenewItem = items.map((cc) =>{
        if (itemDicount.tax_discount_type.value == 'befor_tax') {
          if (itemDicount.discount_type.value == 'percentage') {
            const amount = Number(Number(cc.quantity) * Number(cc.rate));
            const discount_amount = Number(itemDicount.discount_value) * 0.01 * amount
            const taxAmount = Number(amount- discount_amount)  * Number(cc.tax) * 0.01;
            const subTotal = Number(amount- discount_amount) + taxAmount;
             return {...cc, amount, taxAmount, subTotal, discount_amount}
          }else{
            const amount = (Number(cc.quantity) * Number(cc.rate))
            const discount_amount = Number(itemDicount.discount_value)/ items.length ;
            const taxAmount = Number(amount- discount_amount) * Number(cc.tax) * 0.01;
            const subTotal = Number(amount) + taxAmount - discount_amount;
            return {...cc, amount, taxAmount, subTotal, discount_amount}
          }
          
         }else if (itemDicount.tax_discount_type.value == 'after_tax') {
          if (itemDicount.discount_type.value == 'percentage') {
            const amount = Number(Number(cc.quantity) * Number(cc.rate));
            const taxAmount = Number(amount)  * Number(cc.tax) * 0.01;
            const discount_amount = Number(itemDicount.discount_value) * 0.01 * (amount + taxAmount)
            const subTotal = amount + taxAmount - discount_amount;
             return {...cc, amount, taxAmount, subTotal, discount_amount}
          }else{
            const amount = (Number(cc.quantity) * Number(cc.rate))
            const taxAmount = Number(amount) * Number(cc.tax) * 0.01;
            const discount_amount = Number(itemDicount.discount_value)/ items.length ;
            const subTotal = amount + taxAmount -discount_amount;
            return {...cc, amount, taxAmount, subTotal, discount_amount}
          }
         }else{
          const amount = Number(cc.quantity) * Number(cc.rate);
          const taxAmount =  (amount * Number(cc.tax)) / 100;
          const subTotal = amount + taxAmount
          return {...cc, amount, taxAmount, subTotal}
         }
        return cc
      })
      
      setItems(updatenewItem)
    }

  }, [itemDicount]);
  

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Expenses calculation analyze</h1>

      {/* Add Item Form */}
      <div className="bg-gray-100 p-6 rounded-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <div></div>
          <h2 className="text-xl font-semibold">Add New Item</h2>
          <button
            onClick={addItem}
            className=" bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Add Item
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-start text-sm font-medium mb-1">Item Name</label>
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={newItem.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md appearance-none outline-none focus:ring-1 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-start text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newItem.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md appearance-none outline-none focus:ring-1 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-start text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md appearance-none outline-none focus:ring-1 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-start text-sm font-medium mb-1">Rate</label>
            <input
              type="number"
              name="rate"
              placeholder="Rate"
              value={newItem.rate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md appearance-none outline-none focus:ring-1 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm text-start font-medium mb-1">Tax (%)</label>
            <input
              type="number"
              name="tax"
              placeholder="Tax %"
              value={newItem.tax}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md appearance-none outline-none focus:ring-1 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-start text-sm font-medium mb-1">Tax Discount Type</label>
            <Select
              defaultValue={itemDicount.tax_discount_type}
              options={discountOptions}
              className="w-full"
              onChange={(e) => {
                setItemDicount({
                  ...itemDicount, tax_discount_type : e
                })
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#d1d5db", // Tailwind gray-300
                  boxShadow: "none",
                  "&:hover": { borderColor: "#93c5fd" }, // Tailwind blue-300
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* Editable Items Table */}
      <div className="bg-white shadow-md rounded-md p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Items List</h2>
        <table className="w-full table-auto border-collapse mb-2">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Rate</th>
              <th className="p-2 border">Tax (%)</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Tax Amount</th>
              {itemDicount.tax_discount_type.value === 'no_discount' ? <></> :
              <th className="p-2 border">Discount Amount</th>}
              <th className="p-2 border">Sub Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    className="w-full p-1 border rounded-md"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    className="w-full p-1 border rounded-md"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    className="w-full p-1 border rounded-md text-center"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(index, "rate", e.target.value)}
                    className="w-full p-1 border rounded-md text-right"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.tax}
                    onChange={(e) => updateItem(index, "tax", e.target.value)}
                    className="w-full p-1 border rounded-md text-right"
                  />
                </td>
                <td className="p-2 border text-right">${item.amount.toFixed(2)}</td>
                <td className="p-2 border text-right">
                  ${item.taxAmount.toFixed(2)}
                </td>
                {itemDicount.tax_discount_type.value === 'no_discount' ? <></> :
                  <td className="p-2 border text-right">
                    ${item && item.discount_amount && item.discount_amount.toFixed(2)}
                  </td>}
                <td className="p-2 border text-right">
                  ${item.subTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end items-end space-y-3 flex-col">
          {itemDicount.tax_discount_type.value === 'no_discount' ? <></> :
          <div className="flex flex-col md:flex-row mt-2 gap-3 w-full md:w-1/2">
            <div className="flex w-full md:w-2/4 ">
              <label className="block text-start text-sm font-medium mb-1">Discount Type</label>
              <Select
                defaultValue={itemDicount.discount_type}
                options={amountDiscountOptions}
                className="w-[154px]"
                onChange={(e) => {
                  setItemDicount({
                    ...itemDicount, discount_type : e
                  })
                }}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#d1d5db", // Tailwind gray-300
                    boxShadow: "none",
                    "&:hover": { borderColor: "#93c5fd" }, // Tailwind blue-300
                  }),
                }}
              />
            </div>
            <div className="flex w-full md:w-3/4 ">
              <label className="block w-[25%] text-sm text-start font-medium mb-1">Discount Amount</label>
              <input
                type="number"
                name="discount"
                placeholder="0"
                value={itemDicount.discount_value}
                onChange={(e) => {
                  setItemDicount({
                    ...itemDicount, discount_value : e.target.value
                  })
                }}
                className="w-[75%] p-2 border rounded-md appearance-none outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>
            <div className="flex w-full md:w-1/4 items-center justify-end text-end font-semibold border-b">-{discountAmount}</div>
          </div>
          }
          <p className=" font-semibold ">Total Tax: ${totalTax.toFixed(2)}</p>
          <p className="font-semibold"> Amount: ${totalAmount.toFixed(2)}</p>
          <p className="font-semibold">Total Amount: ${Number(totalTax.toFixed(2)) + Number(totalAmount.toFixed(2))- itemDicount.tax_discount_type.value === 'no_discount' ? 0 : Number(discountAmount)}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
