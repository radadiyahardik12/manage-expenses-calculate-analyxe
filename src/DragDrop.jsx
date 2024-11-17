import React, { useRef, useState } from "react";

const DragDrop = () => {
  const [tasks, setTasks] = useState({
    todo: ["Task 1", "Task 2", "Task 3", "Task 6", "Task 7", "Task 8", "Task 9", "Task 10", "Task 11", "Task 12", "Task 13"],
    inprogress: ["Task 4"],
    complete: ["Task 5"],
  });

  const itemRef = useRef(null);
  const selectRef = useRef(null);

  const [isLiTag, setIsLiTag] = useState(false);
  const [itemName, setItemName] = useState('');
  const [selectLable, setSelectLable] = useState('');

  const addItemNew = () => {
    if (itemName.trim() == '') {
      itemRef.current.focus();
      itemRef.current.style.border = '1px solid red';
      return;
    }else if (selectLable == '') {
      selectRef.current.style.border = '1px solid red';
      return;
    }
    const additems = tasks[selectLable];
    additems.push(itemName)
    setTasks(
       { ...tasks, [selectLable]: additems }
    );
    setItemName('');
    setSelectLable('');
  }

  const onDragStart = (e, task, source, index) => {
    e.dataTransfer.setData("task", task);
    e.dataTransfer.setData("source", source);
    e.dataTransfer.setData("index", index);
    console.log("index: onDragStart " , index);

  };

  const onDrop = (e, index, destination) => {
    e.preventDefault();
    const task = e.dataTransfer.getData("task");
    const source = e.dataTransfer.getData("source");
    const oldindex = Number(e.dataTransfer.getData("index"));
    let newIndex = index
    if (newIndex == undefined) {
        newIndex = tasks[destination].length;
    }    

    if (source === destination) {
      setTasks((prevTasks) => {
        const columnTasks = [...prevTasks[source]];
        columnTasks.splice(oldindex, 1); 
        columnTasks.splice(newIndex, 0, task);
        return { ...prevTasks, [source]: columnTasks };
      });
    } else {
      setTasks((prevTasks) => {
        const sourceTasks = [...prevTasks[source]];
        const destinationTasks = [...prevTasks[destination]];

        sourceTasks.splice(oldindex, 1); 
        destinationTasks.splice(newIndex, 0, task); 

        return {
          ...prevTasks,
          [source]: sourceTasks,
          [destination]: destinationTasks,
        };
      });
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="h-screen bg-gray-100 p-8 my-10">
      <h1 className="text-4xl font-bold text-center mb-8">Drag & Drop To-Do</h1>
      <div className="flex justify-end my-3 gap-4">
        <div className="flex gap-3 ">
          <input 
            ref={itemRef}
            type="text" 
            name="item"
            placeholder="Enter your item name here"
            className="flex w-96 border-0 appearance-none border-none outline-none bg-gray-100 p-2 rounded-md ring-2 ring-blue-300 "
            value={itemName}
            onChange={(e) =>{
               setItemName(e.target.value);
               itemRef.current.style.border = 'none';
               }} />
          <div className="flex justify-center items-center w-40">
            <select 
            ref={selectRef}
            className="h-full w-40 appearance-none border-none outline-none bg-gray-100 p-2 rounded-md ring-2 ring-blue-300"
            value={selectLable}
            onClick={() =>{
              selectRef.current.style.border = 'none';
            }}
            onChange={(e) => setSelectLable(e.target.value)}
            >
              <option value="select_task" label="Select Task" key="item" hidden></option>
              <option value="todo" label="To-Do" key="item1"></option>
              <option value="inprogress" label="In Progress" key="item2"></option>
              <option value="complete" label="complete" key="item3"></option>
            </select>
          </div>
        </div>
        <div className="hover:bg-blue-400 cursor-pointer group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
          onClick={()=>{
            addItemNew();
          }}
        >
        <svg width="20" height="20" fill="currentColor" className="mr-2" aria-hidden="true">
          <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
        </svg>
        New Add
      </div>
      </div>
      <div className=" min-h-[450px] max-h-[450px] ma mb-5 grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <TaskColumn
          title="To-Do"
          tasks={tasks.todo}
          onDragStart={(e, task, index) => onDragStart(e, task, "todo", index)}
          onDrop={(e, i) => onDrop(e, i, "todo")}
          onDragOver={onDragOver}
          setIsLiTag={setIsLiTag}
          isLiTag={isLiTag}

        />
        <TaskColumn
          title="In Progress"
          tasks={tasks.inprogress}
          onDragStart={(e, task, index) =>
            onDragStart(e, task, "inprogress", index)
          }
          onDrop={(e, i) => onDrop(e, i, "inprogress")}
          onDragOver={onDragOver}
          setIsLiTag={setIsLiTag}
          isLiTag={isLiTag}

        />
        <TaskColumn
          title="Complete"
          tasks={tasks.complete}
          onDragStart={(e, task, index) =>
            onDragStart(e, task, "complete", index)
          }
          onDrop={(e, i) => onDrop(e, i, "complete")}
          onDragOver={onDragOver}
          setIsLiTag={setIsLiTag}
          isLiTag={isLiTag}
        />
      </div>
    </div>
  );
};

// Task Column Component
const TaskColumn = ({ title, tasks, onDragStart, onDrop, onDragOver, setIsLiTag, isLiTag }) => (
  <div
    className="h-full bg-white pt-0 p-6 rounded-lg shadow-md"
    onDragOver={onDragOver}
    onDrop={(e) => {
      if (isLiTag) {
        onDrop(e);
      }
    }}
  >
    {/* Sticky Header */}
    <h2 className="text-xl font-semibold h-10 mb-4 z-50 sticky top-0 bg-white shadow-sm">
      {title}
    </h2>
    {/* Scrollable Content */}
    <div className="overflow-y-auto max-h-[350px] scrollbar-hide">
      <ul className="space-y-3">
        {tasks.map((task, index) => (
          <TaskItem
            key={task}
            task={task}
            index={index}
            onDrop={onDrop}
            onDragStart={onDragStart}
            setIsLiTag={setIsLiTag}
          />
        ))}
      </ul>
    </div>
  </div>
);


// Task Item Component
const TaskItem = ({ task, index, onDragStart, onDrop, setIsLiTag }) => (
  <li
    className="bg-gray-100 p-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200"
    draggable
    onDragStart={(e) => onDragStart(e, task, index)}
    onDrop={(e) => onDrop(e,index)}  
    onDragEnter={() => setIsLiTag(false) }
    onDragLeave={() => setIsLiTag(true)}
  >
    {task}
  </li>
);

export default DragDrop;
