import { useState, useContext, useEffect } from "react";

import { MSTStoreContext } from "mst/store";

const useEngagementContractingAndBilling = (props) => {
  const { inputValues, setInputValues } = props;
  const mstStore = useContext(MSTStoreContext);
  const { applicationStore } = mstStore;
  const { groupBillingEntityDetailsStore } = applicationStore;
  const {
    getGroupBillingEntityBranch,
    getGroupBillingEntityPICDetails,
    getGroupBillingEntityBillServices,
    groupBillingEntityBillServices,
  } = groupBillingEntityDetailsStore;

  const [isLoading, setIsLoading] = useState(false);

  const fetchGroupBillingEntityBranch = async (value) => {
    setIsLoading(true);
    await getGroupBillingEntityBranch(value);
    setIsLoading(false);
  };

  useEffect(() => {
    if (inputValues.billingEntityDropdownValue) {
      fetchGroupBillingEntityBranch(inputValues.billingEntityDropdownValue);
    }
  }, [inputValues.billingEntityDropdownValue]);

  const fetchGroupBillingEntityPICDetails = async (companyName, branchName) => {
    setIsLoading(true);
    await getGroupBillingEntityPICDetails(companyName, branchName);
    setIsLoading(false);
  };

  const fetchGroupBillingEntityBillServices = async (companyName, branchName) => {
    setIsLoading(true);
    await getGroupBillingEntityBillServices(companyName, branchName);
    setIsLoading(false);
  };

  useEffect(() => {
    if (inputValues.billingEntityDropdownValue && inputValues.branchDropdownValue) {
      fetchGroupBillingEntityPICDetails(inputValues.billingEntityDropdownValue, inputValues.branchDropdownValue);
      fetchGroupBillingEntityBillServices(inputValues.billingEntityDropdownValue, inputValues.branchDropdownValue);
    }
  }, [inputValues.branchDropdownValue, inputValues.billingEntityDropdownValue]);

  useEffect(() => {
    if (inputValues.billingEntityDropdownValue && inputValues.branchDropdownValue) {
      fetchGroupBillingEntityPICDetails(inputValues.billingEntityDropdownValue, inputValues.branchDropdownValue);
      fetchGroupBillingEntityBillServices(inputValues.billingEntityDropdownValue, inputValues.branchDropdownValue);
    }
  }, [inputValues.branchDropdownValue, inputValues.billingEntityDropdownValue]);

  useEffect(() => {
    if (inputValues.billingServiceDropdownValue) {
      setInputValues({
        type: "SET_SERVICE_LINE",
        payload: groupBillingEntityBillServices.find(
          (item) => String(item.serviceId) === inputValues.billingServiceDropdownValue
        ).majorBusinessLineName,
      });
      setInputValues({
        type: "SET_DEPARTMENT",
        payload: groupBillingEntityBillServices.find(
          (item) => String(item.serviceId) === inputValues.billingServiceDropdownValue
        ).serviceLineName,
      });
    }
  }, [inputValues.billingServiceDropdownValue]);

  return {
    isLoading,
  };
};

export default useEngagementContractingAndBilling;
