import { types, getRoot, flow } from "mobx-state-tree";
import axios from "axios";

import { BASE_URL } from "config/constants";
import { handleApiRequest } from "services/api/apiMethods";
import { API_METHODS, TOAST_TYPE } from "common";
import SearchDetails from "./search/search-details";





const ApplicationStore = types
  .model("ApplicationStore", {
   
    searchDetailsStore:SearchDetails,
   
   
  })
  .views(() => ({}))
  .actions((self) => ({
    reset() {
      Object.keys(self).forEach((key) => {
        self[key].reset && self[key].reset();
      });
      self.isSidebarCollapsed = false;
    },
    setActiveSidebarMenu: function (menuTitle) {
      self.activeSidebarMenu = menuTitle;
    },
    setSidebarState: function (val) {
      self.isSidebarCollapsed = val;
    },
    setIsDonnaAiStarted: function () {
      self.isDonnaAiIntroDisplayed = true;
    },
    getEmbedTokenForDashboard: flow(function* getEmbedTokenForDashboard(data) {
      const { viewStore } = getRoot(self);
      const { apiStatusStore } = viewStore;
      const { setIsLoadingStatus } = apiStatusStore;

      try {
        const url = `${BASE_URL_HELPDESK}get_power_bi_embedded_token`;
        setIsLoadingStatus("getEmbedTokenForDashboard", false, false, true);
        const response = yield handleApiRequest({
          method: API_METHODS.POST,
          url,
          payload: data,
        });
        console.info("Get Embed token for dashboard successful");
        setIsLoadingStatus("getEmbedTokenForDashboard", false, true, false);
        return response?.data;
      } catch (e) {
        console.error("Error in get embed token for dashboard api", e);
        setIsLoadingStatus("getEmbedTokenForDashboard", true, false, false);
      }
    }),
    postModuleUsage: flow(function* postModuleUsage(data) {
      const { viewStore } = getRoot(self);
      const { apiStatusStore } = viewStore;
      const { setIsLoadingStatus } = apiStatusStore;

      try {
        const url = `${BASE_URL_HELPDESK}create_user_count`;
        setIsLoadingStatus("postModuleUsage", false, false, true);
        const response = yield handleApiRequest({
          method: API_METHODS.POST,
          url,
          payload: data,
        });
        console.info("Post module usage API successful", response?.data);
        setIsLoadingStatus("postModuleUsage", false, true, false);
      } catch (e) {
        console.error("Error in post module usage api", e);
        setIsLoadingStatus("postModuleUsage", true, false, false);
      }
    }),
    postEngagementData: flow(function* postEngagementData(data) {
      const { viewStore } = getRoot(self);
      const { apiStatusStore } = viewStore;
      const { setIsLoadingStatus } = apiStatusStore;
      const { toastStore } = viewStore;
      const { popToast } = toastStore;

      try {
        const url = `${BASE_URL}create_engagement`;
        setIsLoadingStatus("postEngagementData", false, false, true);
        const response = yield handleApiRequest({
          method: API_METHODS.POST,
          url,
          payload: data,
        });
        console.info("Create Engagement API post successful", response?.data, "eng ID", response.data.data.eng_id);
        self.engagementContractId = response.data.data.eng_id;
        setIsLoadingStatus("postEngagementData", false, true, false);
        popToast("Engagement contract creation successful", TOAST_TYPE.SUCCESS);
      } catch (e) {
        console.error("Error in post engagement api", e);
        setIsLoadingStatus("postEngagementData", true, false, false);
        popToast("Engagement contract creation failed! Please try again later", TOAST_TYPE.ERROR);
      }
    }),
    postEmploymentData: flow(function* postEmploymentData(data) {
      const { viewStore } = getRoot(self);
      const { apiStatusStore } = viewStore;
      const { setIsLoadingStatus } = apiStatusStore;
      const { toastStore } = viewStore;
      const { popToast } = toastStore;

      try {
        const url = `${BASE_URL_HELPDESK}create_employee_appointment`;
        setIsLoadingStatus("postEmploymentData", false, false, true);
        const response = yield handleApiRequest({
          method: API_METHODS.POST,
          url,
          payload: data,
        });
        self.newEmployeeIdCreated = response?.data?.employee_number;
        console.info("Create Employment Letter API post successful", response?.data);
        setIsLoadingStatus("postEmploymentData", false, true, false);
        popToast("Employment contract creation successful", TOAST_TYPE.SUCCESS);
      } catch (e) {
        console.error("Error in post employee contract api", e);
        setIsLoadingStatus("postEmploymentData", true, false, false);
        popToast("Employment contract creation failed! Please try again later", TOAST_TYPE.ERROR);
      }
    }),
    postEngagementIdForUrl: flow(function* postEngagementIdForUrl() {
      const { viewStore } = getRoot(self);
      const { apiStatusStore } = viewStore;
      const { setIsLoadingStatus } = apiStatusStore;
      const { toastStore } = viewStore;
      const { popToast } = toastStore;

      try {
        const url = `${BASE_URL}document_generation?eng_id=${self.engagementContractId}`;
        setIsLoadingStatus("postEngagementIdForUrl", false, false, true);
        const response = yield handleApiRequest({
          method: API_METHODS.GET,
          url,
        });
        console.info("Generate engagement contract API post successful", response?.data);
        setIsLoadingStatus("postEngagementIdForUrl", false, true, false);
        popToast("Engagement contract generation successful", TOAST_TYPE.SUCCESS);
      } catch (e) {
        console.error("Error in generate engagement contract api", e);
        setIsLoadingStatus("postEngagementIdForUrl", true, false, false);
        popToast("Engagement contract generation failed! Please try again later", TOAST_TYPE.ERROR);
      }
    }),
    postEmpIdForEmpLetterUrl: flow(function* postEmpIdForEmpLetterUrl(empId) {
      const { viewStore } = getRoot(self);
      const { apiStatusStore } = viewStore;
      const { setIsLoadingStatus } = apiStatusStore;
      const { toastStore } = viewStore;
      const { popToast } = toastStore;

      try {
        const url = `${BASE_URL_HELPDESK}generate_appointment_letter?empId=${self.newEmployeeIdCreated}`;
        setIsLoadingStatus("postEmpIdForEmpLetterUrl", false, false, true);
        const response = yield handleApiRequest({
          method: API_METHODS.GET,
          url,
        });
        console.info("Generate employment contract API post successful", response?.data);
        setIsLoadingStatus("postEmpIdForEmpLetterUrl", false, true, false);
        popToast("Employment contract generation successful", TOAST_TYPE.SUCCESS);
      } catch (e) {
        console.error("Error in generate employment contract api", e);
        setIsLoadingStatus("postEmpIdForEmpLetterUrl", true, false, false);
        popToast("Employment contract generation failed! Please try again later", TOAST_TYPE.ERROR);
      }
    }),
    downloadEngContract: flow(function* downloadEngContract(clientName) {
      const { viewStore } = getRoot(self);
      const { apiStatusStore, toastStore } = viewStore;
      const { popToast } = toastStore;
      const { setIsLoadingStatus } = apiStatusStore;

      try {
        const apiUrl = `${BASE_URL}download_file?client_name=${clientName}`;
        const response = yield axios.get(apiUrl, {
          responseType: "arraybuffer", // Specify the response type as arraybuffer
        });

        // Create a Blob from the response data
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element and click it to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `EL_Praxis_${clientName}.docx`); // Set the filename
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the temporary URL and link element
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        console.info("File downloaded successfully", response.data);
        setIsLoadingStatus("downloadEngContract", false, true, false);
      } catch (error) {
        console.error("Error in file download api", error);
        setIsLoadingStatus("downloadEngContract", true, false, false);
        popToast("Download failed! Please try again", TOAST_TYPE.ERROR);
        return error;
      }
    }),
    downloadEmpContract: flow(function* downloadEmpContract() {
      const { viewStore } = getRoot(self);
      const { apiStatusStore, toastStore } = viewStore;
      const { popToast } = toastStore;
      const { setIsLoadingStatus } = apiStatusStore;

      try {
        const apiUrl = `${BASE_URL_HELPDESK}download_appointment_letter?empId=${self.newEmployeeIdCreated}`;
        const response = yield axios.get(apiUrl, {
          responseType: "arraybuffer", // Specify the response type as arraybuffer
        });

        // Create a Blob from the response data
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element and click it to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Employment_Letter_Praxis_${self.newEmployeeIdCreated}.docx`); // Set the filename
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the temporary URL and link element
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        console.info("Employment Letter File downloaded successfully", response.data);
        setIsLoadingStatus("downloadEmpContract", false, true, false);
      } catch (error) {
        console.error("Error in employment letter file download api", error);
        setIsLoadingStatus("downloadEmpContract", true, false, false);
        popToast("Download failed! Please try again", TOAST_TYPE.ERROR);
        return error;
      }
    }),
    generateELStream: flow(function* generateELStream(clientName) {
      const { viewStore } = getRoot(self);
      const { apiStatusStore } = viewStore;
      const { setIsLoadingStatus } = apiStatusStore;

      try {
        const url = `${BASE_URL}generate_engagement_stream?client_name=${clientName}`;
        setIsLoadingStatus("generateELStream", false, false, true);
        console.info(url);
        const response = yield axios.get(url, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          },
          responseType: "blob",
        });
        console.info(url, response.data);
        if (self.engagementLetterRenderURL) {
          URL.revokeObjectURL(self.engagementLetterRenderURL);
        }
        const renderURL = URL.createObjectURL(response.data);
        self.engagementLetterRenderURL = renderURL;
        console.info("Generate engagement contract stream API get successful", response?.data);
        setIsLoadingStatus("generateELStream", false, true, false);
      } catch (e) {
        console.error("Error in generate engagement contract stream api", e);
        setIsLoadingStatus("generateELStream", true, false, false);
      }
    }),
    uploadELtoOneDrive: flow(function* uploadELtoOneDrive(data) {
      const { viewStore, domainStore } = getRoot(self);
      const { ssoToken } = domainStore;
      const { apiStatusStore } = viewStore;
      const { setIsLoadingStatus } = apiStatusStore;
      const { toastStore } = viewStore;
      const { popToast } = toastStore;

      const config = {
        headers: {
          Authorization: ssoToken,
        },
      };

      try {
        const url = `${BASE_URL}save_one_drive`;
        setIsLoadingStatus("uploadELtoOneDrive", false, false, true);
        const response = yield handleApiRequest({
          method: API_METHODS.POST,
          url,
          payload: data,
          config,
        });
        console.info("Post EL details for oneDrive upload successful", response?.data);
        setIsLoadingStatus("uploadELtoOneDrive", false, true, false);
        popToast("Engagement Letter uploaded to your OneDrive", TOAST_TYPE.SUCCESS);
      } catch (e) {
        console.error("Error in post EL details for oneDrive upload api", e);
        setIsLoadingStatus("uploadELtoOneDrive", true, false, false);
        popToast("Engagement letter OneDrive upload failed! Please try again later", TOAST_TYPE.ERROR);
      }
    }),
    postELNameForWebUrl: flow(function* postELNameForWebUrl(data) {
      const { viewStore, domainStore } = getRoot(self);
      const { ssoToken } = domainStore;
      const { apiStatusStore } = viewStore;
      const { setIsLoadingStatus } = apiStatusStore;

      const config = {
        headers: {
          Authorization: ssoToken,
        },
      };

      try {
        const url = `${BASE_URL}one_drive_web_link`;
        setIsLoadingStatus("postELNameForWebUrl", false, false, true);
        const response = yield handleApiRequest({
          method: API_METHODS.POST,
          url,
          payload: data,
          config,
        });
        self.ELFileOneDriveUrl = response?.data?.embedLink;
        console.info("Post EL filename for webUrl successful", response?.data);
        setIsLoadingStatus("postELNameForWebUrl", false, true, false);
      } catch (e) {
        console.error("Error in post EL filename for webUrl api", e);
        setIsLoadingStatus("postELNameForWebUrl", true, false, false);
      }
    }),
    generateEmploymentLetterStream: flow(function* generateEmploymentLetterStream(empName) {
      const { viewStore } = getRoot(self);
      const { apiStatusStore } = viewStore;
      const { setIsLoadingStatus } = apiStatusStore;

      try {
        const url = `${BASE_URL_HELPDESK}generate_appointment_stream?empId=${self.newEmployeeIdCreated}`;
        setIsLoadingStatus("generateEmploymentLetterStream", false, false, true);
        console.info(url);
        const response = yield axios.get(url, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          },
          responseType: "blob",
        });
        console.info(url, response.data);
        if (self.employmentLetterRenderURL) {
          URL.revokeObjectURL(self.employmentLetterRenderURL);
        }
        const renderURL = URL.createObjectURL(response.data);
        self.employmentLetterRenderURL = renderURL;
        console.info("Generate employment contract stream API get successful", response?.data);
        setIsLoadingStatus("generateEmploymentLetterStream", false, true, false);
      } catch (e) {
        console.error("Error in generate employment contract stream api", e);
        setIsLoadingStatus("generateEmploymentLetterStream", true, false, false);
      }
    }),
    resetELRenderURL: function () {
      self.engagementLetterRenderURL = "";
    },
    resetEmploymentLetterRenderURL: function () {
      self.employmentLetterRenderURL = "";
    },
    afterCreate() {},
  }));

export { ApplicationStore };
