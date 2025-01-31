window.function = async function(api_key, file_ids, name, expires_after, chunking_strategy, metadata) {
    // Validate API Key
    if (!api_key.value) {
        return "Error: OpenAI API Key is required.";
    }

    // Parse JSON values if provided
    const parseJson = (input, fieldName) => {
        if (!input || !input.value) return undefined;
        try {
            return JSON.parse(input.value);
        } catch (e) {
            return `Error: Invalid JSON format for ${fieldName}.`;
        }
    };

    const fileIdsValue = parseJson(file_ids, "file_ids");
    const expiresAfterValue = parseJson(expires_after, "expires_after");
    const chunkingStrategyValue = parseJson(chunking_strategy, "chunking_strategy");
    const metadataValue = parseJson(metadata, "metadata");

    // Construct request payload
    const payload = {};

    if (fileIdsValue) payload.file_ids = fileIdsValue;
    if (name.value) payload.name = name.value;
    if (expiresAfterValue) payload.expires_after = expiresAfterValue;
    if (chunkingStrategyValue) payload.chunking_strategy = chunkingStrategyValue;
    if (metadataValue) payload.metadata = metadataValue;

    // API endpoint URL
    const apiUrl = "https://api.openai.com/v1/vector_stores";

    // Make API request
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key.value}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return `Error ${response.status}: ${errorData.error?.message || "Unknown error"}`;
        }

        // Parse and return the response
        const responseData = await response.json();
        return JSON.stringify(responseData, null, 2);

    } catch (error) {
        return `Error: Request failed - ${error.message}`;
    }
};
