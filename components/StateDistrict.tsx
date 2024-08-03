import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { stateData } from "@/constants";
interface SelectProps {
  value: string | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.textColor};
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.dropdownBackgroundColor};
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const Select = styled.select<SelectProps>`
  background-color: ${({ theme }) => theme.selectBackgroundColor};
  color: ${({ theme }) => theme.selectTextColor};
  border: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 10px;
  width: 200px; /* added a fixed width for demo purposes */
  margin-right: 20px; /* added some margin between selects */
  &:focus {
    outline: none;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  }
`;

const theme = {
  backgroundColor: "#333",
  textColor: "#fff",
  dropdownBackgroundColor: "#444",
  selectBackgroundColor: "#555",
  selectTextColor: "#fff",
};

const NestedDropdown: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(event.target.value);
    setSelectedDistrict(null); // Reset district when state changes
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedDistrict(event.target.value);
  };

  return (
    <React.Fragment>
      <GlobalStyle theme={theme} />
      <DropdownContainer>
        <label htmlFor="state-select">State:</label>
        <Select
          id="state-select"
          value={selectedState || ""}
          onChange={handleStateChange}
          title="Select a state"
        >
          <option value="">Select State</option>
          {stateData.map((state, index) => (
            <option key={index} value={state.name}>
              {state.name}
            </option>
          ))}
        </Select>
        {selectedState && (
          <React.Fragment>
            <label htmlFor="district-select">District:</label>
            <Select
              id="district-select"
              value={selectedDistrict || ""}
              onChange={handleDistrictChange}
              title="Select a district"
            >
              <option value="">Select District</option>
              {stateData
                .find((state) => state.name === selectedState)
                ?.districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
            </Select>
          </React.Fragment>
        )}
      </DropdownContainer>
    </React.Fragment>
  );
};

export default NestedDropdown;
