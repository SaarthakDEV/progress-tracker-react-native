import Dropdown from "../Dropdown";

const TagDropdown = ({ tags, value, onChange }) => {
  return (
    <Dropdown
      value={value}
      options={tags}
      onChange={onChange}
      title="Select tag"
      placeholder="No tag"
      getKey={(tag) => tag.id}
      formatOption={(tag) => tag.name}
    />
  );
};

export default TagDropdown;
