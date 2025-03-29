import { useContext, useState } from "react";

import { MSTStoreContext } from "mst/store";

const useEngagementContractEscalation = (props) => {
  const { setStep, step, escalationTableData, setEscalationTableData, allValues } = props;

  const mstStore = useContext(MSTStoreContext);
  const { applicationStore, viewStore } = mstStore;
  const { postEngagementData, clientDetailsStore } = applicationStore;
  const { clientDetailsDropdownOptions } = clientDetailsStore;
  const { toastStore } = viewStore;
  const { popToast } = toastStore;

  const [isLoading, setIsLoading] = useState(false);

  const updateEscalationTableData = (rowIndex, cellIndex, value) => {
    const newData = escalationTableData.map((row) => [...row]);
    if (!newData[rowIndex]) {
      newData[rowIndex] = Array(3).fill(""); // Ensure the row exists
    }
    newData[rowIndex][cellIndex] = { ...newData[rowIndex][cellIndex], value };
    setEscalationTableData(newData);
  };

  const sendEngagementData = async (engData) => {
    setIsLoading(true);
    // await postEngagementData(engData);
    setIsLoading(false);
  };

  const handleGenerateBtnClick = () => {
    let isValid = true;
    console.log({
      ...allValues,
      level_1_billing_entity_remarks: escalationTableData[0][1].value,
      level_1_cr_remarks: escalationTableData[0][2].value,
      level_2_billing_entity_remarks: escalationTableData[1][1].value,
      level_2_cr_remarks: escalationTableData[1][2].value,
      level_3_billing_entity_remarks: escalationTableData[2][1].value,
      level_3_cr_remarks: escalationTableData[2][2].value,
      reviewer_id: "EMPDELKG6912",
    });
    for (let i in allValues) {
      if (
        !(
          i === "ope_amount" ||
          i === "admin_expense_amount" ||
          i === "ope_id" ||
          i === "admin_id" ||
          i === "deliverables_date" ||
          i === "tax_id" ||
          i === "total_admin_amount" ||
          i === "total_ope_amount"
        )
      ) {
        if (!allValues[i]) {
          isValid = false;
          break;
        }
      }
    }
    if (isValid) {
      const finalValues = {
        ...allValues,
        level_1_billing_entity_remarks: escalationTableData[0][1].value,
        level_1_cr_remarks: escalationTableData[0][2].value,
        level_2_billing_entity_remarks: escalationTableData[1][1].value,
        level_2_cr_remarks: escalationTableData[1][2].value,
        level_3_billing_entity_remarks: escalationTableData[2][1].value,
        level_3_cr_remarks: escalationTableData[2][2].value,
        reviewer_id: "EMPDELKG6912",
      };
      sendEngagementData(finalValues);
      setStep(step + 1);
    } else {
      popToast("Please fill all the fields in the previous steps", "error");
    }
  };

  return {
    clientDetailsDropdownOptions,
    handleGenerateBtnClick,
    isLoading,
    updateEscalationTableData,
  };
};

export default useEngagementContractEscalation;
