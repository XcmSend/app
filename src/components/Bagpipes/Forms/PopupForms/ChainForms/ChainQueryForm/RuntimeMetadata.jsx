import React, { useEffect, useState } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { registry } from '@polkadot/react-api';
import { getRuntimeCalls } from '@polkadot/react-api/registry';

const MetadataComponent = () => {
    const { api } = useApi();
    const [metadata, setMetadata] = useState<any>(null);
    const [runtimeCalls, setRuntimeCalls] = useState<any>(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            const metadata = await api.rpc.state.getMetadata();
            setMetadata(metadata.toHuman());
        };

        fetchMetadata();
    }, [api]);

    useEffect(() => {
        if (metadata) {
            const lookupTypes = registry.lookup.types;
            const calls = getRuntimeCalls(api, lookupTypes);
            setRuntimeCalls(calls);
        }
    }, [metadata, api]);

    return (
        <div>
            <h1>Metadata</h1>
            <pre>{JSON.stringify(metadata, null, 2)}</pre>
            <h1>Runtime Calls</h1>
            <pre>{JSON.stringify(runtimeCalls, null, 2)}</pre>
        </div>
    );
}

export default MetadataComponent;