import React from 'react';
import { ENVOY_LOGO } from './constants';

interface HeaderProps {
  setSearch: (value: string) => void;
  setModalOpen: (isOpen: boolean) => void;
};

const Header = ({ setSearch, setModalOpen }: HeaderProps) => (
  <div className="clearfix">
    <button className="btn btn--brand float-right ml-2" onClick={() => setModalOpen(true)}>
      <i className="fas fa-user"></i>&nbsp;&nbsp;New visitor
        </button>
    <input
      type="text"
      className="p-2 text-sm border float-right max-w-xs w-full"
      placeholder="Search"
      onChange={(e) => setSearch(e.target.value)} />
    <img src={ENVOY_LOGO} alt="Envoy Logo" width="31" className="py3 block" />
  </div>
);

export default Header; 