import React, { useState, useEffect } from "react";

//COMPONENTS
import TimeLine from "components/Shared/TimeLine/TimeLine";
import Loading from "components/Shared/Loading/Loading";

//ui
import Pagination from "@material-ui/lab/Pagination";

//HOOKS
import usePagination from "hooks/usePagination";

//SERVICES
import { getDetailLogSession } from "services/affiliates";

export default function ModalDetailLogAppMobile({ idLog, userId }) {
  const itemsPerPage = 5;
  const { currentPage, handleChangePage, pages, setPages } =
    usePagination(itemsPerPage);

  const [logs, setLogs] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    getDetailLogSession(idLog, userId, currentPage, itemsPerPage).then(
      ({ data }) => {
        if (
          data &&
          data.data &&
          data.status === "success" &&
          data.data.items.length > 0
        ) {
          setLogs(data.data.items);
          setPages(data.data.total_items);
        } else {
          setLogs([]);
        }
        setLoad(false);
      }
    );
  }, [currentPage]);

  return (
    <div>
      {load ? (
        <Loading />
      ) : (
        <>
          {logs &&
            logs.length > 0 &&
            logs.map((log, idx) => (
              <TimeLine
                key={`log-${idx}`}
                time={log.created_at}
                text={`${log.session_name} - ${log.exercise_name}`}
                isReason={true}
              />
            ))}
          <div className="d-flex justify-content-end mt-3">
            <Pagination
              count={pages}
              page={currentPage}
              onChange={handleChangePage}
              size="large"
            />
          </div>
        </>
      )}
    </div>
  );
}
