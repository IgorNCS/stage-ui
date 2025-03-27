import { cookies } from "next/headers";
import { axiosApi } from "../../lib/axios";
import Sidebar from "../../Components/sidebar";
import SidebarWrapper from "../../Components/SidebarWrapper";
import { Box } from "@chakra-ui/react";


type Response = {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

const DashboardPage = () => {
  return (
    <div>
      <Box bg='tomato' w='100%' p={4} color='white'>
        This is the Box
      <SidebarWrapper />
      </Box>
      <h1>Olá!</h1>
    </div>
  );
};

export default DashboardPage;
