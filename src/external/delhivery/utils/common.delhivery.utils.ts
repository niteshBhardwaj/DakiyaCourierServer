import jsonata from "jsonata";

export const mappingEvaluate = async (mapping: string, data: any) => {
    const expression = jsonata(mapping);
    const payload = await expression.evaluate(data);
    return payload;
}