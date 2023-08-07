import React from 'react';

const MembershipCard = ({ content, title }) => (
  <div className=" mb-3">
    <a href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-700 dark:hover:bg-gray-700">
    <h3 class="mb-2 text-l font-bold tracking-tight text-gray-800 dark:text-white">{title}</h3>
 {content!=undefined? content.map((sr)=>(<p class="font-normal text-gray-700 dark:text-gray-400">{sr.ServiceName+" ( Duration"+sr.Duration+" Min, Balance: "+sr.count+")"}</p>)):<div/>}
    </a>
  </div>
);

export default MembershipCard;