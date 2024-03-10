import React from 'react'
import Select from 'react-select'
const InputSearch = (props) => {
  return (
    <div>
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor="grid-state"
      >
        {props.placeholder}
      </label>
      <div className="relative">
        <Select
          list="data"
          name={props.name}
          isSearchable={true}
          isDisabled={props.isDisabled}
          options={props.options}
          value={props.value}
          onChange={props.onchange}
          onInputChange={props.onInputChange}
          defaultValue={props.defaultValue}
          isClearable={props.isClearable}
        ></Select>
      </div>
    </div>
  );
}

export default InputSearch