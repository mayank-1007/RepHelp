import React, { useState } from "react";
import Select from "react-select";
import { css } from "@emotion/css";
import {
  RoomNumber,
  Identificationtypes,
  countries,
} from "@/constants";
const customStyles = {
  control: (provided: any) => ({
    ...provided,
    minHeight: "40px",
    backgroundColor: "#222",
    borderColor: "#444",
    color: "#ddd",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#666",
    },
    padding: "5px", // Added padding
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#222",
    zIndex: 9999,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#333"
      : state.isFocused
        ? "#444"
        : "#222",
    color: "#ddd",
    "&:active": {
      backgroundColor: "#555",
    },
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#ddd",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#aaa",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#aaa",
    "&:hover": {
      color: "#ddd",
    },
  }),
  input: (provided: any) => ({
    ...provided,
    color: "#ddd",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
  }),
};

const CountrySelect: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (option: any) => {
    setSelectedOption(option);
  };

  return (
    <div
      className={css`
        width: 300px;
        margin: 0 auto;
        background-color: #222;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      `}
    >
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={countries}
        styles={customStyles}
        placeholder="Select a country..."
        isSearchable
      />
    </div>
  );
};

export default CountrySelect;
