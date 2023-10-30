import React from "react";

const JSONDisplay: React.FC<{ data: any }> = ({ data }) => {
    return (
        <div className="json-container">
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default JSONDisplay;
