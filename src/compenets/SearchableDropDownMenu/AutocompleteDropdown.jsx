import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

export default function AutocompleteDropdown({ 
  options, 
  placeholder, 
  getOptionLabel, 
  onChange, 
  className,
  menuWidth = 'auto' // New prop for menu width
}) {
  return (
    <Autocomplete
      options={options || []}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: '1px solid #3b82f6', // blue-500
              },
            },
          }}
        />
      )}
      onChange={(event, newValue) => onChange(newValue)}
      sx={{ minWidth: 100, direction: 'rtl' }}
      className={`w-full md:w-auto ${className}`}
      // Control the dropdown menu width using slotProps
      slotProps={{
        listbox: {
          sx: {
            width: menuWidth,
            maxWidth: 'none',
          }
        },
        paper: {
          sx: {
            width: menuWidth,
            maxWidth: 'none',
          }
        }
      }}
    />
  );
}