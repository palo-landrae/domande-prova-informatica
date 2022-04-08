import Head from "next/head";
import { Flex, Input, Heading, Box, Text, Button } from "@chakra-ui/react";
import { useState, useRef } from "react";

export default function Login() {
  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState([]);

  const handleLogin = async () => { };
  return (
    <>
      <Head>
        <title>5EINF - Login</title>
      </Head>
      <Box minH="100vh" bg={"#121212"} color={"#e1e1e0"}>
        <form onSubmit={handleLogin}>
          <Flex direction="column" minH="100vh" mx="auto" maxW="xl">
            <Heading mt={12}>5EINF Prova Informatica</Heading>
            <Text>Nome</Text>
            <Input
              value={nome}
              onChange={(text) => setNome(text.value)}
              isRequired
            />
            <Text>Password</Text>
            <Input
              type="password"
              value={password}
              onChange={(text) => setPassword(text.value)}
              isRequired
            />
            <Button as="button" type="submit" my={3} bg="blue.300">
              Login
            </Button>
          </Flex>
        </form>
      </Box>
    </>
  );
}
