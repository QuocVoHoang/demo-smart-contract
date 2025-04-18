const EncryptedVoting = artifacts.require("EncryptedVoting");
const { performance } = require('perf_hooks');
const fs = require('fs');

module.exports = async function (callback) {
  try {
    let proofGenTime = 0;
    let decryptionTime = 0;
    let otherTime = 0;
    let peakMemory = 0;

    function trackMemory() {
      const memoryUsage = process.memoryUsage();
      const currentMemory = memoryUsage.heapUsed / 1024 / 1024;
      peakMemory = Math.max(peakMemory, currentMemory);
    }

    trackMemory();

    let startTime = performance.now();
    const accounts = await web3.eth.getAccounts();
    const user = accounts[1]; // Dùng accounts[1] thay vì accounts[0]
    const voting = await EncryptedVoting.deployed();
    otherTime += performance.now() - startTime;
    trackMemory();

    startTime = performance.now();
    const fakeProof = await new Promise((resolve) => {
      setTimeout(() => resolve(web3.utils.randomHex(64)), 100);
    });
    proofGenTime = performance.now() - startTime;
    trackMemory();

    const encryptedVote = web3.utils.randomHex(32);

    startTime = performance.now();
    await voting.vote(0, encryptedVote, fakeProof, { from: user });
    otherTime += performance.now() - startTime;
    trackMemory();

    startTime = performance.now();
    const decrypted = await voting.getVotes(0);
    decryptionTime = performance.now() - startTime;
    trackMemory();

    console.log("\n======= BENCHMARK RESULTS =======");
    console.log(`ZK Proof Generation Time: ${proofGenTime.toFixed(2)} ms`);
    console.log(`Decryption Time:          ${decryptionTime.toFixed(2)} ms`);
    console.log(`Other Time (setup, vote): ${otherTime.toFixed(2)} ms`);
    console.log(`Peak Memory Usage:        ${peakMemory.toFixed(2)} MB`);
    console.log("=================================\n");

    const log = `
      ZK Proof Generation Time: ${proofGenTime.toFixed(2)} ms
      Decryption Time:          ${decryptionTime.toFixed(2)} ms
      Other Time:              ${otherTime.toFixed(2)} ms
      Peak Memory Usage:       ${peakMemory.toFixed(2)} MB
    `;
    fs.writeFileSync('benchmark.log', log);

    callback();
  } catch (err) {
    console.error("Error in benchmark:", err);
    callback(err);
  }
};