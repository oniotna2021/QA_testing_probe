import { useEffect, useState } from "react";

const useAutocomplete = (listData, value) => {
  const [objectValue, setObjectValue] = useState(null);

  useEffect(() => {
    if (listData.length > 0) {
      const findObject = listData.find((i) => Number(i.id) === Number(value));

      if (Boolean(findObject)) {
        setObjectValue(listData.find((i) => Number(i.id) === Number(value)));
        return;
      }

      setObjectValue(null);
    }
  }, [value, listData]);

  return [objectValue];
};

export default useAutocomplete;
