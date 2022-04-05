import { useMemo } from "react";

import {regexEscape} from 'utils/misc';

const useSearchable = (data = [], searchText = "", searchProps) => {
    return useMemo(() => {
        const regex = new RegExp(regexEscape(searchText), 'i');
        return data.filter((item) =>
            searchProps(item).some((sp) => regex.test(sp))
        );
    }, [data, searchText, searchProps]);
};


export default useSearchable;