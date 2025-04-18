const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*"
        },
        sepolia: {
            provider: () => new HDWalletProvider(
                "quiz depend egg mushroom today ecology impact shoot agent neutral devote buzz", // Thay bằng Secret Recovery Phrase từ MetaMask
                "https://sepolia.infura.io/v3/ca4967c0081f4d9d8d7b97581a492ecb"
                // "https://magical-clean-sun.ethereum-sepolia.quiknode.pro/56665dea01e95e51552fc1bf1a0ff3d0a4ac5949/"
                // "https://rpc.sepolia.org"
            ),
            network_id: 11155111, // Sepolia network ID
            gas: 4000000, // Giảm gas limit để tiết kiệm
            gasPrice: 10000000000   
        }, holesky: {
            provider: () => new HDWalletProvider(
                "quiz depend egg mushroom today ecology impact shoot agent neutral devote buzz",
                "https://holesky.infura.io/v3/ca4967c0081f4d9d8d7b97581a492ecb"
            ),
            network_id: 17000,
            gas: 4000000,
            gasPrice: 10000000000
        },
        base_sepolia: {
            provider: () =>
                new HDWalletProvider(
                    "quiz depend egg mushroom today ecology impact shoot agent neutral devote buzz",
                    'https://base-sepolia.infura.io/v3/ca4967c0081f4d9d8d7b97581a492ecb'
                ),
            network_id: 84532,     // Chain ID của Base Sepolia
            gas: 4000000,          // Tuỳ chỉnh gas
            gasPrice: 10000000000, // 20 Gwei
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        },

    },
    compilers: {
        solc: {
            version: "0.8.19"
        }
    }
};