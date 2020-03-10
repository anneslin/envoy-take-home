import React, { useEffect, useState } from 'react';
import EntryType from './entry';
import { KEY, SIGN_OUT_URL } from './constants';
import moment from 'moment';

enum Filters {
  none = 0,
  signedOut = 1,
  inOffice = 2
};

interface LogsProps {
  searchValue: string;
  entries: ReadonlyArray<EntryType>;
  fetchEntries: () => void;
};

const Logs = ({ searchValue, entries, fetchEntries }: LogsProps) => {
  const [signingOutIds, setSigningOutIds] = useState([] as ReadonlyArray<string>);
  const [displayEntries, setDisplayEntries] = useState(entries);
  const [filter, setFilter] = useState(Filters.none);

  useEffect(() => setDisplayEntries(entries), [entries]);
  // very basic search + filter filtering
  useEffect(() => {
    if (searchValue !== "") {
      const s = searchValue.toLowerCase()
      const searchResults = entries.filter(x =>
        (x.name.toLowerCase().includes(s)
        || x.notes.toLowerCase().includes(s)
        || (x.signOut && x.signOut.toLowerCase().includes(s)))
        && (filter === Filters.none || (filter === Filters.signedOut ? x.signOut : !x.signOut)));
      setDisplayEntries(searchResults);
    } else {
      setDisplayEntries(entries.filter(x => (filter === Filters.none || (filter === Filters.signedOut ? x.signOut : !x.signOut))));
    }
  }, [searchValue, entries, filter]);

  const toggleFilter = (f: Filters) => f === filter ? setFilter(Filters.none) : setFilter(f);

  const signOut = (id: string, idx: number) => {
    setSigningOutIds(signingOutIds.concat(id));
    const data = { data: { type: "entries", id: id } }
    fetch(SIGN_OUT_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'X-Api-Key': KEY,
        'Content-Type': 'application/json'
      }
    })
      .then((response: Response) => {
        if (!response.ok) {
          setSigningOutIds(signingOutIds.filter(x => x !== id));
          throw Error(response.statusText);
        }
        fetchEntries();

      }).catch((error) => {
        console.log(error);
    });
  };

  return (
    <div className="flex-grow h-screen overflow-y-scroll">
      <div className="mx-auto">
        <div className="mt-8">
          <div className="flex items-center">
            <div className="filterText">Filter By:</div>
            <div className={filter === Filters.signedOut ? 'filter selected' : 'filter'} onClick={() => toggleFilter(Filters.signedOut)}>Signed Out</div>
            <div className="filterText">|</div>
            <div className={filter === Filters.inOffice ? 'filter selected' : 'filter'} onClick={() => toggleFilter(Filters.inOffice)}>In Office</div>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest third">Name</th>
                <th className="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest third">Notes</th>
                <th className="text-sm font-semibold text-grey-darker p-1 bg-grey-lightest third">Signed out</th>
              </tr>
            </thead>
            <tbody className="align-baseline">
              {displayEntries.map((x, i) =>
                <tr key={x.id}>
                  <td className="p-2 border-t border-grey-light font-mono text-xs">{x.name}</td>
                  <td className="p-2 border-t border-grey-light font-mono text-xs">{x.notes}</td>
                  <td className="p-1 border-t border-grey-light font-mono text-xs">
                    {x.signOut && moment(x.signOut).format('lll')}
                    {x.signOut == null && (signingOutIds.includes(x.id)
                      ? <button className="btn disabled btn--smaller btn--outline">
                        Signing out <i className="fas fa-spinner"></i>
                      </button>
                      : <button className="btn btn--smaller btn--outline" onClick={() => signOut(x.id, i)}>
                        Sign out
                        </button>
                    )}

                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {displayEntries.length === 0 &&
            <div className="p-2 border-t border-grey-light font-mono text-xs text-center">No Entries{searchValue !== "" && ` for "${searchValue}"`}</div>
          }

          {/* <div className="mt-8 mb-8">
            <p className="mt-2">
              <div className="flex">
                <a href="#" className="mr-4 px-1">
                  <i className="fas fa-angle-left" />
                </a>
                <div className="flex text-center mr-4">
                  <span className="w-20">
                    1
              </span>
                  <span className="w-20">&nbsp;/&nbsp;</span>
                  <span className="w-20">
                    2
              </span>
                </div>
                <a href="#" className="mr-4 px-1">
                  <i className="fas fa-angle-right" />
                </a>
              </div>
            </p>
          </div> */}

        </div>
      </div>
    </div>
  );
}

export default Logs; 