import React from "react";
import { useHistory } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// utils
import { formatDateToHHMMSS } from "utils/misc";

export const CustomBarChart = ({ data }) => {
  const history = useHistory();

  function getTwentyFourHourTime(amPmString) {
    var d = new Date("1/1/2013 " + amPmString);
    return formatDateToHHMMSS(d);
  }

  const handleChange = (event) => {
    let hourBarChar =
      event && event.activePayload?.map((x) => x.payload)[0].hour;
    let MilitarHourBarChar = getTwentyFourHourTime(hourBarChar);

    if (event && hourBarChar !== 0) {
      history.push(`/maximum-capacity?hourBar=${MilitarHourBarChar}`);
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        onClick={(e) => handleChange(e)}
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="hour"
          interval={data && data.length > 8 ? 10 : 2}
          angle={0}
        />
        <YAxis />
        <Tooltip />

        <Bar dataKey="total" fill="#8D33D3" />
      </BarChart>
    </ResponsiveContainer>
  );
};
