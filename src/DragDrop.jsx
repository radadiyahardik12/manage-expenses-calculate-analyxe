import React, { useState } from "react";
import Select from 'react-select';

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    quantity: 1,
    rate: 0,
    tax: 0,
    discount_type : {value : 'no_discount', label : 'No Discount'}
  });

  const options = [
    { value: 'no_discount', label: 'No Discount' },
    { value: 'befor_tax', label: 'Befor Tax' },
    { value: 'after_tax', label: 'After Tax' },
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
    setItems((prev) => {
      const updatedItems = [...prev];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      // Recalculate Amount and Tax if related fields change
      if (field === "quantity" || field === "rate" || field === "tax") {
        const quantity = Number(updatedItems[index].quantity);
        const rate = Number(updatedItems[index].rate);
        const tax = Number(updatedItems[index].tax);

        const amount = quantity * rate;
        const taxAmount = (amount * tax) / 100;
        const subTotal = amount + taxAmount

        updatedItems[index].amount = amount;
        updatedItems[index].taxAmount = taxAmount;
        updatedItems[index].subTotal = subTotal;
      }

      return updatedItems;
    });
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0);

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Expense Manager</h1>

      {/* Add Item Form */}
      <div className="bg-gray-100 p-6 rounded-md mb-8">
        <div className="flex justify-between items-center">
          <div></div>
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
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
            <label className="block text-start text-sm font-medium mb-1">Discount Type</label>
            <Select
              defaultValue={newItem.discount_type}
              options={options}
              className="w-full"
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
      <div className="bg-white shadow-md rounded-md p-4">
        <h2 className="text-xl font-semibold mb-4">Items List</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Rate</th>
              <th className="p-2 border">Tax (%)</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Tax Amount</th>
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
                <td className="p-2 border text-right">
                  ${item.subTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 mt-6 p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p>Total Amount: ${totalAmount.toFixed(2)}</p>
        <p>Total Tax: ${totalTax.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default App;
