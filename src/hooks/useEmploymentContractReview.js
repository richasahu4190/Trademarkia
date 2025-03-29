import { useContext, useEffect, useState } from "react";

import { MSTStoreContext } from "mst/store";

const useEmploymentContractReview = (props) => {
  const { setStep } = props;
  const { applicationStore, viewStore } = useContext(MSTStoreContext);
  const {
    employmentLetterRenderURL,
    postEmpIdForEmpLetterUrl,
    generateEmploymentLetterStream,
    downloadEmpContract,
    resetEmploymentLetterRenderURL,
  } = applicationStore;
  const { apiStatusStore } = viewStore;
  const { getApiStatus } = apiStatusStore;

  const isApiLoading = getApiStatus("postEmploymentData").isLoading;
  const postEngHasFetched = getApiStatus("postEmploymentData")?.hasFetched;
  const generateEmployeeContractHasFetched = getApiStatus("postEmpIdForEmpLetterUrl")?.hasFetched;
  const isEmpContractDownloading = getApiStatus("downloadEmpContract").isLoading;

  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const fetchEmploymentContractURL = async () => {
    setIsLocalLoading(true);
    await postEmpIdForEmpLetterUrl();
    setIsLocalLoading(false);
  };

  const fetchEmploymentLetterRenderURL = async () => {
    setIsLocalLoading(true);
    await generateEmploymentLetterStream();
    setIsLocalLoading(false);
  };

  useEffect(() => {
    if (generateEmployeeContractHasFetched) {
      fetchEmploymentLetterRenderURL();
    }
  }, [generateEmployeeContractHasFetched]);

  useEffect(() => {
    if (!isApiLoading) {
      fetchEmploymentContractURL();
      // fetchELRenderURL();
    }
  }, [isApiLoading]);

  /**
   * Handles the "Generate Again" button click event.
   */
  const handleGenerateAgainBtnClick = () => {
    resetEmploymentLetterRenderURL();
    setStep(1);
  };

  /**
   * downloads engagement contract on click of button
   */
  const handleDownloadBtnClick = async () => {
    await downloadEmpContract();
  };

  return {
    isApiLoading,
    isEmpContractDownloading,
    isLocalLoading,
    handleGenerateAgainBtnClick,
    handleDownloadBtnClick,
    employmentLetterRenderURL,
  };
};

export default useEmploymentContractReview;
