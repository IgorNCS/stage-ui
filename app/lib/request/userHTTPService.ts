import { AxiosPromise } from "axios";
import { axiosApi } from "../axios";
import Cookies from "js-cookie";
interface IUserHTTPService {
  getAll: (userGetAll: IUserGetAll) => Promise<AxiosPromise>;

  getOne: (areaId: string) => Promise<AxiosPromise>;
  getNames: () => Promise<AxiosPromise>;
  updateUser: (userUpdate: any, id: string) => Promise<AxiosPromise>;
  getEmployees: (areaId: string) => Promise<AxiosPromise>;
}

interface IUserGetAll {
  page?: number;
  limit?: number;
  initialDate?: string;
  finalDate?: string;
  name?: string;
  role?: string;
  areaId?: string;
}

const UserHTTPService: any = {
  getAll: function (userGetAll?: IUserGetAll): Promise<AxiosPromise<any>> {
    const params = new URLSearchParams();

    if (userGetAll) {
      const { page, limit, initialDate, finalDate, name, role, areaId } =
        userGetAll;
      if (page) params.append("page", String(page));
      if (limit) params.append("limit", String(limit));
      if (initialDate) params.append("initialDate", initialDate);
      if (finalDate) params.append("finalDate", finalDate);
      if (name) params.append("name", name);
      if (role) params.append("role", role);
      if (areaId) params.append("areaId", areaId);
    }
    const token = Cookies.get("access_token");
    return axiosApi.get(`/user?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getOne: function (userId: string): Promise<AxiosPromise<any>> {
    const token = Cookies.get("access_token");
    return axiosApi.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateUser: function (
    updateUser: any,
    id: string
  ): Promise<AxiosPromise<any>> {
    const token = Cookies.get("access_token");
    return axiosApi.patch(`/user/${id}`, updateUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getNames: function (): Promise<AxiosPromise<any>> {
    return axiosApi.get(`/user/names`, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjM2Y2MDExOS0yOTM3LTQ0ZDUtYWY4Yi1kNTAwN2I1YjI5NGEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQyOTE2NTU0LCJleHAiOjE3NDMwMDI5NTR9.W5mDWNtzLeRJqalGmughDrlRuumL_FeK9Um1DjSqil4`,
      },
    });
  },

  getEmployees: function (userId: string): Promise<AxiosPromise<any>> {
    return axiosApi.get(`/user/${userId}/employers`, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjM2Y2MDExOS0yOTM3LTQ0ZDUtYWY4Yi1kNTAwN2I1YjI5NGEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQyOTE2NTU0LCJleHAiOjE3NDMwMDI5NTR9.W5mDWNtzLeRJqalGmughDrlRuumL_FeK9Um1DjSqil4`,
      },
    });
  },
};

export default UserHTTPService;
