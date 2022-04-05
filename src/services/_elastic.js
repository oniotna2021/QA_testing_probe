import { serverInstance } from './instance';

const searchElastic = (indexe, value) => {
    return serverInstance.post(`elastic/${indexe}`, value);
}

export {
    searchElastic,
}