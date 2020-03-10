import React, { useState } from 'react';
import { BASE_URL, KEY } from './constants';

interface NewVisitorModalProps {
  modalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  fetchEntries: () => void;
};

const NewVisitorModal = ({ modalOpen, setModalOpen, fetchEntries }: NewVisitorModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [notes, setNotes] = useState("");
  const [invalidations, setInvalidations] = useState([] as ReadonlyArray<string>);

  const resetState = () =>{
    setFirstName("");
    setLastName("");
    setNotes("");
    setInvalidations([]);
  };

  const addVisitor = () => {
    if (invalidations.length === 0) {
      const body = {
        data: {
          type: "entries",
          attributes: {
            name: `${firstName} ${lastName}`,
            notes: notes
          }
        }
      }
      fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          'X-Api-Key': KEY,
          'Content-Type': 'application/json'
        }
      }).then((response: Response) => {
        if (response.ok) {
          setModalOpen(false);
          fetchEntries();
          resetState();
        }
      });
    }
  };

  return (
    <div className={(modalOpen ? "" : "hidden ") + "modal container p-8 border flex flex-col"}>
      <div className="p-2">New Visitor</div>
      <div className="p-2 text-xs">Let's gather some information about this guest!</div>
      <div className="flex justify-start">
      <div className='flex-1 m-2'>
          <input
            type="text"
            className={(invalidations.includes('firstName') ? 'error-border ' : '') + 'p-2 text-sm border w-full'}
            placeholder="First Name (Required)"
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => setInvalidations(firstName === "" ? invalidations.concat('firstName') : invalidations.filter(x => x !== 'firstName'))}
            value={firstName}
          />
          {invalidations.includes('firstName') && <div className='text-xs red'>This field is required.</div>}
        </div>
        <div className='flex-1 m-2'>
          <input
            type="text"
            className={(invalidations.includes('lastName') ? 'error-border ' : '') + 'p-2 text-sm border w-full'}
            placeholder="Last Name (Required)"
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => setInvalidations(lastName === "" ? invalidations.concat('lastName') : invalidations.filter(x => x !== 'lastName'))}
            value={lastName}
          />
          {invalidations.includes('lastName') && <div className='text-xs red'>This field is required.</div>}
        </div>
      </div>
      <textarea
        className="p-2 text-sm border m-2"
        placeholder="Notes"
        onChange={(e) => setNotes(e.target.value)}
        value={notes}
      />
      <div className="flex justify-center">
        <button className="btn btn--outline ml-2" onClick={() => {
          setModalOpen(false);
          resetState();
          }}>
          Cancel
        </button>
        <button className="btn btn--brand ml-2" onClick={addVisitor}>
          Save
        </button>
      </div>
    </div >
  );
};

export default NewVisitorModal;
