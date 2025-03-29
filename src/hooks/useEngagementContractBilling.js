import { useState, useEffect, useContext } from "react";

import { MSTStoreContext } from "mst/store";
import { checkTableData } from "common";

const useEngagementContractBilling = (props) => {
  const {
    adminExpenseRadioBtnValue,
    adminExpenseTableData,
    billingTableData,
    inputValues,
    opeRadioBtnValue,
    opeTableData,
    opeTypeRadioBtnValue,
    setAdminExpenseTableData,
    setBillingTableData,
    setInputValues,
    setOpeTableData,
    setStep,
    step,
  } = props;
  const mstStore = useContext(MSTStoreContext);
  const { applicationStore, viewStore } = mstStore;
  const { toastStore } = viewStore;
  const { popToast } = toastStore;
  const { currencyDetailsStore, billingFrequencyDetailsStore, taxDetailsStore } = applicationStore;
  const { getTaxDetails } = taxDetailsStore;
  const { getCurrencyDetails } = currencyDetailsStore;
  const { getBillingFrequencyDetails } = billingFrequencyDetailsStore;

  const [isLoading, setIsLoading] = useState(false);

  const getBillingTableFees = () => {
    const fees = billingTableData.reduce((total, itemRow) => {
      let value = 0;
      if (inputValues.billingFreqDropdownValue === ">1") {
        value = Number(itemRow[3].value) * Number(itemRow[0].value);
      } else {
        value = Number(itemRow[3].value);
      }
      total += value;
      return total;
    }, 0);
    return fees;
  };

  useEffect(() => {
    if (opeRadioBtnValue === "exclusive") {
      setOpeTableData([
        [
          {
            value: 0,
            inputType: "number",
            placeholder: "OPE(Percent)",
          },
          {
            disabled: true,
            value: 0,
            inputType: "number",
            placeholder: "(Auto)",
          },
        ],
      ]);
    } else {
      setOpeTableData([
        [
          {
            value: 0,
            inputType: "number",
            placeholder: "OPE(Percent)",
          },
          {
            disabled: true,
            value: 0,
            inputType: "number",
            placeholder: "(Auto)",
          },
        ],
      ]);
    }
  }, [opeRadioBtnValue]);

  useEffect(() => {
    if (adminExpenseRadioBtnValue === "exclusive") {
      setAdminExpenseTableData([
        [
          {
            value: 0,
            inputType: "number",
            placeholder: "Admin Expense(Percent)",
          },
          { disabled: true, value: 0, inputType: "number", placeholder: "(Auto)" },
        ],
      ]);
    } else {
      setAdminExpenseTableData([
        [
          {
            value: 0,
            inputType: "number",
            placeholder: "Admin Expense(Percent)",
            disabled: true,
          },
          { disabled: true, value: 0, inputType: "number", placeholder: "(Auto)" },
        ],
      ]);
    }
  }, [adminExpenseRadioBtnValue]);

  useEffect(() => {
    if (opeTableData[0][0].value) {
      const newValue = (Number(opeTableData[0][0].value) / 100) * getBillingTableFees();
      updateOpeTableData(0, 1, newValue.toFixed(2));
    }
  }, [opeTableData[0][0].value]);

  useEffect(() => {
    if (adminExpenseTableData[0][0].value) {
      const newValue = (Number(adminExpenseTableData[0][0].value) / 100) * getBillingTableFees();
      updateAdminExpenseTableData(0, 1, newValue.toFixed(2));
    }
  }, [adminExpenseTableData[0][0].value]);

  useEffect(() => {
    let isValid = true;
    billingTableData.forEach((itemRow) => {
      if (!Number(itemRow[3].value)) {
        isValid = false;
      }
    });
    if (isValid && !!inputValues.taxesDropdownValue) {
      let total = getBillingTableFees() + Number(opeTableData[0][1].value) + Number(adminExpenseTableData[0][1].value);
      const tax = total * (Number(inputValues.taxesDropdownValue) / 100);
      const grandTotal = total + tax;
      setInputValues({
        type: "SET_GRAND_TOTAL",
        payload: Number(grandTotal).toFixed(2),
      });
    }
  }, [
    inputValues.taxesDropdownValue,
    ...billingTableData.map((row) => row[3].value),
    ...billingTableData.map((row) => row[0].value),
    opeTableData[0][0].value,
    adminExpenseTableData[0][0].value,
  ]);

  useEffect(() => {
    billingTableData.forEach((itemRow) => {
      if (itemRow[3].value) {
        const adminExp = (Number(adminExpenseTableData[0][0].value) / 100) * Number(itemRow[3].value);
        updateAdminExpenseTableData(0, 1, adminExp.toFixed(2));
        const ope = (Number(opeTableData[0][0].value) / 100) * Number(itemRow[3].value);
        updateOpeTableData(0, 1, ope.toFixed(2));
      }
    });
  }, [...billingTableData.map((row) => row[3].value), ...billingTableData.map((row) => row[0].value)]);

  const fetchBillingDropdownOptions = async () => {
    setIsLoading(true);
    await getBillingFrequencyDetails();
    await getCurrencyDetails();
    await getTaxDetails();
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBillingDropdownOptions();
  }, []);

  // Function to update the table data inputValues
  const updateBillingTableData = (rowIndex, cellIndex, value) => {
    const newData = billingTableData.map((row) => [...row]);
    if (!newData[rowIndex]) {
      newData[rowIndex] = Array(3).fill(""); // Ensure the row exists
    }
    if (typeof newData[rowIndex][cellIndex] === "object") {
      if (newData[rowIndex][cellIndex].inputType === "autocomplete") {
        newData[rowIndex][cellIndex] = { ...newData[rowIndex][cellIndex], value, autocompleteInputValue: value };
      } else {
        newData[rowIndex][cellIndex] = { ...newData[rowIndex][cellIndex], value };
      }
    } else {
      newData[rowIndex][cellIndex] = value;
    }
    setBillingTableData(newData);
  };

  // Function to update the table data inputValues
  const updateAdminExpenseTableData = (rowIndex, cellIndex, value) => {
    const newData = adminExpenseTableData.map((row) => [...row]);
    if (!newData[rowIndex]) {
      newData[rowIndex] = Array(2).fill(""); // Ensure the row exists
    }
    newData[rowIndex][cellIndex] = { ...newData[rowIndex][cellIndex], value };
    setAdminExpenseTableData(newData);
  };

  // Function to update the table data inputValues
  const updateOpeTableData = (rowIndex, cellIndex, value) => {
    const newData = opeTableData.map((row) => [...row]);
    if (!newData[rowIndex]) {
      newData[rowIndex] = Array(2).fill(""); // Ensure the row exists
    }
    newData[rowIndex][cellIndex] = { ...newData[rowIndex][cellIndex], value };
    setOpeTableData(newData);
  };

  const handleNextBtnClick = () => {
    if (inputValues.currencyDropdownValue && inputValues.billingFreqDropdownValue && inputValues.grandTotal) {
      let isValid = true;
      if (opeRadioBtnValue === "exclusive" && opeTypeRadioBtnValue === "fixed_percentage") {
        if (!checkTableData(opeTableData).isValid) {
          isValid = false;
        }
      }
      if (adminExpenseRadioBtnValue === "exclusive") {
        if (!checkTableData(adminExpenseTableData).isValid) {
          isValid = false;
        }
      }
      let msg = "";
      if (inputValues.billingFreqDropdownValue === "2") {
        isValid = checkTableData(billingTableData, "milestone").isValid;
        msg = checkTableData(billingTableData, "milestone").msg;
      }
      if (isValid) {
        setStep(step + 1);
      } else {
        setStep(step + 1);

        // popToast(msg ? msg : "Please fill all the details!", "error");
      }
    } else {
      setStep(step + 1);

      // popToast("Please fill all the details!", "error");
    }
  };

  return {
    handleNextBtnClick,
    isLoading,
    updateAdminExpenseTableData,
    updateBillingTableData,
    updateOpeTableData,
  };
};

export default useEngagementContractBilling;
