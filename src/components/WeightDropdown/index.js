import Dropdown from "../Dropdown";
import { WEIGHTS } from "../../constants/weights";

const WeightDropdown = ({ value, unit = "kg", onChange }) => {
  return (
    <Dropdown
      value={value}
      options={WEIGHTS}
      onChange={onChange}
      title={`Select weight (${unit})`}
      formatOption={(weight) => `${weight} ${unit}`}
    />
  );
};

export default WeightDropdown;
