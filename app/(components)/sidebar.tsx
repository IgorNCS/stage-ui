"use client";

import {
  Box,
  Flex,
  Link,
  Avatar,
  Button,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";

export default function Sidebar({ userCookie }: { userCookie: string | null }) {
  const { isOpen, onClose } = useDisclosure(); // Mantenha useDisclosure()

  const router = useRouter();
  const pathname = usePathname();

  const bg = useColorModeValue("gray.900", "gray.100");
  const [useCookie, setUseCookie] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (userCookie) {
      try {
        const meuUser = JSON.parse(userCookie);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Erro ao analisar o cookie do usuário:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [userCookie]);

  const handleLogout = () => {
    Cookies.remove('user');
    Cookies.remove('token');
    setUseCookie('');
    setIsLoggedIn(false);
    router.push("/login");
  };

  if (!isLoggedIn) {
    return null;
  }

  let meuUser;
  try {
    meuUser = JSON.parse(userCookie);
  } catch (error) {
    console.error("Erro ao analisar o cookie do usuário:", error);
    return null;
  }

  return (
    <Box
      as="aside"
      position="fixed"
      top={0}
      left={0}
      w="250px"
      h="100vh"
      bg={bg}
      boxShadow="lg"
      p={4}
      display="flex"
      flexDirection="column"
      color={'gray.100'}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        py={4}
        px={4}
      >
        <Link 
        href="/" 
        // onClick={onClose} 
        margin={'auto'}>
          <Avatar
            name={meuUser.name}
            color='gray.900'
            bgColor='gray.100'
            _hover={{ bg: useColorModeValue("gray.500", "gray.500") }}
          />
        </Link>
      </Flex>

      <Box
        as="nav"
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        pt={4}
      >
        <Link
          href="/"
          // onClick={onClose}
          borderRadius="md"
          py={2}
          px={4}
          mb={2}
          _hover={{ bg: useColorModeValue("gray.500", "gray.500") }}
          fontWeight="bold"
          sx={{ color: pathname === "/" ? "blue.500" : undefined }}
        >
          Home
        </Link>

        {/* <Link
          href="/dashboard"
          onClick={onClose}
          borderRadius="md"
          py={2}
          px={4}
          mb={2}
          _hover={{ bg: useColorModeValue("gray.500", "gray.500") }}
          fontWeight="bold"
          aria-current={pathname === "/dashboard" ? "page" : undefined} 
        >
          Dashboard
        </Link> */}

        <Link
          href="/profile"
          // onClick={onClose}
          borderRadius="md"
          py={2}
          px={4}
          mb={2}
          _hover={{ bg: useColorModeValue("gray.500", "gray.500") }}
          fontWeight="bold"
          sx={{ color: pathname === "/profile" ? "blue.500" : undefined }}
        >
          Profile
        </Link>

        

        <Link
          href="/area"
          // onClick={onClose}
          borderRadius="md"
          py={2}
          px={4}
          mb={2}
          _hover={{ bg: useColorModeValue("gray.500", "gray.500") }}
          fontWeight="bold"
          sx={{ color: pathname === "/area" ? "blue.500" : undefined }}
        >
          Areas
        </Link>

        <Link
          href="/process"
          // onClick={onClose}
          borderRadius="md"
          py={2}
          px={4}
          mb={2}
          _hover={{ bg: useColorModeValue("gray.500", "gray.500") }}
          fontWeight="bold"
          sx={{ color: pathname === "/process" ? "blue.500" : undefined }}
        >
          Processos
        </Link>

        <Link
          href="/documentation"
          // onClick={onClose}
          borderRadius="md"
          py={2}
          px={4}
          mb={2}
          _hover={{ bg: useColorModeValue("gray.500", "gray.500") }}
          fontWeight="bold"
          sx={{ color: pathname === "/documentation" ? "blue.500" : undefined }}
        >
          Documentações
        </Link>

        {meuUser.role == 'ADMIN' && (
          <Link
            href="/users"
            // onClick={onClose}
            borderRadius="md"
            py={2}
            px={4}
            mb={2}
            _hover={{ bg: useColorModeValue("gray.500", "gray.500") }}
            fontWeight="bold"
            sx={{ color: pathname === "/users" ? "blue.500" : undefined }}
          >
            Usuários
          </Link>
        )}
      </Box>

      <Button
        onClick={handleLogout}
        variant="link"
        colorScheme="red"
        size="sm"
        mt={4}
      >
        Logout
      </Button>
    </Box>
  );
}