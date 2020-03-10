import React from 'react';
import ReactDOM from 'react-dom';
import Logs from './Logs';
import TestRenderer from 'react-test-renderer';

it('renders Logs without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Logs searchValue={""} entries={[]} fetchEntries={() => {}}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

const entries = [
  {id: "1231", name: "Johnny Duh", notes:"Hello you!", signOut: null},
  {id: "3333", name: "Helena Montana", notes:"Who?", signOut: null},
  {id: "3213", name: "Mable Able", notes:"YEs I CaN!", signOut: "2020-03-09T06:25:58.313Z"}
];

test('renders all entries', () => {
  const tree = TestRenderer
    .create(<Logs searchValue={""} entries={entries} fetchEntries={() => {}}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders only Helena Montana with searchValue', () => {
  const tree = TestRenderer
    .create(<Logs searchValue={"helena"} entries={entries} fetchEntries={() => {}}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
