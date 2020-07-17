import React from "react";
import ReactTimeAgo from "react-time-ago/modules/ReactTimeAgo";

function Announcement(props) {
  const entry = props.entry

  return (
    <div key={entry.href} className="p-5 border-b hover:bg-gray-100">
      <a href={entry.href} className="block mb-3 text-sm leading-loose">
        {entry.text}
      </a>
      <div className="flex font-bold text-xs text-center md:items-center md:flex-row flex-col items-start">
        <div className="bg-indigo-500 text-white px-3 py-1 rounded-full md:mr-3 md:mb-0 mb-2">
          <ReactTimeAgo date={new Date(entry.date)} locale="el"/>
        </div>
        <div className="bg-indigo-500 text-white px-3 py-1 rounded-full">
          {entry.region}
        </div>
      </div>
    </div>
  )
}

export default Announcement;