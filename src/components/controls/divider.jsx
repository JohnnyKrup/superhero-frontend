import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

Divider.propTypes = {
  soft: PropTypes.bool,
  className: PropTypes.string,
};

export function Divider({ soft = false, className, ...props }) {
  return (
    <hr
      role="presentation"
      {...props}
      className={clsx(
        className,
        "w-full border-t",
        soft && "border-zinc-950/5 dark:border-white/5",
        !soft && "border-zinc-950/10 dark:border-white/10"
      )}
    />
  );
}
