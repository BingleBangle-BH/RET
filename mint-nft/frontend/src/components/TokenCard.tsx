import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

const TokenCard = ({ mintAddress }: { mintAddress: string }) => {
  const { publicKey } = useWallet();
  const [isBought, setIsBought] = useState<boolean>(false);
  
  const buyNft = async () => {
    const res1 = await fetch(`http://localhost:5000/sendToken?mintaddress=${mintAddress}&walletaddress=${publicKey?.toBase58()}`);
    if (res1.ok) {
      const res2 = await fetch('http://localhost:5000/sendSol?price=3');
      if (res2.ok) {
        setIsBought(true);
      }
    }
  };
  
  if (isBought) return null;

  return (
    <VStack
      bg="gray.700"
      borderRadius="md"
      border="2px"
      borderColor="gray.800"
      p={4}
      spacing={4}
      alignItems="stretch"
      width="100%"
    >
      <Text>Renewable Energy | Solar</Text>
      <Text fontSize="sm" color="gray.400">{mintAddress}</Text>
      <Flex justifyContent="space-between" width="100%">
        <Button colorScheme="teal" onClick={buyNft}>
          Buy NFT
        </Button>
        <Button as="a" href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`} target="_blank" colorScheme="blue">
          View NFT
        </Button>
      </Flex>
    </VStack>
  );
};

export default TokenCard;
