import Dropdown from "../Dropdown";
import { PLATES } from "../../constants/plates";

const PlatesDropdown = ({ value, onChange }) => {
  return (
    <Dropdown
      value={value}
      options={PLATES}
      onChange={onChange}
      title="Select plates"
      formatOption={(plates) => `${plates} ${plates === 1 ? "plate" : "plates"}`}
    />
  );
};

export default PlatesDropdown;
