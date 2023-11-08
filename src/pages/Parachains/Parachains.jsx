import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../components/Bagpipes/hooks';
import { listChains, listRelayChains } from '../../Chains/ChainsInfo';
import { listParachainsConnectedToRelay, polkadotGetLeaseTime } from '../../Chains/Helpers/XcmHelper';

function Parachains() {
    const { hrmpChannels } = useAppStore((state) => ({
        hrmpChannels: state.hrmpChannels,
    }));

    const [parachains, setParachains] = useState([]);

    useEffect(() => {
        const fetchParachainsData = async () => {
            const chainlist = listChains(); // Assuming this function is available to list all chains
            const relayChains = listRelayChains(); // Assuming this function is available to list all relay chains

            let parachainsData = [];

            for (const relayChain of relayChains) {
                const connectedParachains = listParachainsConnectedToRelay(relayChain.name, chainlist);

                for (const parachain of connectedParachains) {
                    const leasePeriod = await polkadotGetLeaseTime(parachain.name);
                    console.log("Lease period", leasePeriod, parachain.name);
                    const channels = hrmpChannels[parachain.paraid] || [];
                    parachainsData.push({
                        relayChain: relayChain.name,
                        leasePeriod,
                        hrmpChannels: channels.join(', '), // Assuming you want to display them as a comma-separated list
                        ...parachain, // Spread other parachain details if needed
                    });
                }
            }

            setParachains(parachainsData);
            console.log("Parachains data", parachainsData);
        };

        fetchParachainsData();
    }, [hrmpChannels]);

    return (
        <div className="bg-gray-100 p-8 h-full">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold">Parachains</h1>
            </div>
            <table className="min-w-full leading-normal">
                <thead>
                    <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Chain Name                        
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Relay Chain
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Lease Period
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            HRMP Channels
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {parachains.map((parachain, index) => (
                        <tr key={index}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {parachain.display}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {parachain.relayChain}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {parachain.leasePeriod}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {parachain.hrmpChannels}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Parachains;
