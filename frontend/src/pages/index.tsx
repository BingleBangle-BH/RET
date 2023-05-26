import { Heading, VStack, Text, Image, HStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const Wallets = dynamic(() => import("../components/Wallets"), { ssr: false });

export default function IndexPage() {
  return (
    <VStack gap={8} mt={16}>
      <Image src="/images/RET - animate (large).gif" boxSize={400}/>
      <Heading fontSize='5xl' color="#69ecff" css={{fontFamily: "Lucida Handwriting"}}>Welcome !</Heading>
      <VStack>
        <HStack>
          <Text fontSize='2xl' color='white' fontFamily='Verdana' css={{textAlign: "center"}}>
            Connect to your wallet &#x1F4BC; and start to purchase Renewable Energy
          </Text>
          <Text fontSize='3xl' color="#bf9000" fontWeight='bold' css={{display: "inline"}}> NFTs</Text>
        </HStack>
        <Text fontSize='2xl' color='white' fontFamily='Verdana' css={{textAlign: "center"}}>
          to offset your electricity bill &#x1F4E8;
        </Text>
      </VStack>
      <Wallets />
      <Text> </Text>
    </VStack>
  );
}