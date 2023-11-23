import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../components/Bagpipes/hooks';
import { listChains, listRelayChains } from '../../Chains/ChainsInfo';
import { listParachainsConnectedToRelay, polkadotGetLeaseTime } from '../../Chains/Helpers/XcmHelper';
import ThemeContext from '../../contexts/ThemeContext';
import './Parachains.scss';

function Parachains() {
    const theme = React.useContext(ThemeContext);
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
        <div className={`${theme}`}>
        <div className="bagpipes-container bg-gray-300">
            <div className="header">
                <h1 className="title">Parachains</h1>
            </div>
            <table className="bagpipes-table">
                <thead>
                    <tr>
                        <th className="table-header">Chain Name</th>
                        <th className="table-header">Relay Chain</th>
                        <th className="table-header">Lease Period</th>
                        <th className="table-header">HRMP Channels</th>
                    </tr>
                </thead>
                <tbody>
                    {parachains.map((parachain, index) => (
                        <tr key={index}>
                            <td className="table-cell">{parachain.display}</td>
                            <td className="table-cell">{parachain.relayChain}</td>
                            <td className="table-cell">{parachain.leasePeriod}</td>
                            <td className="table-cell">{parachain.hrmpChannels}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
}

export default Parachains;
