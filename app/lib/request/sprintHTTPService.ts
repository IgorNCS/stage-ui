import { AxiosPromise } from "axios";
import { axiosApi } from "../axios";

interface ISprintHTTPService {
  getAll: (
    page?: number,
    limit?: number,
    initialDate?: string,
    finalDate?: string,
    areaId?: string
  ) => Promise<AxiosPromise>;

  getOne: (sprintId: string) => Promise<AxiosPromise>;
}

const SprintHTTPService: ISprintHTTPService = {
  getAll: function (
    page?: number,
    limit?: number,
    initialDate?: string,
    finalDate?: string,
    areaId?: string
  ): Promise<AxiosPromise<any>> {
    const params = new URLSearchParams();
    if (initialDate) params.append("initialDate", initialDate);
    if (finalDate) params.append("finalDate", finalDate);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    if (areaId) params.append("area", areaId);
    console.log(areaId)
    return axiosApi.get(`/sprint?${params.toString()}`,{
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });
  },

  getOne: function (sprintId: string): Promise<AxiosPromise<any>> {
    return axiosApi.get(`/sprint/${sprintId}`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });
  },
};

export default SprintHTTPService;

