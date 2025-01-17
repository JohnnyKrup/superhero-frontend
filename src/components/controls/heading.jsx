import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

Heading.propTypes = {
  className: PropTypes.string,
  level: PropTypes.number,
};

export function Heading({ className, level = 1, ...props }) {
  let Element = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        className,
        "text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white"
      )}
    />
  );
}

Subheading.propTypes = {
  className: PropTypes.string,
  level: PropTypes.number,
};

export function Subheading({ className, level = 2, ...props }) {
  let Element = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        className,
        "text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white"
      )}
    />
  );
}
