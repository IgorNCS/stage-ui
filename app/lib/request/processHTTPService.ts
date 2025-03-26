import { AxiosPromise } from "axios";
import { axiosApi } from "../axios";
import Cookies from "js-cookie";
interface IProcessHTTPService {
  create: (areaId: string, areaCreate: IProcessCreate) => Promise<AxiosPromise>;
  getAll: (processGetAll?: IProcessGetAll) => Promise<AxiosPromise>;

  getOne: (processId: string) => Promise<AxiosPromise>;
}

interface IProcessCreate {
  name: string;
  description?: string;
  systems_tools?: string[];
  associated_documentation?: string[];
  responsible_people?: string[];
  process_parent?: string;
  documentation?: string;
}

interface IProcessGetAll {
  page?: number;
  limit?: number;
  initialDate?: string;
  finalDate?: string;
  search?: string;
  areaId?: string;
}

const ProcessHTTPService: IProcessHTTPService = {
  getAll: function (
    processGetAll?: IProcessGetAll
  ): Promise<AxiosPromise<any>> {
    const params = new URLSearchParams();
    if (processGetAll) {
      const { page, limit, initialDate, finalDate, areaId } = processGetAll;
      if (initialDate) params.append("initialDate", initialDate);
      if (finalDate) params.append("finalDate", finalDate);
      if (page) params.append("page", String(page));
      if (limit) params.append("limit", String(limit));
      if (areaId) params.append("areaId", areaId);
    }
    const token = Cookies.get("access_token");
    return axiosApi.get(`/process?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getOne: function (processId: string): Promise<AxiosPromise<any>> {
    const token = Cookies.get("access_token");
    return axiosApi.get(`/process/${processId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  create: function (
    areaId: string,
    processCreate: IProcessCreate
  ): Promise<AxiosPromise> {
    const token = Cookies.get("access_token");
    return axiosApi.post(`/process/${areaId}`, processCreate, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  
};

export default ProcessHTTPService;
