import { Variants } from "framer-motion";

export const pageVariants: Variants = {
  initial: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
      duration: 0.5,
    },
    scale: 0.9,
  },
  animate: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
      duration: 0.5,
    },
    scale: 1,
  },
  exit: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
      duration: 0.5,
    },
    scale: 0.9,
  },
};

export const appComponentVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
    transition: {
      duration: 0.2,
    },
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.2,
    },
  },
};
