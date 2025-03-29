import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import moment from "moment";
import { TailSpin } from "react-loader-spinner";
import { FiFilter, FiShare2 } from "react-icons/fi";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import Logo from "assets/Logo.png";

import { MSTStoreContext } from "mst/store";
import TrademarkTable from "components/TrademarkTable/TrademarkTable";

const Landing = observer(() => {
  const { applicationStore } = useContext(MSTStoreContext);
  const { searchDetailsStore } = applicationStore;
  const { search,hits, attorneys,totalHits,classCodes,officeActions,currentOwners,lawFirms} = searchDetailsStore;
  const navigate = useNavigate();
  

  const [loading, setIsLoading] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState("Tesla, Inc.");
  const [view, setView] = useState("grid");
  const [activeTab, setActiveTab] = useState('owners');
  const [searchInput, setSearchInput] = useState(""); // New state for search input
  
  const [searchParams, setSearchParams] = useState({
    input_query: "nike",
    input_query_type: "",
    sort_by: "default",
    status: [],
    owners: [],
    attorneys: [],
    law_firms: [],
    mark_description_description: [],
    page: 1,
    rows: 10,
    sort_order: "desc"
  });

  // Handler functions
  const handleInputQueryChange = (e) => {
    setSearchInput(e.target.value); // Update search input state
  };

  const handleSearch = () => {
    setIsLoading(true);
    setSearchParams(prev => ({
      ...prev,
      input_query: searchInput , // Use search input or default to "nike"
      page: 1 // Reset to first page on new search
    }));
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleStatusChange = (status) => {
    setSearchParams(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleOwnerChange = (owner) => {
    setSearchParams(prev => ({
      ...prev,
      owners: prev.owners.includes(owner)
        ? prev.owners.filter(o => o !== owner)
        : [...prev.owners, owner]
    }));
    setSelectedOwner(owner);
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setSearchParams(prev => ({
      ...prev,
      sort_by: sortBy,
      sort_order: sortOrder
    }));
  };
const postSearch=async()=>{
  await search(searchParams)
}
  useEffect(() => {
    postSearch()
    
  }, [searchParams]);

  return (
    <>
      <div className="flex flex-row justify-between items-center px-11 bg-white h-24 w-full gap-x-8 border-b-8 border-[#EAF1FF]">
        <div className="logo">
          <p className="logoname">
            <img src={Logo} alt="Logo" />
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex flex-1 items-center">
          <div className="flex w-[50%] h-[2.8rem] items-center rounded-xl border border-gray-400 mx-1 px-2">
            <CiSearch size={24} />
            <input
              type="text"
              className="bg-transparent border-none outline-none ml-2 px-1.5 w-full"
              placeholder="Search Trademark Here eg. Mickey Mouse"
              value={searchInput}
              onChange={handleInputQueryChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Search on Enter key
            />
          </div>

          {/* Search Button */}
          <div className="flex flex-row w-[80%] ml-4 -mt-7">
            <button 
              className="bg-[#4380EC] text-white flex justify-center items-center rounded-xl w-28 h-[2.8rem] hover:translate-y-[-2px] transition-all duration-700 mt-7 mr-1"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="bg-no-repeat bg-right pb-5 h-full" id="landing">
        <div className={`flex flex-col w-[97%] h-[5rem] mx-4 font-semibold text-gray-600 m-4 justify-between px-8 `}>
       { searchInput && <p>About 159 Trademarks found for "{searchParams.input_query}"</p>}
          <hr className="h-6 w-full text-[#E7E6E6] mt-4 mb-4" />
          <div className={`flex items-center  p-2 w-full ${searchInput?"justify-between":"justify-end"}`}>
           { searchInput && <div className="flex items-center gap-2">
              <span className="text-black">Also try searching for</span>
              <div className="flex gap-2">
                <button
                  className="border border-orange-500 text-orange-500 px-3 py-1 rounded-md text-sm"
                  onClick={() => {
                    setSearchInput(`${searchParams.input_query}*`);
                    handleSearch();
                  }}
                >
                  {searchParams.input_query}*
                </button>
                <button
                  className="border border-orange-500 text-orange-500 px-3 py-1 rounded-md text-sm"
                  onClick={() => {
                    setSearchInput(`*${searchParams.input_query}`);
                    handleSearch();
                  }}
                >
                  *{searchParams.input_query}
                </button>
              </div>
            </div>}
            <div className="flex items-center gap-3">
              <button className="border border-gray-700 text-black px-3 py-1 rounded-md flex items-center gap-1">
                <FiFilter className="text-gray-700" />
                Filter
              </button>
              <button className="border border-gray-400 w-8 h-8 flex items-center justify-center rounded-full">
                <FiShare2 className="text-gray-700" />
              </button>
              <button className="border border-gray-400 w-8 h-8 flex items-center justify-center rounded-full">
                <HiOutlineMenuAlt4 className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-no-repeat bg-right pb-3 flex flex-row font-semibold">
          <div className="flex flex-row w-full">
            {loading ? (
              <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#0f172a"
                ariaLabel="tail-spin-loading"
                wrapperClass="flex justify-center ml-[45%]"
              />
            ) : (
              <div className="flex flex-row justify-between text-gray-500 w-full p-4 px-8">
                <div className="w-[75%] p-4">
                  <TrademarkTable searchParams={searchParams} />
                </div>
                <div className="w-[25%] flex flex-col gap-y-5 p-4">
                  <div className="bg-white p-5 rounded-xl shadow-customShadow5 w-full">
                    <h3 className="text-lg font-semibold mb-3">Status</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`px-3 py-1 ${searchParams.status.length === 0 ? 'text-blue-600 border-blue-400 bg-blue-100' : 'border'} rounded-md text-sm`}
                        onClick={() => setSearchParams(prev => ({ ...prev, status: [] }))}
                      >
                        All
                      </button>
                      {['Registered', 'Pending', 'Abandoned', 'Others'].map(status => (
                        <button
                          key={status}
                          className={`px-3 py-1 border rounded-md text-sm flex items-center gap-2 ${searchParams.status.includes(status) ? 'bg-blue-100 text-blue-600' : ''}`}
                          onClick={() => handleStatusChange(status)}
                        >
                          <span className={`w-2 h-2 rounded-full ${status === 'Registered' ? 'bg-green-500' : status === 'Pending' ? 'bg-yellow-500' : status === 'Abandoned' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-customShadow5 w-full">
                    <div className="flex border-b pb-2 gap-4 text-gray-500 text-sm">
                      <button
                        className={`font-semibold ${activeTab === 'owners' ? 'text-black border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('owners')}
                      >
                        Owners
                      </button>
                      <button
                        className={`font-semibold ${activeTab === 'lawFirms' ? 'text-black border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('lawFirms')}
                      >
                        Law Firms
                      </button>
                      <button
                        className={`font-semibold ${activeTab === 'attorneys' ? 'text-black border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('attorneys')}
                      >
                        Attorneys
                      </button>
                    </div>

                    <div className="relative mt-3">
                      <CiSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                      <input
                        type="text"
                        placeholder={`Search ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                        className="w-full border rounded-md py-2 pl-8 pr-2 text-sm outline-none"
                        value={searchInput}
                        onChange={handleInputQueryChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>

                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                      {activeTab === 'owners' && (
                        currentOwners.buckets.map((owner) => (
                          <label key={owner} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={searchParams.owners.includes(owner.key)}
                              onChange={() => handleOwnerChange(owner.key)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-0"
                            />
                            <span className={searchParams.owners.includes(owner.key) ? "text-blue-600 font-medium" : ""}>
                              {owner.key}
                            </span>
                          </label>
                        ))
                      )}
                      {activeTab === 'lawFirms' && (
                        lawFirms.buckets.map((firm) => (
                          <label key={firm} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={searchParams.law_firms.includes(firm.key)}
                              onChange={() => setSearchParams(prev => ({
                                ...prev,
                                law_firms: prev.law_firms.includes(firm.key)
                                  ? prev.law_firms.filter(f => f !== firm.key)
                                  : [...prev.law_firms, firm.key]
                              }))}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-0"
                            />
                            <span className={searchParams.law_firms.includes(firm.key) ? "text-blue-600 font-medium" : ""}>
                              {firm.key}
                            </span>
                          </label>
                        ))
                      )}
                      {activeTab === 'attorneys' && (
                      attorneys.buckets.map((attorney) => (
                        <label key={attorney.key} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={searchParams.attorneys.includes(attorney.key)}
                            onChange={() =>
                              setSearchParams((prev) => ({
                                ...prev,
                                attorneys: prev.attorneys.includes(attorney.key)
                                  ? prev.attorneys.filter((a) => a !== attorney.key)
                                  : [...prev.attorneys, attorney.key],
                              }))
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-0"
                          />
                          <span className={searchParams.attorneys.includes(attorney.key) ? "text-blue-600 font-medium" : ""}>
                            {attorney.key} 
                          </span>
                        </label>
                      ))
                      
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-5 w-full rounded-xl shadow-customShadow5">
                    <h3 className="text-lg font-semibold mb-3">Display</h3>
                    <div className="flex gap-2 bg-[#F1F1F1] rounded-xl p-4">
                      <button
                        onClick={() => setView("grid")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === "grid" ? "bg-white text-black shadow-customShadow5" : "text-gray-700"}`}
                      >
                        List View
                      </button>
                      <button
                        onClick={() => setView("list")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === "list" ? "bg-white text-black shadow-customShadow5" : "text-gray-700"}`}
                      >
                       Grid View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default Landing;