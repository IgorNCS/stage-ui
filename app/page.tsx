"use client";
import { Box, Button, Center, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Flex
      className="min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 to-black text-white"
      direction="column"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg"
      >
        <Center>
          <Heading as="h1" size="3xl" className="font-bold">
            StageProcess
          </Heading>
        </Center>
        <Text className="mt-4 text-gray-300">
         Faça sua empresa crescer mais organizada
        </Text>
        <Box className="mt-6 flex justify-center gap-4">
          <Link href={"/login"}>
            <Button
              colorScheme="blue"
              variant="solid"
              size="lg"
              className="hover:bg-blue-500 transition"
            >
              Login
            </Button>
          </Link>

          <Link href={"/register"}>
            <Button
              colorScheme="green"
              variant="solid"
              size="lg"
              className="hover:bg-green-500 transition"
            >
              Register
            </Button>
          </Link>
        </Box>
      </motion.div>
    </Flex>
  );
}

