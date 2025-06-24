'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { GelatoRelay } from '@gelatonetwork/relay-sdk';
import AutoRebalancerABI from '../abi/AutoRebalancer.json';

// Fix global window typing for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

const contractAddress = "0x0A76f4E04F17a2672F731FdEf7a03463a0DdC5eB";
const GELATO_API_KEY = process.env.NEXT_PUBLIC_GELATO_SPONSOR_API_KEY as string;

const relay = new GelatoRelay();

export default function Balancer() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [status, setStatus] = useState<{ loading: boolean; message: string; isError: boolean }>({ loading: false, message: '', isError: false });
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [priceFeedId, setPriceFeedId] = useState<string>('');
  const [automatorAddress, setAutomatorAddress] = useState<string>('');

  const [capitalAmount, setCapitalAmount] = useState<string>('100');
  const [allocations, setAllocations] = useState<Array<{ token: string; percentage: string }>>([{ token: '', percentage: '' }]);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    } else {
      setStatus({ loading: false, message: 'Please install MetaMask.', isError: true });
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    try {
      const newSigner = await provider.getSigner();
      const newAccount = await newSigner.getAddress();
      const network = await provider.getNetwork();

      setSigner(newSigner);
      setAccount(newAccount);
      setChainId(network.chainId);

      const newContract = new ethers.Contract(contractAddress, AutoRebalancerABI.abi, newSigner);
      setContract(newContract);

      const owner = await newContract.owner();
      setIsOwner(owner.toLowerCase() === newAccount.toLowerCase());
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setStatus({ loading: false, message: 'Wallet connection failed.', isError: true });
    }
  };

  const handleAllocationChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const values = [...allocations];
    values[index][event.target.name as 'token' | 'percentage'] = event.target.value;
    setAllocations(values);
  };

  const addAllocationField = () => setAllocations([...allocations, { token: '', percentage: '' }]);

  const removeAllocationField = (index: number) => {
    const values = [...allocations];
    values.splice(index, 1);
    setAllocations(values);
  };

  const createRelayRequest = (target: string, data: string) => {
    if (!chainId) throw new Error('Chain ID not ready');
    return { chainId, target, data };
  };

  const handleRegisterToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isOwner || !chainId) return;

    try {
      const { data } = await contract.registerToken.populateTransaction(tokenSymbol, tokenAddress, priceFeedId);
      const request = createRelayRequest(contractAddress, data);
      const { taskId } = await relay.sponsoredCall(request, GELATO_API_KEY);
      setStatus({ loading: false, message: `Token registered (Task ID: ${taskId})`, isError: false });
    } catch (err: any) {
      console.error(err);
      setStatus({ loading: false, message: err.message, isError: true });
    }
  };

  const handleSetAutomator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !isOwner || !chainId) return;

    try {
      const { data } = await contract.setAutomator.populateTransaction(automatorAddress);
      const request = createRelayRequest(contractAddress, data);
      const { taskId } = await relay.sponsoredCall(request, GELATO_API_KEY);
      setStatus({ loading: false, message: `Automator set (Task ID: ${taskId})`, isError: false });
    } catch (err: any) {
      console.error(err);
      setStatus({ loading: false, message: err.message, isError: true });
    }
  };

  return <div>x</div>;
}
