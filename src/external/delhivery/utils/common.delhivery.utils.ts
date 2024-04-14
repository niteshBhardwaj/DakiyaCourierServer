import jsonata from "jsonata";

export const mappingEvaluate = async (mapping: string, data: any) => {
    const expression = jsonata(mapping);
    const payload = await expression.evaluate(data);
    return payload;
}

export const parseJson = async (jsonString: string) => {
    try {
        const json = JSON.parse(jsonString);
        return json;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}