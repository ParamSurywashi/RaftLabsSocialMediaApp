import React from 'react';
import { Popup } from 'semantic-ui-react';

interface MyPopupProps {
  content: string;
  children: React.ReactNode;
}

function MyPopup({ content, children }: MyPopupProps) {
  return <Popup inverted content={content} trigger={children} />;
}

export default MyPopup;
