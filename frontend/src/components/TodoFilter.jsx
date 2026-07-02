function TodoFilter({ filterType, setFilterType }) {

  const filters = [
    {
      value: "all",
      label: "All"
    },
    {
      value: "active",
      label: "Active"
    },
    {
      value: "done",
      label: "Completed"
    }
  ];


  return (
    <div className="filter-box">

      <i className="fa-solid fa-filter"></i>


      <select
        value={filterType}
        onChange={(e)=>setFilterType(e.target.value)}
      >

        {
          filters.map((item)=>(
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))
        }

      </select>


    </div>
  );
}


export default TodoFilter;