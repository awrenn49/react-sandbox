import React, { Component } from 'react';

import 'react-widgets/dist/css/react-widgets.css';
import MultiSelect from 'react-widgets/lib/MultiSelect';

export const renderMultiSelect = (props) => {
  const { input, data, valueField, textField, values, onCreate, messages } = props;
  input.value = values; 
  return (
    <MultiSelect 
      {...input}
      onBlur={() => input.onBlur()}
      value={input.value || []}
      data={data}
      valueField={valueField}
      textField={textField}
      onChange={input.onChange}
    />
  );
}