import React from 'react'

const ActionBar = ({ title = "Services", className, onSave, saveDisabled }) => {
  return (
    <div className='w-full px-3 sticky top-0 flex items-center justify-between py-3 bg-white border-b'>
      <h1 className={`text-base uppercase font-semibold ${className}`}>{title}</h1>
      {onSave && (
        <button
          onClick={onSave}
          disabled={saveDisabled}
          className='px-3 py-1.5 rounded bg-black text-white text-sm disabled:opacity-50'
        >
          Save
        </button>
      )}
    </div>
  )
}

export default ActionBar