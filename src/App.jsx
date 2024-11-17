import React from 'react';
import DragDrop from './DragDrop';

const App = () => {
    return (
        <div className=" flex flex-col h-screen px-2 md:px-20 text-center space-y-8 overflow-y-auto scrollbar-hide ">
        <DragDrop />
        </div>
    );
};

export default App;
