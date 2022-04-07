import Head from "next/head";
import { prisma } from "./api/prisma";
import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Textarea,
  Heading,
  HStack,
  Spacer,
} from "@chakra-ui/react";

export default function Home({ domande }) {
  return (
    <>
      <Head>
        <title>Prova Informatica</title>
      </Head>
      <Box minH="100vh" bg={"#121212"} color={"#e1e1e0"}>
        <Flex
          direction={"column"}
          alignSelf="center"
          w="100%"
          maxW={"3xl"}
          mx="auto"
          p={4}
        >
          <HStack>
            <Heading>Prova Informatica</Heading>
            <Spacer />
          </HStack>
          <Text>
            Leggere con attenzione il testo e rispondere alle seguenti domande
            con un numero di parole compreso tra 40 e 80. Indicare al termine di
            ogni risposta il numero di parole utilizzato. Se nella risposta sono
            presenti acronimi, indicare dopo ogni acronimo la sua spiegazione
            tra parentesi quadre [ ].
          </Text>
          {domande ? (
            domande.map((domanda, index) => {
              return (
                <Domanda
                  key={domanda._id}
                  testoDomanda={domanda.testo}
                  index={index + 1}
                />
              );
            })
          ) : (
            <></>
          )}
        </Flex>
      </Box>
    </>
  );
}

const Domanda = ({ index, testoDomanda }) => {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleTextInput = (e) => {
    let inputValue = e.target.value;
    setText(inputValue);
    let valueToCount = inputValue.replace(/\[[^()]*\]/g, "");
    setWordCount(
      valueToCount === "" ? 0 : (valueToCount.split(/([\S])+/).length - 1) / 2
    );
  };

  return (
    <Box py={4}>
      <Text fontSize={18}>
        {index}. {testoDomanda}
      </Text>
      <Textarea
        value={text}
        onChange={handleTextInput}
        minH={44}
        resize="none"
        bg="#1e1f1f"
        borderColor={"transparent"}
      />
      <Text
        fontSize={16}
        color={wordCount < 40 || wordCount > 80 ? "red" : "green"}
      >
        Parole:{" "}
        <Text fontWeight="bold" as="span">
          {wordCount}
        </Text>
      </Text>
    </Box>
  );
};

export async function getStaticProps() {
  const domande = await prisma.domande.aggregateRaw({
    pipeline: [{ $sample: { size: 9 } }],
  });
  return {
    props: {
      domande: JSON.parse(JSON.stringify(domande)),
    },
  };
}
