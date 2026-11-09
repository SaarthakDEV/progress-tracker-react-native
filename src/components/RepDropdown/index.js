import Dropdown from "../Dropdown";
import { REPS } from "../../constants/weights";

const RepDropdown = ({ value, onChange }) => {
  return (
    <Dropdown
      value={value}
      options={REPS}
      onChange={onChange}
      title="Select reps"
      formatOption={(reps) => `${reps} reps`}
    />
  );
};

export default RepDropdown;
