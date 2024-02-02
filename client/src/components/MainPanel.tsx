import { useEffect, useContext } from 'react';
import { HomeContext, HomeContextValues } from './HomeContext';

// type MainProp = {
//   conversationID: string;
// };

export function MainPanel() {
  const homeContext: HomeContextValues = useContext(HomeContext);
  //Reload chat everytime current conversation view is changed or messageEvent toggled.

  return (
    //Container
    <div>
      {/* Header */}
      <div className=""></div>
    </div>
  );
}
