import Head from "next/head";
import { prisma } from "./api/prisma";
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Textarea,
  Heading,
  HStack,
  Spacer,
  Button,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { SaveIcon } from "../components/icons";

const GeneratePDF = dynamic(() => import("../components/generate-pdf"), {
  ssr: false,
});

const Home = ({ domande }) => {
  const [testData, setTestData] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      domande.map((domanda) => {
        setTestData((state) => [
          ...state,
          { domanda: domanda.testo, risposta: "" },
        ]);
      });
      setLoaded(true);
    }
  }, []);

  const indicazione =
    "Leggere con attenzione il testo e rispondere alle seguenti domande con un numero di parole compreso tra 40 e 80. Indicare al termine di ogni risposta il numero di parole utilizzato.Se nella risposta sono presenti acronimi, indicare dopo ogni acronimo la sua spiegazione tra parentesi quadre [].";

  const logValue = () => {
    console.log(testData);
  };

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
            <Button
              aria-label="Salva file"
              bg="blue.500"
              leftIcon={<SaveIcon />}
              onClick={logValue}
            >
              Salva
            </Button>
            <GeneratePDF data={testData} indicazione={indicazione} />
          </HStack>
          <Text>{indicazione}</Text>
          {domande ? (
            domande.map((domanda, index) => {
              return (
                <Domanda
                  key={index}
                  testoDomanda={domanda.testo}
                  index={index + 1}
                  setTestData={setTestData}
                  testData={testData}
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
};

export default Home;

const Domanda = ({ index, testoDomanda, testData, setTestData }) => {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleTextInput = (item_id, e) => {
    let inputValue = e.target.value;
    let valueToCount = inputValue.replace(/\[[^()]*\]/g, "");

    setText(inputValue);
    setWordCount(
      valueToCount === "" ? 0 : (valueToCount.split(/([\S])+/).length - 1) / 2
    );

    let newData = [...testData];
    newData[item_id - 1] = { domanda: testoDomanda, risposta: inputValue };
    setTestData(newData);
  };

  return (
    <Box py={4}>
      <Text fontSize={18}>
        {index}. {testoDomanda}
      </Text>
      <Textarea
        value={text}
        onChange={(e) => handleTextInput(index, e)}
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

export async function getServerSideProps() {
  const domande = await prisma.domande.aggregateRaw({
    pipeline: [{ $sample: { size: 9 } }],
  });
  return {
    props: {
      domande: JSON.parse(JSON.stringify(domande)),
    },
  };
}
