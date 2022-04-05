import { useState, useCallback } from "react";

function usePagination(itemsPage=10) {
    const itemsPerPage = itemsPage
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPagesFunc] = useState(1)

    const setPages = useCallback((total_items) => {
        setPagesFunc(Math.ceil(total_items / itemsPerPage))
    }, [itemsPerPage])

    const handleChangePage = (e, p) => {
        setCurrentPage(p);
    };

    return { currentPage, handleChangePage, pages, setPages };
}

export default usePagination;