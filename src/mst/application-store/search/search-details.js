import { types, flow, getRoot } from "mobx-state-tree";
import { handleApiRequest } from "services/api/apiMethods";
import { BASE_URL } from "config/constants";
import { API_METHODS, snakeToCamelCaseObjectFormatter, TOAST_TYPE } from "common";
import moment from "moment";

// Sub-model for aggregation buckets (e.g., attorneys, class_codes, etc.)
const AggregationBucket = types.model("AggregationBucket", {
  docCount: types.optional(types.number, 0),
  key: types.optional(types.string, ""),
});

// Sub-model for aggregation metadata (buckets + additional fields)
const AggregationData = types.model("AggregationData", {
  buckets: types.optional(types.array(AggregationBucket), []),
  docCountErrorUpperBound: types.optional(types.number, 0),
  sumOtherDocCount: types.optional(types.number, 0),
});

// *** HERE IS HitSource ***
// Sub-model for the _source object inside each hit
const HitSource = types.model("HitSource", {
  registration_number: types.optional(types.string, ""),
  registration_date: types.optional(types.number, 0),
  filing_date: types.optional(types.number, 0),
  status_date: types.optional(types.number, 0),
  renewal_date: types.optional(types.number, 0),
  date_type: types.optional(types.string, ""),
  status_code: types.optional(types.number, 0),
  status_type: types.optional(types.string, ""),
  search_bar: types.optional(
    types.model({
      attorneys: types.optional(types.string, ""),
      law_firm: types.optional(types.string, ""),
      mark_identification: types.optional(types.string, ""),
      owner: types.optional(types.string, ""),
    }),
    {}
  ),
  startingLetter: types.optional(
    types.model({
      attorney: types.optional(types.string, ""),
      law_firm: types.optional(types.string, ""),
      mark_fame: types.optional(types.string, ""),
      owner: types.optional(types.string, ""),
    }),
    {}
  ),
  mark_identification: types.optional(types.string, ""),
  law_firm: types.optional(types.string, ""),
  law_firm_cleaned: types.optional(types.string, ""),
  attorney_name: types.optional(types.string, ""),
  attorney_name_cleaned: types.optional(types.string, ""),
  current_owner: types.optional(types.string, ""),
  current_owner_cleaned: types.optional(types.string, ""),
  mark_description_code: types.optional(types.array(types.string), []),
  mark_description_description: types.optional(types.array(types.string), []),
  first_use_anywhere_date: types.optional(types.number, 0),
  class_codes: types.optional(types.array(types.string), []),
  country: types.optional(types.string, ""),
  owner_location: types.optional(
    types.model({
      lat: types.optional(types.number, 0),
      lon: types.optional(types.number, 0),
    }),
    {}
  ),
  mark_status_key: types.optional(types.number, 0),
  is_lrapc: types.optional(types.boolean, false),
});

// Sub-model for each hit (including _id, _score, sort, and _source)
const Hit = types.model("Hit", {
  id: types.optional(types.string, ""), // _id
  index: types.optional(types.string, ""), // _index
  score: types.optional(types.number, 0), // _score
  sort: types.optional(types.array(types.frozen()), []), // sort array
  source: types.optional(HitSource, {}), // Uses HitSource here
});

const SearchDetails = types
  .model("SearchDetails", {
    // Explicit aggregation keys
    attorneys: types.optional(AggregationData, {}),
    classCodes: types.optional(AggregationData, {}),
    country: types.optional(AggregationData, {}),
    currentOwners: types.optional(AggregationData, {}),
    lawFirms: types.optional(AggregationData, {}),
    officeActions: types.optional(AggregationData, {}),
    // Hits use the Hit model
    hits: types.optional(types.array(Hit), []),
    totalHits: types.optional(types.number, 0),
  })
  .actions((self) => ({
    search: flow(function* search(data) {
      const { viewStore } = getRoot(self);
      const { apiStatusStore, toastStore } = viewStore;
      const { setIsLoadingStatus } = apiStatusStore;
      const { popToast } = toastStore;

      try {
        const url = `${BASE_URL}api/v3/us`;
        setIsLoadingStatus("search", false, false, true);
        const response = yield handleApiRequest({
          method: API_METHODS.POST,
          url,
          payload: data,
          headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            "Content-Type": "application/json",
            Origin: "http://localhost:3001",
            Priority: "u=1, i",
            Referer: "http://localhost:3001/",
            "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": '"macOS"',
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          },
        });

        const formattedData = snakeToCamelCaseObjectFormatter(response?.data);
        console.info("Post search data api successful", formattedData);

        // Store aggregation data
        self.attorneys = formattedData.body.aggregations.attorneys;
        self.classCodes = formattedData.body.aggregations.class_codes;
        self.country = formattedData.body.aggregations.country;
        self.currentOwners = formattedData.body.aggregations.
        current_owners;
        self.lawFirms = formattedData.body.aggregations.law_firms;
        self.officeActions = formattedData.body.aggregations.office_actions;

        // Store hits with explicit mapping
        self.hits = formattedData.body.hits.hits.map((hit) => ({
          id: hit._id || "",
          index: hit._index || "",
          score: hit._score || 0,
          sort: hit.sort || [],
          source: hit._source || {},
        }));

        self.totalHits = formattedData.body.hits.total.value;

        setIsLoadingStatus("search", false, true, false);
        popToast("Search applied successfully!", TOAST_TYPE.SUCCESS);
        return response?.data;
      } catch (e) {
        console.error("Error in search data api", e);
       
        setIsLoadingStatus("search", true, false, false);
        popToast(
          "Something went wrong during the process. Please try again later",
          TOAST_TYPE.ERROR
        );
        throw e;
      }
    }),
  }));

export default SearchDetails;