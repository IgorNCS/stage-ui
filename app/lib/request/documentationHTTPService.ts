import { AxiosPromise } from "axios";
import { axiosApi } from "../axios";
import Cookies from "js-cookie";

interface IDocumentationHTTPService {
  getAll: (
    page?: number,
    limit?: number,
    initialDate?: string,
    finalDate?: string,
    areaId?: string
  ) => Promise<AxiosPromise>;
  create: (areaCreate: IDocumentCreate) => Promise<AxiosPromise>;
  getOne: (documentationId: string) => Promise<AxiosPromise>;
}

export interface IDocumentCreate {
  name: string;
  documentText: string;
  userId: string;
  url_image?: string;
  tools?: string[];
  areas?: string[];
  processes?: string[];
}

const DocumentationHTTPService: IDocumentationHTTPService = {
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
    console.log(areaId);
    return axiosApi.get(`/documentation?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });
  },

  getOne: function (documentationId: string): Promise<AxiosPromise<any>> {
    return axiosApi.get(`/documentation/${documentationId}`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });
  },

  create(documentCreate: IDocumentCreate) {
    const token = Cookies.get("access_token");
    return axiosApi.post(`/documentation`, documentCreate, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default DocumentationHTTPService;
