import React from 'react';

const Header = ({ category, title }) => (
  <div className=" mb-5">
    <p className="text-lg text-slate-700">{category}</p>
    <p className="text-2xl font-extrabold tracking-tight text-slate-900">
      {title}
    </p>
  </div>
);

export default Header;