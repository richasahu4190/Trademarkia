import { useContext, useEffect, useState } from "react";

import { MSTStoreContext } from "mst/store";
import { getTitleByDropdownValue } from "common";

const useEngagementContractReview = (props) => {
  const { setStep, keyDetails } = props;
  const { applicationStore, viewStore } = useContext(MSTStoreContext);
  const {
    groupBillingEntityDetailsStore,
    clientDetailsStore,
    postEngagementIdForUrl,
    downloadEngContract,
    engagementLetterRenderURL,
    generateELStream,
    resetELRenderURL,
    uploadELtoOneDrive,
    postELNameForWebUrl,
    ELFileOneDriveUrl,
  } = applicationStore;
  const { clientDetailsDropdownOptions } = clientDetailsStore;
  const { groupBillingEntityBillServDropdownOptions } = groupBillingEntityDetailsStore;
  const { apiStatusStore } = viewStore;
  const { getApiStatus } = apiStatusStore;

  const isApiLoading = getApiStatus("postEngagementData").isLoading;
  const postEngHasFetched = getApiStatus("postEngagementData")?.hasFetched;
  const generateEngHasFetched = getApiStatus("postEngagementIdForUrl")?.hasFetched;
  const isEngContractDownloading = getApiStatus("downloadEngContract").isLoading;
  const uploadELHasFetched = getApiStatus("uploadELtoOneDrive").hasFetched;

  const [engContractKeyDetails, setEngContractKeyDetails] = useState([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const fetchEngagementContractURL = async () => {
    setIsLocalLoading(true);
    await postEngagementIdForUrl();
    setIsLocalLoading(false);
  };

  useEffect(() => {
    setIsLocalLoading(true);
    const newData = [...keyDetails];
    // newData[0] = {
    //   ...newData[0],
    //   value: getTitleByDropdownValue(clientDetailsDropdownOptions, Number(newData[0].value)),
    // };
    // newData[1] = {
    //   ...newData[1],
    //   value: getTitleByDropdownValue(groupBillingEntityBillServDropdownOptions, Number(newData[1].value)),
    // };
    setEngContractKeyDetails(newData);
    setIsLocalLoading(false);
  }, []);

  const fetchELRenderURL = async () => {
    setIsLocalLoading(true);
    await generateELStream(getTitleByDropdownValue(clientDetailsDropdownOptions, Number(keyDetails[0].value)));
    setIsLocalLoading(false);
  };

  useEffect(() => {
    if (generateEngHasFetched) {
      fetchELRenderURL();
    }
  }, [generateEngHasFetched]);

  const uploadEL = async () => {
    setIsLocalLoading(true);
    await uploadELtoOneDrive({
      fileName: getTitleByDropdownValue(clientDetailsDropdownOptions, Number(keyDetails[0].value)),
    });
    setIsLocalLoading(false);
  };

  const fetchUploadedELWebUrl = async () => {
    setIsLocalLoading(true);
    await postELNameForWebUrl({
      fileName: getTitleByDropdownValue(clientDetailsDropdownOptions, Number(keyDetails[0].value)),
    });
    setIsLocalLoading(false);
  };

  useEffect(() => {
    if (generateEngHasFetched) {
      uploadEL();
    }
  }, [generateEngHasFetched]);

  useEffect(() => {
    if (uploadELHasFetched) {
      fetchUploadedELWebUrl();
    }
  }, [uploadELHasFetched]);

  useEffect(() => {
    if (!isApiLoading) {
      // fetchEngagementContractURL();
      // fetchELRenderURL();
    }
  }, [isApiLoading]);

  /**
   * Handles the "Generate Again" button click event.
   */
  const handleGenerateAgainBtnClick = () => {
    resetELRenderURL();
    setStep(1);
  };

  /**
   * downloads engagement contract on click of button
   */
  const handleDownloadBtnClick = async () => {
    // downloadEngContract(engContractKeyDetails[0].value);
    const link = document.createElement("a");
    link.href = process.env.PUBLIC_URL + "/EL_Praxis_Nvidia Corporation.docx";
    link.target = "_blank"; // Open in a new tab
    link.rel = "noopener noreferrer";
    // Simulate a click on the anchor element
    link.click();
  };

  return {
    isApiLoading,
    isEngContractDownloading,
    isLocalLoading,
    engContractKeyDetails,
    handleGenerateAgainBtnClick,
    handleDownloadBtnClick,
    clientDetailsDropdownOptions,
    engagementLetterRenderURL,
    ELFileOneDriveUrl,
  };
};

export default useEngagementContractReview;
