export default function parse(obj: { [key: string]: string }) {
    const res: { [key: string]: { id: string, defaultMessage: string } } = {};
    Object.keys(obj).forEach((name) => {
        res[name] = {
            id: `mdln.io/messages/${name}`,
            defaultMessage: obj[name],
        };
    });
    return res;
};