import React, { useState, useEffect } from 'react';
import Logs from './Logs';
import Header from './Header';
import NewVisitorModal from './NewVisitorModal';
import { BASE_URL, KEY } from './constants';
import EntryType from './entry';
import './App.scss';
import camelcaseKeysDeep from 'camelcase-keys-deep';

const App = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState([] as ReadonlyArray<EntryType>);
  const [modalOpen, setModalOpen] = useState(false);

  // get and set entries
  const fetchEntries = () => {
    fetch(BASE_URL, {
      headers: {
        'X-Api-Key': KEY
      }
    })
      .then((response: Response) => response.json())
      .then((json) => {
        const camelCaseJson = camelcaseKeysDeep(json) as any;
        const newEntries = camelCaseJson.data.map((entry: any) => ({
          id: entry.id.toString(),
          ...entry.attributes,
        }));
        setEntries(newEntries);
      });
  };

  // initial fetch
  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="container mx-auto mt-12 p-8 border min-h-screen max-w-3xl">
      <NewVisitorModal modalOpen={modalOpen} setModalOpen={setModalOpen} fetchEntries={fetchEntries} />
      <Header setSearch={setSearch} setModalOpen={setModalOpen} />
      <Logs searchValue={search} entries={entries} fetchEntries={fetchEntries}/>
    </div >
  );
}

export default App;
