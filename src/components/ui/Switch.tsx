import DefaultSwitch, { type ReactSwitchProps } from "react-switch";

function Switch(props: ReactSwitchProps) {
  return (
    <DefaultSwitch
      onColor="#9047ff"
      onHandleColor="#6e36c2"
      handleDiameter={18}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 2.5px rgba(0, 0, 0, 0.6)"
      activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
      height={15}
      width={32}
      {...props}
    />
  );
}

export default Switch;
