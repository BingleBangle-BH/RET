import { VStack, Button, Image, Text, SimpleGrid } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import TokenCard from "./TokenCard";
import { useState, useEffect } from "react";

const Wallets = () => {
  const { select, wallets, publicKey, disconnect } = useWallet();
  const [mintAddresses, setMintAddresses] = useState<string[]>([]);

  useEffect(() => {
    if (publicKey) {
      fetch("http://localhost:5000/getAccounts")
        .then((res) => res.text())
        .then((addresses) => setMintAddresses(addresses.split(',')));
    } else {
      setMintAddresses([]);
    }
  }, [publicKey]);

  return !publicKey ? (
    <VStack gap={4}>
      {wallets.filter((wallet) => wallet.readyState === "Installed").length > 0 ? (
        wallets
          .filter((wallet) => wallet.readyState === "Installed")
          .map((wallet) => (
            <Button
              key={wallet.adapter.name}
              onClick={() => select(wallet.adapter.name)}
              w="64"
              size="lg"
              fontSize="md"
              leftIcon={
                <Image
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  h={6}
                  w={6}
                />
              }
            >
              {wallet.adapter.name}
            </Button>
          ))
      ) : (
        <Text>No wallet found. Please download a supported Solana wallet</Text>
      )}
    </VStack>
  ) : (
    <VStack gap={4}>
      <Text>{publicKey.toBase58()}</Text>
      <SimpleGrid columns={3} spacing={4}>
        {mintAddresses.map((mintAddress) => (
          <TokenCard key={mintAddress} mintAddress={mintAddress} />
        ))}
      </SimpleGrid>
      <Button onClick={disconnect}>disconnect wallet</Button>
    </VStack>
  );
};

export default Wallets;
