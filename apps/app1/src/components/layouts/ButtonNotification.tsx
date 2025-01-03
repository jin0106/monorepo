import { BellIcon } from "@heroicons/react/24/outline";

const ButtonNotification = () => {
  return (
    <button className="btn btn-ghost ml-4  btn-circle">
      <div className="indicator">
        <BellIcon className="h-6 w-6" />
        <span className="indicator-item badge badge-secondary badge-sm">5</span>
      </div>
    </button>
  );
};

export default ButtonNotification;
