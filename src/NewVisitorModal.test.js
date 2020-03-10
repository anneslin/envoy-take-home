import React from 'react';
import ReactDOM from 'react-dom';
import NewVisitorModal from './NewVisitorModal';
import TestRenderer from 'react-test-renderer';

it('renders Logs without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NewVisitorModal modalOpen setModalOpen={(isOpen) => {console.log(isOpen)}} fetchEntries={() => {}}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('renders correctly when modalOpen', () => {
  const tree = TestRenderer
    .create(<NewVisitorModal modalOpen setModalOpen={(isOpen) => {console.log(isOpen)}} fetchEntries={() => {}}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly when !modalOpen', () => {
  const tree = TestRenderer
    .create(<NewVisitorModal modalOpen={false} setModalOpen={(isOpen) => {console.log(isOpen)}} fetchEntries={() => {}}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
