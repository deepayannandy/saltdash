import React from 'react'
import Select from 'react-select'
const InputSearch = (props) => {
  return (
    <div>
    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
        {props.placeholder}
      </label>
      <div class="relative">
        <Select list="data" name={props.name} isSearchable options={props.options} onChange={props.onchange} onInputChange={props.onInputChange} defaultValue={props.defaultvalue}></Select>
        
      </div>
    </div>
  )
}

export default InputSearch